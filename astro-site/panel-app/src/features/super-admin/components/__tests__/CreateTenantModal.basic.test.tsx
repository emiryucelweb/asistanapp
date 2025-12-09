/**
 * CreateTenantModal Component Tests - BASIC (Rendering & Navigation)
 * 
 * Tests for basic functionality: rendering, visibility, and step navigation
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
        'tenants.create.labels.dataLocation': 'Veri Konumu',
        'tenants.create.labels.features': 'Özellikler',
        'tenants.create.labels.paymentStatus': 'Ödeme Durumu',
        
        // Validation
        'tenants.create.validation.companyNameRequired': 'Firma adı gerekli',
        'tenants.create.validation.emailRequired': 'E-posta gerekli',
        'tenants.create.validation.phoneRequired': 'Telefon gerekli',
        'tenants.create.validation.firstNameRequired': 'Ad gerekli',
        'tenants.create.validation.lastNameRequired': 'Soyad gerekli',
        'tenants.create.validation.addressRequired': 'Adres gerekli',
        'tenants.create.validation.cityRequired': 'Şehir gerekli',
        'tenants.create.validation.postalCodeRequired': 'Posta kodu gerekli',
        
        // Buttons
        'tenants.create.buttons.cancel': 'İptal',
        'tenants.create.buttons.back': 'Geri',
        'tenants.create.buttons.next': 'İleri',
        'tenants.create.buttons.create': 'Oluştur',
        
        // Placeholders
        'superAdmin.tenants.create.placeholders.companyName': 'Acme Inc.',
        'superAdmin.tenants.create.placeholders.companyEmail': 'info@acme.com',
        'superAdmin.tenants.create.placeholders.companyPhone': '+90 555 123 4567',
        'superAdmin.tenants.create.placeholders.adminFirstName': 'Ahmet',
        'superAdmin.tenants.create.placeholders.adminLastName': 'Yılmaz',
        'superAdmin.tenants.create.placeholders.adminEmail': 'ahmet@acme.com',
        'superAdmin.tenants.create.placeholders.adminPhone': '+90 555 123 4567',
        'superAdmin.tenants.create.placeholders.legalName': 'Acme A.Ş.',
        'superAdmin.tenants.create.placeholders.address': 'Atatürk Cad. No:123',
        'superAdmin.tenants.create.placeholders.city': 'İstanbul',
        'superAdmin.tenants.create.placeholders.district': 'Kadıköy',
        'superAdmin.tenants.create.placeholders.apiKeyPlaceholder': 'sk-...',
        'superAdmin.tenants.create.placeholders.anthropicKeyPlaceholder': 'sk-ant-...',
        
        // Countries
        'tenants.create.countries.TR': 'Türkiye',
        'tenants.create.countries.US': 'Amerika',
        'tenants.create.countries.GB': 'İngiltere',
        'tenants.create.countries.DE': 'Almanya',
        
        // Data Locations
        'tenants.create.dataLocations.tr': 'Türkiye',
        'tenants.create.dataLocations.eu': 'Avrupa (GDPR)',
        'tenants.create.dataLocations.us': 'ABD',
        
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
        
        // Payment Types
        'tenants.create.paymentTypes.prepaid_yearly': 'Yıllık Ön Ödemeli',
        'tenants.create.paymentTypes.prepaid_6months': '6 Aylık Ön Ödemeli',
        'tenants.create.paymentTypes.monthly_commitment': 'Aylık Taahhütlü',
        'tenants.create.paymentTypes.monthly_flexible': 'Aylık Esnek',
        
        // Misc
        'tenants.create.misc.paymentNote': 'Ödeme tipi faturalama ve sözleşme için kullanılır',
        'tenants.create.misc.apiConfigOptional': 'API Yapılandırması (İsteğe Bağlı)',
        'tenants.create.misc.apiConfigNote': 'Müşteri daha sonra kendi panelinden ayarlayabilir',
      };
      return translations[key] || key;
    },
  }),
}));

// ============================================================================
// TEST SUITE - PART 1: BASIC (15 tests)
// ============================================================================

describe('CreateTenantModal - Rendering & Visibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render when isOpen is false', () => {
    // Arrange
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    const { container } = render(
      <CreateTenantModal isOpen={false} onClose={onClose} onSubmit={onSubmit} />
    );

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('should render modal when isOpen is true', () => {
    // Arrange
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    // Assert
    expect(screen.getByText('Yeni Firma Ekle')).toBeInTheDocument();
    expect(screen.getByText('Adım 1/4')).toBeInTheDocument();
  });

  it('should render step 1 (Company Info) by default', () => {
    // Arrange
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    // Assert
    expect(screen.getByText('Firma Bilgileri')).toBeInTheDocument();
    expect(screen.getByLabelText(/Firma Adı/)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-posta/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefon/)).toBeInTheDocument();
  });

  it('should render close button', () => {
    // Arrange
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    // Assert
    const closeButtons = screen.getAllByRole('button');
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it('should render progress bar with 4 steps', () => {
    // Arrange
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    const { container } = render(
      <CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />
    );

    // Assert
    const progressBars = container.querySelectorAll('.h-2.rounded-full');
    expect(progressBars.length).toBe(4);
  });
});

describe('CreateTenantModal - Step Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should show Cancel button on step 1', () => {
    // Arrange
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    // Assert
    expect(screen.getByText('İptal')).toBeInTheDocument();
    expect(screen.getByText('İleri')).toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked on step 1', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await user.click(screen.getByText('İptal'));

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when X button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    const closeButton = screen.getAllByRole('button')[0]; // First button is X
    await user.click(closeButton);

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not proceed to step 2 when required fields are empty', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma adı gerekli')).toBeInTheDocument();
    });
    expect(screen.getByText('Adım 1/4')).toBeInTheDocument(); // Still on step 1
  });

  it('should proceed to step 2 when step 1 fields are filled', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test Company');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@company.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Adım 2/4')).toBeInTheDocument();
    });
    expect(screen.getByText('İletişim Kişisi')).toBeInTheDocument();
  });

  it('should show Back button on step 2', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    
    // Fill step 1 and proceed
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test Company');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@company.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Geri')).toBeInTheDocument();
    });
  });

  it('should go back to step 1 when Back button is clicked on step 2', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    
    // Go to step 2
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test Company');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@company.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    await user.click(screen.getByText('İleri'));
    
    await waitFor(() => {
      expect(screen.getByText('Adım 2/4')).toBeInTheDocument();
    });
    
    // Go back
    await user.click(screen.getByText('Geri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Adım 1/4')).toBeInTheDocument();
    });
    expect(screen.getByText('Firma Bilgileri')).toBeInTheDocument();
  });

  it('should preserve form data when going back and forth', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    
    // Fill step 1
    const companyNameInput = screen.getByLabelText(/Firma Adı/) as HTMLInputElement;
    await user.type(companyNameInput, 'Test Company');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@company.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    await user.click(screen.getByText('İleri'));
    
    await waitFor(() => {
      expect(screen.getByText('Adım 2/4')).toBeInTheDocument();
    });
    
    // Go back
    await user.click(screen.getByText('Geri'));
    
    // Assert
    await waitFor(() => {
      const input = screen.getByLabelText(/Firma Adı/) as HTMLInputElement;
      expect(input.value).toBe('Test Company');
    });
  });
});

describe('CreateTenantModal - Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have proper ARIA labels for inputs', () => {
    // Arrange
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    // Assert
    expect(screen.getByLabelText(/Firma Adı/)).toHaveAttribute('id');
    expect(screen.getAllByLabelText(/E-posta/)[0]).toHaveAttribute('id');
  });

  it('should be keyboard navigable', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    
    // Tab through elements (first button is X close button)
    await user.tab(); // X button
    await user.tab(); // Company Name input
    expect(screen.getByLabelText(/Firma Adı/)).toHaveFocus();

    await user.tab(); // Email input
    expect(screen.getAllByLabelText(/E-posta/)[0]).toHaveFocus();
  });
});

