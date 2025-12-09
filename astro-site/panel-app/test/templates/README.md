# Test Templates

Bu klasör yeni test dosyaları oluştururken kullanılacak template'leri içerir.

## 📁 Mevcut Template'ler

### 1. `component.template.tsx`
React component testleri için template.

**Kullanım:**
```bash
# 1. Template'i kopyala
cp test/templates/component.template.tsx src/features/[feature]/components/__tests__/MyComponent.test.tsx

# 2. [ComponentName] placeholder'ını değiştir
# 3. Props ve test case'leri ekle
# 4. Test'i çalıştır
npm run test -- src/features/[feature]/components/__tests__/MyComponent.test.tsx
```

**Kapsam:**
- Rendering tests
- User interaction tests
- State management tests
- Conditional rendering tests
- Accessibility tests
- Edge cases

### 2. `hook.template.ts`
React custom hook testleri için template.

**Kullanım:**
```bash
# 1. Template'i kopyala
cp test/templates/hook.template.ts src/features/[feature]/hooks/__tests__/useMyHook.test.ts

# 2. [HookName] placeholder'ını değiştir
# 3. Hook'un davranışlarını test et
# 4. Test'i çalıştır
npm run test -- src/features/[feature]/hooks/__tests__/useMyHook.test.ts
```

**Kapsam:**
- Initial state tests
- State update tests
- Async operation tests
- Callback tests
- Dependency tests
- Cleanup tests
- Edge cases
- Performance tests

### 3. `store.template.ts`
Zustand store testleri için template.

**Kullanım:**
```bash
# 1. Template'i kopyala
cp test/templates/store.template.ts src/features/[feature]/stores/__tests__/my-store.test.ts

# 2. [StoreName] ve [storeName] placeholder'larını değiştir
# 3. Store action'larını test et
# 4. Test'i çalıştır
npm run test -- src/features/[feature]/stores/__tests__/my-store.test.ts
```

**Kapsam:**
- Initial state tests
- Action tests
- Selector tests
- Async operation tests
- State persistence tests
- Reset tests
- Edge cases
- Performance tests
- Subscription tests

## 🎯 Template Kullanım Prensipleri

