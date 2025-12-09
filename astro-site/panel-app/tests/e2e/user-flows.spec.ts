/**
 * Critical User Flow E2E Tests
 * 
 * @group e2e
 * @group critical-flows
 * 
 * Tests the 4 most critical user journeys:
 * 1. Admin Login → Dashboard → Reports → Logout
 * 2. Agent Login → Conversations → Send Message → Logout
 * 3. Super Admin Login → Tenants → View Tenant → Logout
 * 4. Admin Login → Team Chat → Send Message → Logout
 */

import { test, expect } from '@playwright/test';

// ==================== FLOW 1: Admin Dashboard Journey ====================
test.describe('Admin Dashboard Flow', () => {
  test('should complete full admin dashboard journey', async ({ page }) => {
    // Step 1: Navigate to login
    await page.goto('/');
    await expect(page).toHaveTitle(/AsistanApp/i);

    // Step 2: Login as admin
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Step 3: Wait for dashboard to load
    await page.waitForURL(/\/admin/);
    await expect(page.getByText(/dashboard|ana sayfa/i)).toBeVisible();

    // Step 4: Navigate to reports
    await page.click('a[href*="/reports"]');
    await page.waitForURL(/\/admin\/reports/);
    await expect(page.getByText(/raporlar/i)).toBeVisible();

    // Step 5: View a report modal
    await page.locator('button:has-text("Detayları Gör")').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Step 6: Close modal
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Step 7: Logout
    await page.click('button[aria-label="User menu"]');
    await page.click('button:has-text("Çıkış")');
    await page.waitForURL('/');

    // Verify logout
    await expect(page.getByText(/giriş yap/i)).toBeVisible();
  });

  test('should handle navigation errors gracefully', async ({ page }) => {
    await page.goto('/admin/dashboard');
    
    // Should redirect to login if not authenticated
    await page.waitForURL('/');
    await expect(page.getByText(/giriş yap/i)).toBeVisible();
  });
});

