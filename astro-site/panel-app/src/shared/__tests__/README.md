# Shared Tests

Bu klasör shared (ortak) kod için test dosyalarını içerir.

## Yapı

```
__tests__/
├── hooks/     # Shared hook testleri (useWebSocket, useApiData, vb.)
├── stores/    # Shared store testleri (auth, theme, notification)
├── ui/        # UI component testleri (Button, Modal, Card, vb.)
└── utils/     # Utility function testleri (toast, formatters, vb.)
```

## Test Öncelikleri

1. **High Priority:**
   - auth-store.tsx
   - useWebSocket.tsx
   - useApiData.ts
   - toast.ts

2. **Medium Priority:**
   - theme-store.tsx
   - formatters.ts
   - UI components

3. **Low Priority:**
   - Mock data generators
   - Dev utilities


