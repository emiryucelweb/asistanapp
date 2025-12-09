# Agent Feature Tests

Bu klasör Agent Panel feature'ına ait test dosyalarını içerir.

## Yapı

```
__tests__/
├── components/    # Agent bileşen testleri
├── hooks/         # Agent hook testleri
├── stores/        # Agent store testleri
└── pages/         # Agent page testleri
```

## Test Yazım Kuralları

- Dosya adı: `[ComponentName].test.tsx`
- Her bileşen için en az 1 snapshot test
- Critical hooks için unit test
- Store'lar için state mutation testleri

## Örnek Test

```typescript
import { render } from '@testing-library/react';
import AgentDashboard from '../pages/dashboard/AgentDashboard';

describe('AgentDashboard', () => {
  it('should render correctly', () => {
    const { container } = render(<AgentDashboard />);
    expect(container).toMatchSnapshot();
  });
});
```