// ==================== FLOW 2: Agent Conversations Journey ====================
test.describe('Agent Conversations Flow', () => {
  test('should complete agent message sending journey', async ({ page }) => {
    // Step 1: Login as agent
    await page.goto('/');
    await page.fill('input[name="email"]', 'agent@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Step 2: Navigate to conversations
    await page.waitForURL(/\/agent/);
    await page.click('a[href*="/conversations"]');
    await page.waitForURL(/\/agent\/conversations/);

    // Step 3: Select a conversation
    await page.locator('[data-testid="conversation-item"]').first().click();
    await expect(page.getByTestId('message-area')).toBeVisible();

    // Step 4: Type and send a message
    const messageInput = page.getByPlaceholder(/mesaj yaz/i);
    await messageInput.fill('Test message from E2E test');
    await messageInput.press('Enter');

    // Step 5: Verify message was sent
    await expect(page.getByText('Test message from E2E test')).toBeVisible();

    // Step 6: Take over conversation from AI
    await page.click('button:has-text("Devral")');
    await expect(page.getByText(/başarıyla devralındı/i)).toBeVisible();

    // Step 7: Resolve conversation
    await page.click('button:has-text("Çöz")');
    await expect(page.getByText(/çözüldü/i)).toBeVisible();

    // Step 8: Logout
    await page.click('button[aria-label="User menu"]');
    await page.click('button:has-text("Çıkış")');
  });

  test('should handle empty message submission', async ({ page }) => {
    await page.goto('/agent/conversations');
    
    // Try to send empty message
    const sendButton = page.getByRole('button', { name: /gönder/i });
    await expect(sendButton).toBeDisabled();
  });
});

// ==================== FLOW 3: Super Admin Tenants Journey ====================
test.describe('Super Admin Tenants Flow', () => {
  test('should complete super admin tenant management journey', async ({ page }) => {
    // Step 1: Login as super admin
    await page.goto('/');
    await page.fill('input[name="email"]', 'superadmin@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Step 2: Navigate to tenants
    await page.waitForURL(/\/asistansuper/);
    await page.click('a[href*="/tenants"]');
    await page.waitForURL(/\/asistansuper\/tenants/);

    // Step 3: Search for a tenant
    await page.fill('input[placeholder*="Ara"]', 'Test Tenant');
    await page.waitForTimeout(500); // Wait for debounce

    // Step 4: View tenant details
    await page.locator('[data-testid="tenant-row"]').first().click();
    await expect(page.getByText(/firma detayları/i)).toBeVisible();

    // Step 5: Check tenant metrics
    await expect(page.getByText(/kullanıcı sayısı/i)).toBeVisible();
    await expect(page.getByText(/görüşme sayısı/i)).toBeVisible();

    // Step 6: Navigate to financial reports
    await page.click('a[href*="/financial"]');
    await page.waitForURL(/\/asistansuper\/financial/);
    await expect(page.getByText(/finansal raporlar/i)).toBeVisible();

    // Step 7: Export report
    await page.click('button:has-text("Excel")');
    // Wait for download (mock)
    await page.waitForTimeout(1000);

    // Step 8: Logout
    await page.click('button[aria-label="User menu"]');
    await page.click('button:has-text("Çıkış")');
  });

  test('should handle tenant actions', async ({ page }) => {
    await page.goto('/asistansuper/tenants');
    
    // Suspend tenant
    await page.locator('button[aria-label="Actions"]').first().click();
    await page.click('button:has-text("Askıya Al")');
    
    // Confirm action
    await page.click('button:has-text("Onayla")');
    await expect(page.getByText(/askıya alındı/i)).toBeVisible();
  });
});

// ==================== FLOW 4: Admin Team Chat Journey ====================
test.describe('Admin Team Chat Flow', () => {
  test('should complete team chat communication journey', async ({ page }) => {
    // Step 1: Login as admin
    await page.goto('/');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Step 2: Navigate to team chat
    await page.waitForURL(/\/admin/);
    await page.click('a[href*="/team"]');
    await page.waitForURL(/\/admin\/team/);

    // Step 3: Select a channel
    await page.locator('[data-testid="channel-item"]').first().click();
    await expect(page.getByTestId('chat-messages')).toBeVisible();

    // Step 4: Send a message
    const input = page.getByPlaceholder(/mesaj yaz/i);
    await input.fill('Team chat E2E test message');
    await input.press('Enter');

    // Step 5: Verify message appears
    await expect(page.getByText('Team chat E2E test message')).toBeVisible();

    // Step 6: React to a message
    await page.locator('[data-testid="message-item"]').first().hover();
    await page.click('button[aria-label="Add reaction"]');
    await page.click('button:has-text("👍")');
    await expect(page.getByText('👍')).toBeVisible();

    // Step 7: Search messages
    await page.click('button[aria-label="Search"]');
    await page.fill('input[placeholder*="Ara"]', 'test');
    await page.waitForTimeout(300);
    await expect(page.getByTestId('search-results')).toBeVisible();

    // Step 8: Create new channel
    await page.click('button:has-text("Yeni Kanal")');
    await page.fill('input[name="channelName"]', 'E2E Test Channel');
    await page.click('button:has-text("Oluştur")');
    await expect(page.getByText('E2E Test Channel')).toBeVisible();

    // Step 9: Logout
    await page.click('button[aria-label="User menu"]');
    await page.click('button:has-text("Çıkış")');
  });

  test('should handle file attachments', async ({ page }) => {
    await page.goto('/admin/team');
    
    // Open attach menu
    await page.click('button[aria-label="Attach file"]');
    
    // Upload file (mock)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test file content'),
    });

    // Verify file upload
    await expect(page.getByText('test-document.pdf')).toBeVisible();
  });
});

// ==================== CROSS-CUTTING CONCERNS ====================
test.describe('Dark Mode Toggle', () => {
  test('should persist theme preference across navigation', async ({ page }) => {
    await page.goto('/');
    
    // Toggle dark mode
    await page.click('button[aria-label="Toggle theme"]');
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Navigate to another page
    await page.goto('/admin/dashboard');
    
    // Dark mode should persist
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('Responsive Behavior', () => {
  test('should adapt layout for mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/dashboard');

    // Mobile menu should be visible
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
    
    // Desktop sidebar should be hidden
    await expect(page.getByTestId('desktop-sidebar')).not.toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should show error boundary on component error', async ({ page }) => {
    // Trigger an error (mock)
    await page.goto('/admin/dashboard?triggerError=true');
    
    await expect(page.getByText(/bir hata oluştu/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /yeniden dene/i })).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page, context }) => {
    // Simulate offline
    await context.setOffline(true);
    
    await page.goto('/admin/dashboard');
    await expect(page.getByText(/bağlantı hatası/i)).toBeVisible();
    
    // Go back online
    await context.setOffline(false);
    await page.reload();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });
});

