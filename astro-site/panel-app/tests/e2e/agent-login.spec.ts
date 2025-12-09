/**
 * E2E Tests: Agent Login Flow
 * 
 * Tests the complete agent login workflow
 */

import { test, expect } from '@playwright/test';

test.describe('Agent Login', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to agent login page
    await page.goto('/agent/login');
  });

  test('should display login form', async ({ page }) => {
    // Check if login form is visible
    await expect(page.getByRole('heading', { name: /giriş yap/i })).toBeVisible();
    await expect(page.getByLabel(/e-posta/i)).toBeVisible();
    await expect(page.getByLabel(/şifre/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /giriş yap/i })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click login without filling fields
    await page.getByRole('button', { name: /giriş yap/i }).click();

    // Check for validation errors
    await expect(page.getByText(/e-posta adresi gereklidir/i)).toBeVisible();
    await expect(page.getByText(/şifre gereklidir/i)).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    // Fill invalid email
    await page.getByLabel(/e-posta/i).fill('invalid-email');
    await page.getByLabel(/şifre/i).fill('password123');
    await page.getByRole('button', { name: /giriş yap/i }).click();

    // Check for email validation error
    await expect(page.getByText(/geçerli bir e-posta adresi giriniz/i)).toBeVisible();
  });

  test('should show error for wrong credentials', async ({ page }) => {
    // Fill with wrong credentials
    await page.getByLabel(/e-posta/i).fill('wrong@example.com');
    await page.getByLabel(/şifre/i).fill('wrongpassword');
    await page.getByRole('button', { name: /giriş yap/i }).click();

    // Wait for error message
    await expect(page.getByText(/geçersiz kimlik bilgileri/i)).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill with valid credentials (adjust based on your test data)
    await page.getByLabel(/e-posta/i).fill('agent@test.com');
    await page.getByLabel(/şifre/i).fill('test123456');
    await page.getByRole('button', { name: /giriş yap/i }).click();

    // Wait for redirect to dashboard
    await page.waitForURL('**/agent/dashboard', { timeout: 5000 });

    // Check if dashboard is loaded
    await expect(page.getByRole('heading', { name: /dashboard|gösterge paneli/i })).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel(/şifre/i);

    // Password should be hidden initially
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await page.getByRole('button', { name: /şifreyi göster/i }).click();

    // Password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle again
    await page.getByRole('button', { name: /şifreyi gizle/i }).click();

    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Click "Forgot Password" link
    await page.getByRole('link', { name: /şifremi unuttum/i }).click();

    // Check if navigated to forgot password page
    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(page.getByRole('heading', { name: /şifremi unuttum/i })).toBeVisible();
  });

  test('should show loading state during login', async ({ page }) => {
    // Fill credentials
    await page.getByLabel(/e-posta/i).fill('agent@test.com');
    await page.getByLabel(/şifre/i).fill('test123456');

    // Click login and immediately check for loading state
    await page.getByRole('button', { name: /giriş yap/i }).click();

    // Check for loading indicator (spinner or disabled button)
    const loginButton = page.getByRole('button', { name: /giriş yap/i });
    await expect(loginButton).toBeDisabled();
  });

  test('should remember email if "Remember Me" is checked', async ({ page }) => {
    const email = 'agent@test.com';

    // Fill email and check "Remember Me"
    await page.getByLabel(/e-posta/i).fill(email);
    await page.getByLabel(/beni hatırla/i).check();
    await page.getByLabel(/şifre/i).fill('test123456');
    await page.getByRole('button', { name: /giriş yap/i }).click();

    // Wait for navigation
    await page.waitForTimeout(1000);

    // Navigate back to login
    await page.goto('/agent/login');

    // Email should be pre-filled
    await expect(page.getByLabel(/e-posta/i)).toHaveValue(email);
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab'); // Focus email
    await expect(page.getByLabel(/e-posta/i)).toBeFocused();

    await page.keyboard.press('Tab'); // Focus password
    await expect(page.getByLabel(/şifre/i)).toBeFocused();

    await page.keyboard.press('Tab'); // Focus remember me
    await expect(page.getByLabel(/beni hatırla/i)).toBeFocused();

    await page.keyboard.press('Tab'); // Focus login button
    await expect(page.getByRole('button', { name: /giriş yap/i })).toBeFocused();
  });
});



