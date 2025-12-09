/**
 * Lighthouse CI Configuration
 * 
 * Performance, accessibility, best practices, and SEO audits
 * for all major pages in the application
 */

module.exports = {
  ci: {
    collect: {
      // URLs to audit
      url: [
        'http://localhost:4173/',                    // Login page
        'http://localhost:4173/admin/dashboard',     // Admin dashboard
        'http://localhost:4173/admin/conversations', // Admin conversations
        'http://localhost:4173/admin/reports',       // Admin reports
        'http://localhost:4173/admin/team',          // Admin team chat
        'http://localhost:4173/agent/conversations', // Agent conversations
        'http://localhost:4173/agent/dashboard',     // Agent dashboard
        'http://localhost:4173/asistansuper/dashboard', // Super admin dashboard
        'http://localhost:4173/asistansuper/tenants',   // Super admin tenants
        'http://localhost:4173/asistansuper/financial', // Super admin financial
      ],
      
      // Number of runs per URL
      numberOfRuns: 3,
      
      // Lighthouse settings
      settings: {
        // Chrome flags
        chromeFlags: '--no-sandbox --disable-gpu',
        
        // Only audit these categories
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
        ],
        
        // Disable features that can cause issues in CI
        skipAudits: [
          'uses-http2',
          'uses-long-cache-ttl',
        ],
        
        // Emulation settings
        emulatedFormFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    
    assert: {
      // Performance thresholds
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Specific metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        
        // Resource hints
        'uses-rel-preconnect': 'off',
        'uses-rel-preload': 'off',
        
        // Image optimization
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'offscreen-images': ['warn', { maxLength: 0 }],
        
        // JavaScript
        'unused-javascript': ['warn', { maxLength: 3 }],
        'mainthread-work-breakdown': ['warn', { maxNumericValue: 4000 }],
        'bootup-time': ['warn', { maxNumericValue: 3500 }],
        
        // Network
        'network-requests': ['warn', { maxNumericValue: 50 }],
        'total-byte-weight': ['warn', { maxNumericValue: 3000000 }],
      },
    },
    
    upload: {
      // Upload results to Lighthouse CI server (if configured)
      target: 'temporary-public-storage',
    },
  },
};

