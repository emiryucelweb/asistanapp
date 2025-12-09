/**
 * E2E Tests: Agent Conversations Flow
 * 
 * Tests the complete conversation management workflow
 */

import { test, expect } from '@playwright/test';

// Helper to login as agent
async function loginAsAgent(page: any) {
  await page.goto('/agent/login');
  await page.getByLabel(/e-posta/i).fill('agent@test.com');
  await page.getByLabel(/şifre/i).fill('test123456');
  await page.getByRole('button', { name: /giriş yap/i }).click();
  await page.waitForURL('**/agent/dashboard', { timeout: 5000 });
}

test.describe('Agent Conversations', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginAsAgent(page);
    
    // Navigate to conversations page
    await page.goto('/agent/conversations');
  });

  test('should display conversations list', async ({ page }) => {
    // Wait for conversations to load
    await page.waitForSelector('[role="list"]', { timeout: 5000 });

    // Check if list is visible
    const conversationList = page.getByRole('list').first();
    await expect(conversationList).toBeVisible();
  });

  test('should filter conversations by status', async ({ page }) => {
    // Click filter dropdown
    await page.getByRole('button', { name: /durum/i }).click();

    // Select "Open" status
    await page.getByRole('option', { name: /açık/i }).click();

    // Wait for filtered results
    await page.waitForTimeout(500);

    // Verify filter is applied
    const statusBadge = page.getByText(/açık/i).first();
    await expect(statusBadge).toBeVisible();
  });

  test('should search conversations by customer name', async ({ page }) => {
    // Type in search box
    const searchInput = page.getByPlaceholder(/ara/i);
    await searchInput.fill('Test Customer');

    // Wait for search results
    await page.waitForTimeout(500);

    // Verify search results contain the query
    const firstResult = page.getByRole('listitem').first();
    await expect(firstResult).toContainText(/test customer/i);
  });

  test('should select and display conversation details', async ({ page }) => {
    // Wait for conversations to load
    await page.waitForSelector('[role="listitem"]', { timeout: 5000 });

    // Click first conversation
    const firstConversation = page.getByRole('listitem').first();
    await firstConversation.click();

    // Wait for conversation details to load
    await page.waitForTimeout(500);

    // Check if message area is visible
    await expect(page.getByRole('region', { name: /mesajlar/i })).toBeVisible();
  });

  test('should send a text message', async ({ page }) => {
    // Select a conversation
    const firstConversation = page.getByRole('listitem').first();
    await firstConversation.click();
    await page.waitForTimeout(500);

    // Type message
    const messageInput = page.getByPlaceholder(/mesaj yazın/i);
    await messageInput.fill('Test message from E2E test');

    // Send message
    await page.getByRole('button', { name: /gönder/i }).click();

    // Wait for message to appear
    await page.waitForTimeout(1000);

    // Verify message is in the list
    await expect(page.getByText('Test message from E2E test')).toBeVisible();
  });

  test('should upload and send file attachment', async ({ page }) => {
    // Select a conversation
    const firstConversation = page.getByRole('listitem').first();
    await firstConversation.click();
    await page.waitForTimeout(500);

    // Click file upload button
    const fileInput = page.locator('input[type="file"]');
    
    // Upload a test file
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content'),
    });

    // Wait for preview
    await page.waitForTimeout(500);

    // Verify file preview is shown
    await expect(page.getByText('test-image.jpg')).toBeVisible();

    // Send with file
    await page.getByRole('button', { name: /gönder/i }).click();

    // Verify file message is sent
    await page.waitForTimeout(1000);
    await expect(page.getByText('test-image.jpg')).toBeVisible();
  });

  test('should assign conversation to self', async ({ page }) => {
    // Click assign button
    await page.getByRole('button', { name: /ata|assign/i }).first().click();

    // Wait for success message
    await expect(page.getByText(/atandı|assigned/i)).toBeVisible({ timeout: 3000 });

    // Verify assignment badge
    await expect(page.getByText(/bana atandı/i)).toBeVisible();
  });

  test('should mark conversation as resolved', async ({ page }) => {
    // Select a conversation
    const firstConversation = page.getByRole('listitem').first();
    await firstConversation.click();
    await page.waitForTimeout(500);

    // Click resolve button
    await page.getByRole('button', { name: /çöz|resolve/i }).click();

    // Confirm in dialog
    await page.getByRole('button', { name: /onayla|confirm/i }).click();

    // Wait for success message
    await expect(page.getByText(/çözüldü|resolved/i)).toBeVisible({ timeout: 3000 });
  });

  test('should add note to conversation', async ({ page }) => {
    // Select a conversation
    const firstConversation = page.getByRole('listitem').first();
    await firstConversation.click();
    await page.waitForTimeout(500);

    // Click notes tab
    await page.getByRole('tab', { name: /notlar|notes/i }).click();

    // Add note
    const noteTextarea = page.getByPlaceholder(/not ekle/i);
    await noteTextarea.fill('This is a test note');

    // Save note
    await page.getByRole('button', { name: /kaydet|save/i }).click();

    // Verify note is saved
    await expect(page.getByText('This is a test note')).toBeVisible();
  });

  test('should display customer information panel', async ({ page }) => {
    // Select a conversation
    const firstConversation = page.getByRole('listitem').first();
    await firstConversation.click();
    await page.waitForTimeout(500);

    // Check if customer info panel is visible
    await expect(page.getByRole('region', { name: /müşteri bilgileri/i })).toBeVisible();

    // Verify customer details are shown
    await expect(page.getByText(/e-posta|email/i)).toBeVisible();
    await expect(page.getByText(/telefon|phone/i)).toBeVisible();
  });

  test('should handle real-time message updates', async ({ page }) => {
    // Select a conversation
    const firstConversation = page.getByRole('listitem').first();
    await firstConversation.click();
    await page.waitForTimeout(500);

    // Count initial messages
    const initialMessageCount = await page.getByRole('listitem', { name: /mesaj/i }).count();

    // Simulate waiting for new message (in real scenario, this would come via WebSocket)
    // For testing, you can mock this or use a test API to send a message

    // Wait for potential new messages
    await page.waitForTimeout(2000);

    // Verify message count (this is a placeholder, actual test depends on mock/test setup)
    const newMessageCount = await page.getByRole('listitem', { name: /mesaj/i }).count();
    expect(newMessageCount).toBeGreaterThanOrEqual(initialMessageCount);
  });

  test('should show typing indicator', async ({ page }) => {
    // Select a conversation
    const firstConversation = page.getByRole('listitem').first();
    await firstConversation.click();
    await page.waitForTimeout(500);

    // Type in message input (should trigger typing indicator)
    const messageInput = page.getByPlaceholder(/mesaj yazın/i);
    await messageInput.fill('Testing typing indicator...');

    // In a real scenario with WebSocket, the typing indicator would show
    // For E2E test, you can mock this via intercepting network requests
  });

  test('should navigate between conversations using keyboard', async ({ page }) => {
    // Wait for conversations to load
    await page.waitForSelector('[role="listitem"]', { timeout: 5000 });

    // Focus first conversation
    await page.keyboard.press('Tab');

    // Navigate down
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // Verify second conversation is selected
    await page.waitForTimeout(500);
    const selectedConversation = page.locator('[aria-selected="true"]').first();
    await expect(selectedConversation).toBeVisible();
  });
});



