#!/usr/bin/env node

/**
 * Auto i18n Replacement Script
 * 
 * Automatically replaces common hard-coded strings with translation keys
 * 
 * Usage:
 *   node scripts/auto-i18n-replace.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Common replacements that are safe to auto-replace
const COMMON_REPLACEMENTS = {
  // Action words (already in common.json)
  '"Düzenle"': "t('common.edit')",
  '"Sil"': "t('common.delete')",
  '"Kaydet"': "t('common.save')",
  '"İptal"': "t('common.cancel')",
  '"Ekle"': "t('common.add')",
  '"Ara"': "t('common.search')",
  '"Kapat"': "t('common.close')",
  '"Geri"': "t('common.back')",
  '"İleri"': "t('common.next')",
  '"Onayla"': "t('common.confirm')",
  '"Devam Et"': "t('common.continue')",
  '"Gönder"': "t('common.submit')",
  '"Yenile"': "t('common.refresh')",
  '"Daha Fazla"': "t('common.more')",
  '"Detaylar"': "t('common.details')",
  '"Oluştur"': "t('common.create')",
  '"Güncelle"': "t('common.update')",
  
  // Common messages
  '"Yükleniyor..."': "t('common.loading')",
  '"Veri bulunamadı"': "t('messages.noData')",
  '"Sonuç bulunamadı"': "t('messages.noResults')",
  '"Bir hata oluştu"': "t('messages.errorOccurred')",
  
  // Status
  '"Aktif"': "t('status.active')",
  '"Pasif"': "t('status.inactive')",
  '"Beklemede"': "t('status.pending')",
  '"Tamamlandı"': "t('status.completed')",
};

// Placeholders (context-specific, need careful replacement)
const PLACEHOLDER_PATTERNS = [
  {
    pattern: /"(.*? ara\.\.\.)"/, // "... ara..." patterns
    replacement: (match, text) => {
      const key = text.toLowerCase()
        .replace(/\s+ara\.\.\./g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '_');
      return `t('placeholders.search_${key}')`;
    }
  }
];

async function findTsxFiles() {
  const sourceDir = path.join(__dirname, '../src');
  return glob('**/*.{tsx,ts}', {
    cwd: sourceDir,
    ignore: [
      '**/node_modules/**',
      '**/__tests__/**',
      '**/*.test.*',
      '**/*.stories.*',
      '**/dist/**',
      '**/build/**',
    ],
    absolute: true,
  });
}

function replaceInFile(filePath, dryRun = false) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let replacements = 0;
  const changes = [];

  // Check if file already imports useTranslation
  const hasTranslation = content.includes('useTranslation') || content.includes("from 'react-i18next'");
  
  // Apply common replacements
  for (const [search, replace] of Object.entries(COMMON_REPLACEMENTS)) {
    if (content.includes(search)) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, replace);
        replacements += matches.length;
        changes.push(`  ${search} → ${replace} (${matches.length}x)`);
      }
    }
  }

  if (replacements > 0) {
    // Add useTranslation import if not present
    if (!hasTranslation && filePath.endsWith('.tsx')) {
      // Check if it's a React component file
      if (content.includes('export') && (content.includes('function') || content.includes('const'))) {
        // Add import at the top (after existing imports)
        const importMatch = content.match(/^(import .*from ['"].*['"];?\n)+/m);
        if (importMatch) {
          const importBlock = importMatch[0];
          const newImport = "import { useTranslation } from 'react-i18next';\n";
          if (!importBlock.includes('useTranslation')) {
            content = content.replace(importBlock, importBlock + newImport);
            changes.push('  + Added useTranslation import');
          }
        }
      }
    }

    if (!dryRun) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }

    return { replacements, changes, modified: true };
  }

  return { replacements: 0, changes: [], modified: false };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🌍 Auto i18n Replacement');
  console.log('========================\n');

  if (dryRun) {
    console.log('📝 DRY RUN MODE - No files will be modified\n');
  }

  const files = await findTsxFiles();
  console.log(`📁 Found ${files.length} files to process\n`);

  let totalReplacements = 0;
  let modifiedFiles = 0;
  const fileResults = [];

  for (const file of files) {
    const result = replaceInFile(file, dryRun);
    if (result.modified) {
      modifiedFiles++;
      totalReplacements += result.replacements;
      fileResults.push({
        file: path.relative(path.join(__dirname, '../src'), file),
        ...result,
      });
    }
  }

  // Print results
  if (fileResults.length > 0) {
    console.log('✅ Modified Files:\n');
    fileResults.forEach(({ file, replacements, changes }) => {
      console.log(`📄 ${file}`);
      console.log(`   ${replacements} replacements:`);
      changes.forEach(change => console.log(change));
      console.log('');
    });
  }

  console.log('📊 Summary:');
  console.log(`   Files scanned: ${files.length}`);
  console.log(`   Files modified: ${modifiedFiles}`);
  console.log(`   Total replacements: ${totalReplacements}`);

  if (dryRun) {
    console.log('\n💡 Run without --dry-run to apply changes');
  } else {
    console.log('\n✅ Changes applied successfully!');
    console.log('⚠️  Remember to:');
    console.log('   1. Add const { t } = useTranslation(); to component bodies');
    console.log('   2. Test all modified files');
    console.log('   3. Run npm run build to verify');
  }
}

main().catch(console.error);

