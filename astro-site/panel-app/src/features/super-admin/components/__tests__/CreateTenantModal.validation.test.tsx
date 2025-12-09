/**
 * CreateTenantModal Component Tests - VALIDATION (Form Validation)
 * 
 * Tests for form validation across all steps
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
      };
      return translations[key] || key;
    },
  }),
}));

// ============================================================================
// TEST SUITE - PART 2: VALIDATION (15 tests)
// ============================================================================

describe('CreateTenantModal - Step 1: Company Information', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render all required fields for step 1', () => {
    // Arrange
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    // Assert
    expect(screen.getByLabelText(/Firma Adı/)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/E-posta/)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Telefon/)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Web Sitesi/)).toBeInTheDocument();
  });

  it('should show validation error when company name is empty', async () => {
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
  });

  it('should show validation error when email is empty', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test Company');
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('E-posta gerekli')).toBeInTheDocument();
    });
  });

  it('should show validation error when phone is empty', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test Company');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@company.com');
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Telefon gerekli')).toBeInTheDocument();
    });
  });

  it('should accept website as optional field', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test Company');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@company.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    // Don't fill website
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Adım 2/4')).toBeInTheDocument();
    });
  });

  it('should clear validation errors when user starts typing', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    
    // Trigger validation error
    await user.click(screen.getByText('İleri'));
    await waitFor(() => {
      expect(screen.getByText('Firma adı gerekli')).toBeInTheDocument();
    });
    
    // Start typing
    await user.type(screen.getByLabelText(/Firma Adı/), 'T');

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('Firma adı gerekli')).not.toBeInTheDocument();
    });
  });
});

describe('CreateTenantModal - Step 2: Contact Person', () => {
  const fillStep1 = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test Company');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@company.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    await user.click(screen.getByText('İleri'));
    await waitFor(() => {
      expect(screen.getByText('Adım 2/4')).toBeInTheDocument();
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render contact person fields', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillStep1(user);

    // Assert
    expect(screen.getByText('İletişim Kişisi')).toBeInTheDocument();
    expect(screen.getByLabelText(/Ad/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Soyad/)).toBeInTheDocument();
  });

  it('should show validation error when first name is empty', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillStep1(user);
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Ad gerekli')).toBeInTheDocument();
    });
  });

  it('should show validation error when last name is empty', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillStep1(user);
    await user.type(screen.getByLabelText(/Ad/), 'Ahmet');
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Soyad gerekli')).toBeInTheDocument();
    });
  });

  it('should show validation error when contact email is empty', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillStep1(user);
    await user.type(screen.getByLabelText(/Ad/), 'Ahmet');
    await user.type(screen.getByLabelText(/Soyad/), 'Yılmaz');
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('E-posta gerekli')).toBeInTheDocument();
    });
  });

  it('should proceed to step 3 when step 2 fields are valid', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillStep1(user);
    
    await user.type(screen.getByLabelText(/Ad/), 'Ahmet');
    await user.type(screen.getByLabelText(/Soyad/), 'Yılmaz');
    const emailInputs = screen.getAllByLabelText(/E-posta/);
    await user.type(emailInputs[0], 'ahmet@test.com');
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Adım 3/4')).toBeInTheDocument();
    });
    expect(screen.getByText('Fatura Adresi')).toBeInTheDocument();
  });
});

describe('CreateTenantModal - Step 3: Billing Address', () => {
  const fillSteps1And2 = async (user: ReturnType<typeof userEvent.setup>) => {
    // Step 1
    await user.type(screen.getByLabelText(/Firma Adı/), 'Test Company');
    await user.type(screen.getAllByLabelText(/E-posta/)[0], 'test@company.com');
    await user.type(screen.getAllByLabelText(/Telefon/)[0], '+905551234567');
    await user.click(screen.getByText('İleri'));
    
    await waitFor(() => {
      expect(screen.getByText('Adım 2/4')).toBeInTheDocument();
    });
    
    // Step 2
    await user.type(screen.getByLabelText(/Ad/), 'Ahmet');
    await user.type(screen.getByLabelText(/Soyad/), 'Yılmaz');
    const emailInputs = screen.getAllByLabelText(/E-posta/);
    await user.type(emailInputs[0], 'ahmet@test.com');
    await user.click(screen.getByText('İleri'));
    
    await waitFor(() => {
      expect(screen.getByText('Adım 3/4')).toBeInTheDocument();
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render billing address fields', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1And2(user);

    // Assert
    expect(screen.getByText('Fatura Adresi')).toBeInTheDocument();
    expect(screen.getByLabelText(/Yasal Firma Adı/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Adres/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Şehir/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Posta Kodu/)).toBeInTheDocument();
  });

  it('should show validation errors for required billing fields', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1And2(user);
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma adı gerekli')).toBeInTheDocument();
      expect(screen.getByText('Adres gerekli')).toBeInTheDocument();
      expect(screen.getByText('Şehir gerekli')).toBeInTheDocument();
      expect(screen.getByText('Posta kodu gerekli')).toBeInTheDocument();
    });
  });

  it('should proceed to step 4 when step 3 fields are valid', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1And2(user);
    
    await user.type(screen.getByLabelText(/Yasal Firma Adı/), 'Test Company A.Ş.');
    await user.type(screen.getByLabelText(/Adres/), 'Test Street 123');
    await user.type(screen.getByLabelText(/Şehir/), 'İstanbul');
    await user.type(screen.getByLabelText(/Posta Kodu/), '34000');
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Adım 4/4')).toBeInTheDocument();
    });
    expect(screen.getByText('Plan ve Özellikler')).toBeInTheDocument();
  });

  it('should accept optional tax number field', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    // Act
    render(<CreateTenantModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    await fillSteps1And2(user);
    
    await user.type(screen.getByLabelText(/Yasal Firma Adı/), 'Test Company A.Ş.');
    await user.type(screen.getByLabelText(/Adres/), 'Test Street 123');
    await user.type(screen.getByLabelText(/Şehir/), 'İstanbul');
    await user.type(screen.getByLabelText(/Posta Kodu/), '34000');
    // Don't fill tax number
    await user.click(screen.getByText('İleri'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Adım 4/4')).toBeInTheDocument();
    });
  });
});

