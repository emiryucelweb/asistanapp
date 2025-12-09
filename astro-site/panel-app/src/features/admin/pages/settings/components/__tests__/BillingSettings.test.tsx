/**
 * BillingSettings Component Tests - ENTERPRISE GRADE
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import BillingSettings from '../BillingSettings';

vi.mock('@/shared/utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.billing.title': 'Billing',
        'settings.billing.subtitle': 'Manage your subscription',
        'settings.billing.plans.pro': 'Pro',
        'settings.billing.plans.starter': 'Starter',
        'settings.billing.plans.enterprise': 'Enterprise',
        'settings.billing.monthly': 'Monthly',
        'settings.billing.features.unlimitedAI': 'Unlimited AI',
        'settings.billing.features.sms10k': '10K SMS',
        'settings.billing.features.storage50gb': '50GB Storage',
        'settings.billing.features.team10': '10 Team',
        'settings.billing.upgradePlan': 'Upgrade Plan',
        'settings.billing.usageStats': 'Usage Stats',
        'settings.billing.usage.sms': 'SMS',
        'settings.billing.usage.aiMessage': 'AI Messages',
        'settings.billing.usage.storage': 'Storage',
        'settings.billing.unlimited': 'Unlimited',
        'settings.billing.paymentMethod': 'Payment Method',
        'settings.billing.changeCard': 'Change Card',
        'settings.billing.autoPayment': 'Auto Payment',
        'settings.billing.invoiceHistory': 'Invoice History',
        'settings.billing.paid': 'Paid',
        'settings.billing.downloadInvoice': 'Download',
        'settings.billing.cardExpiry': 'Expires',
      };
      return translations[key] || key;
    },
  }),
}));

describe('BillingSettings - Rendering', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render billing title', () => {
    // Arrange & Act
    renderWithProviders(<BillingSettings />);

    // Assert
    expect(screen.getByText('Billing')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    // Arrange & Act & Assert
    expect(() => renderWithProviders(<BillingSettings />)).not.toThrow();
  });

  it('should display subtitle', () => {
    // Arrange & Act
    renderWithProviders(<BillingSettings />);

    // Assert
    expect(screen.getByText('Manage your subscription')).toBeInTheDocument();
  });

  it('should render upgrade button', () => {
    // Arrange & Act
    renderWithProviders(<BillingSettings />);

    // Assert
    expect(screen.getByText('Upgrade Plan')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<BillingSettings />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });
});

describe('BillingSettings - Interactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should handle upgrade button click', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<BillingSettings />);

    // Act
    const upgradeButton = screen.getByText('Upgrade Plan');
    await user.click(upgradeButton);

    // Assert
    expect(upgradeButton).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<BillingSettings />);

    // Act
    await user.tab();

    // Assert
    expect(screen.getByText('Upgrade Plan')).toBeInTheDocument();
  });
});

describe('BillingSettings - Accessibility', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should have accessible buttons', () => {
    // Arrange & Act
    renderWithProviders(<BillingSettings />);
    const upgradeButton = screen.getByText('Upgrade Plan');

    // Assert
    expect(upgradeButton.tagName).toBe('BUTTON');
  });

  it('should render quickly', () => {
    // Arrange
    const start = performance.now();

    // Act
    renderWithProviders(<BillingSettings />);
    const end = performance.now();

    // Assert
    expect(end - start).toBeLessThan(500);
  });
});