### 1. Placeholder'lar
Template'lerde kullanılan placeholder'lar:
- `[ComponentName]` - Component adı (PascalCase)
- `[HookName]` - Hook adı (camelCase, `use` prefix'i ile)
- `[StoreName]` - Store adı (PascalCase)
- `[storeName]` - Store dosya adı (kebab-case)
- `[component]` - Component namespace (i18n için)
- `[feature]` - Feature adı (kebab-case)

**Örnek:**
```typescript
// Template
import { [ComponentName] } from '../[ComponentName]';

// Kullanım
import { UserProfile } from '../UserProfile';
```

### 2. AAA Pattern (Arrange-Act-Assert)
Tüm testler AAA pattern'ı takip etmeli:

```typescript
it('should do something', () => {
  // Arrange - Test verisi ve initial state hazırla
  const props = { name: 'Test' };
  
  // Act - Test edilecek aksiyonu gerçekleştir
  render(<Component {...props} />);
  
  // Assert - Sonucu doğrula
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### 3. Mock Kullanımı
- i18n mock'u **TOP-LEVEL** olmalı (import'lardan önce)
- Dependency mock'ları da top-level
- Mock'lar `beforeEach`'te clear edilmeli

**Doğru:**
```typescript
// Top level
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  // tests...
});
```

**Yanlış:**
```typescript
describe('Component', () => {
  beforeEach(() => {
    // ❌ Mock'u beforeEach'te tanımlama
    vi.mock('react-i18next', ...);
  });
});
```

### 4. Test Naming
Test isimleri açıklayıcı ve action-oriented olmalı:

**Doğru:**
```typescript
it('should display error message when validation fails', () => {});
it('should call onSubmit when form is valid', () => {});
it('should disable button while loading', () => {});
```

**Yanlış:**
```typescript
it('test 1', () => {});
it('error', () => {});
it('works', () => {});
```

### 5. Shared Infrastructure Kullanımı
Yeni infrastructure'ı kullanmak için template'leri güncelleyebilirsiniz:

**Eski Yol (Template'de gösterildiği gibi):**
```typescript
// Direkt render ve mock
import { render } from '@testing-library/react';
vi.mock('react-i18next', ...);
```

**Yeni Yol (Opsiyonel):**
```typescript
// Shared infrastructure kullan
import { renderWithProviders, setupI18nMock } from '@/test';
setupI18nMock();
```

## 📝 Test Case Kategorileri

Her template, standart test kategorilerini içerir:

### Component Tests
1. **Rendering** - Component'in render olması
2. **User Interactions** - Click, type, keyboard gibi
3. **State Management** - State değişimleri
4. **Conditional Rendering** - Loading, error, empty states
5. **Accessibility** - ARIA, keyboard navigation
6. **Edge Cases** - Null, undefined, extreme values

### Hook Tests
1. **Initial State** - Hook'un başlangıç state'i
2. **State Updates** - State güncellemeleri
3. **Async Operations** - Loading, success, error states
4. **Callbacks** - onSuccess, onError gibi
5. **Dependencies** - useEffect dependency'leri
6. **Cleanup** - unmount ve cleanup
7. **Performance** - Unnecessary re-renders

### Store Tests
1. **Initial State** - Store'un başlangıç state'i
2. **Actions** - Add, remove, update gibi
3. **Selectors** - Derived state hesaplamaları
4. **Async Operations** - API calls, loading states
5. **Persistence** - localStorage sync
6. **Reset** - Store'u initial state'e döndürme
7. **Subscriptions** - State change notifications

## ⚠️ Dikkat Edilmesi Gerekenler

### 1. Import Hataları
- `act` import'u `@testing-library/react`'tan olmalı (NOT `react-dom/test-utils`)
- `renderHook` import'u `@testing-library/react`'tan olmalı

### 2. Zustand Store Testing
İki yöntem var:

**Yöntem 1: getState() (ÖNERİLEN)**
```typescript
const store = useMyStore.getState();
store.action();
const state = useMyStore.getState();
expect(state.value).toBe(expected);
```

**Yöntem 2: renderHook() (Selector testleri için)**
```typescript
const { result } = renderHook(() => useMyStore(state => state.selector));
expect(result.current).toBe(expected);
```

### 3. Async Testing
Async testleri test ederken `act()` ve `waitFor()` kullan:

```typescript
await act(async () => {
  await result.current.fetchData();
});

await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});
```

## 🚀 En İyi Pratikler

1. ✅ Template'i olduğu gibi kopyala
2. ✅ Placeholder'ları global find/replace ile değiştir
3. ✅ İhtiyacın olmayan test case'leri sil
4. ✅ Component/hook/store'a özel test'ler ekle
5. ✅ Her test tek bir davranışı test etmeli
6. ✅ Test isimleri açıklayıcı olmalı
7. ✅ AAA pattern'ı takip et
8. ✅ Mock'ları minimal tut
9. ✅ Edge case'leri unutma
10. ✅ Test'i çalıştırıp geçtiğinden emin ol

## 📚 Kaynaklar

- [Test Strategy](../../../docs/TESTING_STRATEGY_SCALABLE.md)
- [Shared Infrastructure](../../../docs/SHARED_TEST_INFRASTRUCTURE.md)
- [Example Usage](../EXAMPLE_USAGE.md)
- [Golden Rules](../../../docs/AGENT_PANEL_GOLDEN_RULES_VERIFICATION.md)

## 🔄 Template Güncellemeleri

Template'ler, best practice'ler değiştikçe güncellenecektir. Son güncelleme: 2024-11-22

