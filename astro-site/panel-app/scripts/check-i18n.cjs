#!/usr/bin/env node

/**
 * i18n Hard-coded Text Scanner
 * 
 * Scans codebase for hard-coded Turkish/English text that should be in translation files
 * 
 * Usage:
 *   node scripts/check-i18n.js
 *   node scripts/check-i18n.js --fix  (auto-generate keys)
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const SOURCE_DIR = path.join(__dirname, '../src');
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const FILE_PATTERNS = ['**/*.tsx', '**/*.ts'];
const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/__tests__/**',
  '**/*.test.*',
  '**/*.stories.*',
  '**/dist/**',
  '**/build/**',
];

// Patterns to detect hard-coded text
const HARDCODED_PATTERNS = [
  // Turkish text in JSX
  />\s*(['"`])([A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}.*?)\1\s*</g,
  
  // String literals in placeholders
  /placeholder\s*=\s*['"`]([^'"`]+)['"`]/g,
  
  // aria-label with hard-coded text
  /aria-label\s*=\s*['"`]([^'"`]+)['"`]/g,
  
  // title attribute with hard-coded text
  /title\s*=\s*['"`]([^'"`]+)['"`]/g,
  
  // Button/Link text
  /<(?:button|a)[^>]*>\s*(['"`])?([A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}.*?)\1?\s*<\/(?:button|a)>/g,
  
  // alert, confirm, prompt
  /(?:alert|confirm|prompt)\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
  
  // console.log with Turkish text (for debugging)
  /console\.\w+\s*\(\s*['"`]([A-ZÇĞİÖŞÜ][^'"`]*?)['"`]/g,
];

// Exceptions (text that's intentionally hard-coded)
const EXCEPTIONS = [
  /^(true|false|null|undefined)$/,
  /^[\d\s\.,]+$/,  // Numbers and punctuation
  /^[A-Z_]+$/,     // Constants
  /^#[0-9a-fA-F]{3,8}$/,  // Hex colors
  /^https?:\/\//,   // URLs
  /^\/[\/\w-]+$/,   // Paths
  /^test|mock|example/i,  // Test/mock data
  /^[a-z]+\.[a-z]+$/,  // Property access (e.g., user.name)
  /^\w+\(\)$/,      // Function calls
];

class I18nScanner {
  constructor() {
    this.issues = [];
    this.stats = {
      filesScanned: 0,
      hardcodedStrings: 0,
      suggestions: 0,
    };
  }

  /**
   * Check if text should be ignored
   */
  isException(text) {
    if (!text || text.trim().length === 0) return true;
    if (text.length < 3) return true;
    
    return EXCEPTIONS.some(pattern => pattern.test(text.trim()));
  }

  /**
   * Generate i18n key from text
   */
  generateKey(text, context = 'common') {
    const cleaned = text
      .toLowerCase()
      .replace(/[çÇ]/g, 'c')
      .replace(/[ğĞ]/g, 'g')
      .replace(/[ıİ]/g, 'i')
      .replace(/[öÖ]/g, 'o')
      .replace(/[şŞ]/g, 's')
      .replace(/[üÜ]/g, 'u')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
    
    return `${context}.${cleaned}`;
  }

  /**
   * Scan a single file for hard-coded text
   */
  scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(SOURCE_DIR, filePath);
    
    // Determine context from file path
    const context = this.getContext(relativePath);
    
    HARDCODED_PATTERNS.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      
      while ((match = regex.exec(content)) !== null) {
        const text = match[2] || match[1];
        
        if (!this.isException(text)) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          
          this.issues.push({
            file: relativePath,
            line: lineNumber,
            text,
            key: this.generateKey(text, context),
            context,
          });
          
          this.stats.hardcodedStrings++;
        }
      }
    });
    
    this.stats.filesScanned++;
  }

  /**
   * Determine context from file path
   */
  getContext(filePath) {
    if (filePath.includes('/admin/')) return 'admin';
    if (filePath.includes('/agent/')) return 'agent';
    if (filePath.includes('/super-admin/')) return 'superAdmin';
    if (filePath.includes('/auth/')) return 'auth';
    if (filePath.includes('/errors/')) return 'errors';
    if (filePath.includes('/validation/')) return 'validation';
    return 'common';
  }

  /**
   * Scan all files
   */
  async scanAll() {
    console.log('🔍 Scanning for hard-coded text...\n');
    
    const files = await glob(FILE_PATTERNS, {
      cwd: SOURCE_DIR,
      ignore: IGNORE_PATTERNS,
      absolute: true,
    });
    
    files.forEach(file => this.scanFile(file));
    
    this.printReport();
  }

  /**
   * Print scan report
   */
  printReport() {
    console.log('\n📊 Scan Results:\n');
    console.log(`  Files scanned: ${this.stats.filesScanned}`);
    console.log(`  Hard-coded strings found: ${this.stats.hardcodedStrings}\n`);
    
    if (this.issues.length === 0) {
      console.log('✅ No hard-coded strings found!\n');
      return;
    }
    
    // Group by context
    const byContext = {};
    this.issues.forEach(issue => {
      if (!byContext[issue.context]) {
        byContext[issue.context] = [];
      }
      byContext[issue.context].push(issue);
    });
    
    // Print by context
    Object.keys(byContext).sort().forEach(context => {
      console.log(`\n📁 Context: ${context}`);
      console.log('─'.repeat(80));
      
      byContext[context].forEach((issue, index) => {
        console.log(`\n  ${index + 1}. ${issue.file}:${issue.line}`);
        console.log(`     Text: "${issue.text}"`);
        console.log(`     Suggested key: ${issue.key}`);
        console.log(`     Replace with: {t('${issue.key}')}`);
      });
    });
    
    console.log('\n\n💡 Recommendations:\n');
    console.log('  1. Add translations to public/locales/{tr,en}/<context>.json');
    console.log('  2. Replace hard-coded text with {t(\'key\')}');
    console.log('  3. Import useTranslation: const { t } = useTranslation(\'<context>\')');
    console.log('\n');
  }

  /**
   * Generate translation file template
   */
  generateTranslationTemplate() {
    const byContext = {};
    
    this.issues.forEach(issue => {
      if (!byContext[issue.context]) {
        byContext[issue.context] = {};
      }
      
      const key = issue.key.split('.')[1];
      byContext[issue.context][key] = issue.text;
    });
    
    Object.keys(byContext).forEach(context => {
      const outputPath = path.join(LOCALES_DIR, 'tr', `${context}-suggestions.json`);
      fs.writeFileSync(
        outputPath,
        JSON.stringify(byContext[context], null, 2),
        'utf-8'
      );
      console.log(`✅ Generated: ${outputPath}`);
    });
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  
  const scanner = new I18nScanner();
  await scanner.scanAll();
  
  if (shouldFix && scanner.issues.length > 0) {
    console.log('\n🔧 Generating translation templates...\n');
    scanner.generateTranslationTemplate();
  }
  
  // Exit with error code if issues found
  process.exit(scanner.issues.length > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { I18nScanner };

