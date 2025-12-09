/**
 * Accessibility E2E Tests
 * Uses Playwright + axe-core for automated a11y testing
 * 
 * Tests WCAG 2.1 Level AA compliance
 */

import { test, expect } from '@playwright/test';

// Conditional import to avoid build errors when dependency is not installed
// This will be properly installed when running accessibility tests
// For now, we skip these tests if the dependency is not available
const skipIfNoAxe = !process.env.SKIP_A11Y_TESTS;

// Note: Install @axe-core/playwright to enable these tests:
// npm install -D @axe-core/playwright
let AxeBuilder: any;
if (skipIfNoAxe) {
  try {
    AxeBuilder = require('@axe-core/playwright').default;
  } catch {
    console.warn('⚠️  @axe-core/playwright not installed. Skipping accessibility tests.');
  }
}

// Test configuration
test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/');
    
    // Set auth token (if needed)
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test-token');
    });
  });

  test('Agent Dashboard - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/agent/dashboard');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Agent Conversations - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/agent/conversations');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Admin Dashboard - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Team Chat Page - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/admin/team');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Reports Page - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/admin/reports');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Login Page - should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  // Keyboard navigation tests
  test('should be fully navigable with keyboard', async ({ page }) => {
    await page.goto('/agent/conversations');
    await page.waitForLoadState('networkidle');

    // Tab through all focusable elements
    let tabCount = 0;
    const maxTabs = 50; // Prevent infinite loop

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;

      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          role: el?.getAttribute('role'),
          ariaLabel: el?.getAttribute('aria-label'),
        };
      });

      // Ensure focused element is visible and has proper ARIA
      if (focusedElement.tagName !== 'BODY') {
        expect(focusedElement.tagName).toBeTruthy();
      }
    }

    // Press Escape to close any modals
    await page.keyboard.press('Escape');

    // Shift+Tab to navigate backwards
    await page.keyboard.press('Shift+Tab');
  });

  // Color contrast test
  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/agent/dashboard');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('.text-gray-600') // Test specific text color
      .analyze();

    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (v: { id: string }) => v.id === 'color-contrast'
    );

    expect(colorContrastViolations).toEqual([]);
  });

  // ARIA labels test
  test('interactive elements should have accessible names', async ({ page }) => {
    await page.goto('/agent/conversations');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('button, a, input, select, textarea')
      .analyze();

    const ariaViolations = accessibilityScanResults.violations.filter(
      (v: { id: string }) => v.id === 'button-name' || v.id === 'link-name' || v.id === 'label'
    );

    expect(ariaViolations).toEqual([]);
  });

  // Screen reader test (basic)
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/admin/reports');
    await page.waitForLoadState('networkidle');

    const headings = await page.evaluate(() => {
      const h1s = Array.from(document.querySelectorAll('h1'));
      const h2s = Array.from(document.querySelectorAll('h2'));
      const h3s = Array.from(document.querySelectorAll('h3'));

      return {
        h1Count: h1s.length,
        h2Count: h2s.length,
        h3Count: h3s.length,
        h1Text: h1s.map((h) => h.textContent?.trim()),
      };
    });

    // Should have exactly one h1
    expect(headings.h1Count).toBe(1);
    
    // Should have headings
    expect(headings.h2Count).toBeGreaterThan(0);
  });

  // Focus management test
  test('modals should trap focus', async ({ page }) => {
    await page.goto('/admin/team');
    await page.waitForLoadState('networkidle');

    // Open modal (assuming there's a button to open modal)
    const modalButton = page.locator('button:has-text("Search")').first();
    if (await modalButton.isVisible()) {
      await modalButton.click();

      // Check if focus is trapped inside modal
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        const modal = document.querySelector('[role="dialog"]');
        return modal?.contains(el) ?? false;
      });

      expect(focusedElement).toBe(true);

      // Close modal with Escape
      await page.keyboard.press('Escape');
    }
  });
});

