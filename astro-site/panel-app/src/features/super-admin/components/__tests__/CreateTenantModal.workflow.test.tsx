/**
 * CreateTenantModal Component Tests - WORKFLOW (Submission & Edge Cases)
 * 
 * Tests for complete workflow, form submission, and edge cases
 * 
 * @group component
 * @group super-admin
 * @group modal
 * @group P0-critical
 * 
 * GOLDEN RULES:
 * ✅ #1: AAA Pattern (Arrange-Act-Assert)
 * ✅ #2: Single Responsibility
 * ✅ #3: State Isolation
 * ✅ #4: Consistent Mocks (Shared Infrastructure)
 * ✅ #5: Descriptive Names
 * ✅ #6: Edge Case Coverage
 * ✅ #7: Real-World Scenarios
 * ✅ #8: Error Handling
 * ✅ #9: Correct Async/Await
 * ✅ #10: Cleanup
 * ✅ #11: Immutability
 * ✅ #12: Type Safety
 * ✅ #13: Enterprise-Grade (MAX 15 tests) ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateTenantModal, { TenantFormData } from '../CreateTenantModal';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        // Modal
        'tenants.create.title': 'Yeni Firma Ekle',
        'tenants.create.misc.step': `Adım ${options?.current || 1}/${options?.total || 4}`,
        
        // Labels
        'tenants.create.labels.companyInfo': 'Firma Bilgileri',
        'tenants.create.labels.companyName': 'Firma Adı',
        'tenants.create.labels.email': 'E-posta',
        'tenants.create.labels.phone': 'Telefon',
        'tenants.create.labels.website': 'Web Sitesi',
        'tenants.create.labels.required': '*',
        'tenants.create.labels.contactPerson': 'İletişim Kişisi',
        'tenants.create.labels.firstName': 'Ad',
        'tenants.create.labels.lastName': 'Soyad',
        'tenants.create.labels.billingAddress': 'Fatura Adresi',
        'tenants.create.labels.legalName': 'Yasal Firma Adı',
        'tenants.create.labels.address': 'Adres',
        'tenants.create.labels.city': 'Şehir',
        'tenants.create.labels.district': 'İlçe',
        'tenants.create.labels.postalCode': 'Posta Kodu',
        'tenants.create.labels.country': 'Ülke',
        'tenants.create.labels.taxNumber': 'Vergi Numarası',
        'tenants.create.labels.planFeatures': 'Plan ve Özellikler',
        'tenants.create.labels.planSelection': 'Plan Seçimi',
        
        // Validation
        'tenants.create.validation.companyNameRequired': 'Firma adı gerekli',
        'tenants.create.validation.emailRequired': 'E-posta gerekli',
        'tenants.create.validation.phoneRequired': 'Telefon gerekli',
        
        // Buttons
        'tenants.create.buttons.cancel': 'İptal',
        'tenants.create.buttons.back': 'Geri',
        'tenants.create.buttons.next': 'İleri',
        'tenants.create.buttons.create': 'Oluştur',
        
        // Plans
        'super-admin.tenants.create.plans.starter': 'Başlangıç',
        'super-admin.tenants.create.plans.professional': 'Profesyonel',
        'super-admin.tenants.create.plans.enterprise': 'Kurumsal',
        'super-admin.tenants.create.plans.free': 'Deneme',
        
        // Features
        'super-admin.tenants.create.features.voiceEnabled': 'Sesli Arama',
        'super-admin.tenants.create.features.voiceDesc': 'Ses aramalarını etkinleştir',
        'super-admin.tenants.create.features.multiChannel': 'Çoklu Kanal',
        'super-admin.tenants.create.features.multiChannelDesc': 'WhatsApp, Instagram, Web',
        'super-admin.tenants.create.features.analytics': 'Analitik',
        'super-admin.tenants.create.features.analyticsDesc': 'Detaylı raporlar ve analizler',
        'super-admin.tenants.create.features.customIntegrations': 'Özel Entegrasyonlar',
        'super-admin.tenants.create.features.customIntegrationsDesc': 'API ve webhook desteği',
      };
      return translations[key] || key;
    },
  }),
}));

// ============================================================================
// TEST SUITE - PART 3: WORKFLOW (13 tests)
// ============================================================================

describe('CreateTenantModal - Step 4: Subscription & Features', () => {
  const fillSteps1To3 = async (user: ReturnType<typeof userEvent.setup>) => {
    // Step 1
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test Company');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@company.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    await user.click(screen.getByText('İleri'));
    await waitFor(() => expect(screen.getByText('Adım 2/4')).toBeInTheDocument());
    
    // Step 2
    await user.type(screen.getByLabelText(/Ad/), 'Ahmet');
    await user.type(screen.getByLabelText(/Soyad/), 'Yılmaz');
    const emailInputs = screen.getAllByLabelText(/E-posta/);
    await user.type(emailInputs[0], 'ahmet@test.com');
    await user.click(screen.getByText('İleri'));
    await waitFor(() => expect(screen.getByText('Adım 3/4')).toBeInTheDocument());
    
    // Step 3
    await user.type(screen.getByLabelText(/Yasal Firma Adı/), 'Test Company A.Ş.');
    await user.type(screen.getByLabelText(/Adres/), 'Test Street 123');
    await user.type(screen.getByLabelText(/Şehir/), 'İstanbul');
    await user.type(screen.getByLabelText(/Posta Kodu/), '34000');
    await user.click(screen.getByText('İleri'));
    await waitFor(() => expect(screen.getByText('Adım 4/4')).toBeInTheDocument());
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render plan selection', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1To3(user);

    // Assert
    expect(screen.getByText('Plan ve Özellikler')).toBeInTheDocument();
    expect(screen.getByText('Başlangıç')).toBeInTheDocument();
    expect(screen.getByText('Profesyonel')).toBeInTheDocument();
    expect(screen.getByText('Kurumsal')).toBeInTheDocument();
    expect(screen.getByText('Deneme')).toBeInTheDocument();
  });

  it('should have professional plan selected by default', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1To3(user);

    // Assert
    const professionalButton = screen.getByText('Profesyonel').closest('button');
    expect(professionalButton).toHaveClass('border-blue-600');
  });

  it('should allow selecting different plans', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1To3(user);
    
    const enterpriseButton = screen.getByText('Kurumsal').closest('button');
    await user.click(enterpriseButton!);

    // Assert
    expect(enterpriseButton).toHaveClass('border-blue-600');
  });

  it('should render feature checkboxes', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1To3(user);

    // Assert
    const voiceTexts = screen.getAllByText('Sesli Arama');
    const multiChannelTexts = screen.getAllByText('Çoklu Kanal');
    const analyticsTexts = screen.getAllByText('Analitik');
    const integrationsTexts = screen.getAllByText('Özel Entegrasyonlar');
    
    expect(voiceTexts.length).toBeGreaterThan(0);
    expect(multiChannelTexts.length).toBeGreaterThan(0);
    expect(analyticsTexts.length).toBeGreaterThan(0);
    expect(integrationsTexts.length).toBeGreaterThan(0);
  });

  it('should have some features enabled by default', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1To3(user);

    // Assert
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked(); // voiceEnabled
    expect(checkboxes[1]).toBeChecked(); // multiChannel
    expect(checkboxes[2]).toBeChecked(); // analytics
    expect(checkboxes[3]).not.toBeChecked(); // customIntegrations
  });

  it('should show Create button on step 4', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1To3(user);

    // Assert
    expect(screen.getByText('Oluştur')).toBeInTheDocument();
  });

  it('should call onSubmit with form data when Create is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1To3(user);
    await user.click(screen.getByText('Oluştur'));

    // Assert
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      const formData = onSubmit.mock.calls[0][0] as TenantFormData;
      expect(formData.companyName).toBe('Test Company');
      expect(formData.companyEmail).toBe('test@company.com');
      expect(formData.contactFirstName).toBe('Ahmet');
      expect(formData.contactLastName).toBe('Yılmaz');
      expect(formData.billingCompany).toBe('Test Company A.Ş.');
      expect(formData.plan).toBe('professional');
    });
  });

  it('should call onClose after successful submission', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1To3(user);
    await user.click(screen.getByText('Oluştur'));

    // Assert
    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});

describe('CreateTenantModal - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle very long company name', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const longName = 'A'.repeat(200);

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    const input = screen.getByLabelText(/Firma Adı/) as HTMLInputElement;
    await user.type(input, longName);

    // Assert
    expect(input.value).toBe(longName);
  });

  it('should handle special characters in company name', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    const specialName = 'Test & Co. (Ö.Ç.Ş.)';

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    const input = screen.getByLabelText(/Firma Adı/) as HTMLInputElement;
    await user.type(input, specialName);

    // Assert
    expect(input.value).toBe(specialName);
  });

  it('should handle whitespace-only input as invalid', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/Firma Adı/), '   ');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@test.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma adı gerekli')).toBeInTheDocument();
    });
  });

  it('should allow toggling features on and off', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    
    // Navigate to step 4
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@test.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    await user.click(screen.getByText('İleri'));
    await waitFor(() => expect(screen.getByText('Adım 2/4')).toBeInTheDocument());
    
    await user.type(screen.getByLabelText(/Ad/), 'Test');
    await user.type(screen.getByLabelText(/Soyad/), 'User');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@test.com');
    await user.click(screen.getByText('İleri'));
    await waitFor(() => expect(screen.getByText('Adım 3/4')).toBeInTheDocument());
    
    await user.type(screen.getByLabelText(/Yasal Firma Adı/), 'Test');
    await user.type(screen.getByLabelText(/Adres/), 'Test');
    await user.type(screen.getByLabelText(/Şehir/), 'Test');
    await user.type(screen.getByLabelText(/Posta Kodu/), '12345');
    await user.click(screen.getByText('İleri'));
    await waitFor(() => expect(screen.getByText('Adım 4/4')).toBeInTheDocument());
    
    // Toggle features
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]); // Disable voiceEnabled

    // Assert
    expect(checkboxes[0]).not.toBeChecked();
  });
});

describe('CreateTenantModal - Accessibility Final Check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have accessible form structure with labels', () => {
    // Arrange
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    // Assert
    const labels = screen.getAllByText(/\*/); // Required indicators
    expect(labels.length).toBeGreaterThan(0);
  });
});

