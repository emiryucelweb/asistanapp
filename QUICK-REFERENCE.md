# 🎯 Landing Page Features - Quick Reference

## 🔴 ÖNEMLİ: Google Analytics ID Değiştirmeyi Unutmayın!

**Dosya:** `astro-site/src/layouts/Layout.astro`

**Değiştirilmesi Gereken 2 Yer:**

```javascript
// 1. GA4 Config (satır ~90)
gtag('config', 'G-XXXXXXXXXX', {  // <-- BURAYA GERÇEK ID'NİZİ YAZIN
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=None;Secure'
});

// 2. Script Source (satır ~93)
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
                                                                 ↑↑↑↑↑↑↑↑↑↑↑
                                                         BURAYA GERÇEK ID'NİZİ YAZIN
```

**GA4 ID Nasıl Alınır:**
1. https://analytics.google.com adresine git
2. Admin → Create Property → Data Streams
3. Web stream oluştur → Measurement ID'yi kopyala (G-XXXXXXXXXX formatında)

---

## 📦 Eklenen Dosyalar

### Yeni React Components:
- ✅ `astro-site/src/components/CookieConsent.tsx` - Cookie onay banner'ı
- ✅ `astro-site/src/components/WhatsAppButton.tsx` - Floating WhatsApp butonu

### Güncellenen Dosyalar:
- ✅ `astro-site/src/layouts/Layout.astro` - GA4 + component'ler eklendi
- ✅ `astro-site/src/components/PreRegisterForm.tsx` - Loading state + success animation
- ✅ `astro-site/src/styles/global.css` - Yeni animasyonlar (spin, confetti, celebrate, etc.)

### Dokümantasyon:
- ✅ `LANDING-PAGE-FEATURES.md` - Detaylı özellik listesi

---

## 🧪 Hızlı Test

```bash
# Terminal'de çalıştır:
cd ~/Desktop/asistanapp-frontend/astro-site
npm run dev
```

**Test URL:** http://localhost:4321

### Test Adımları:

1. **Cookie Consent:**
   - Sayfanın altında banner görünüyor mu? ✓
   - "Kabul Et" butonuna tıkla → Banner kapanıyor mu? ✓
   - F12 → Application → Local Storage → `asistanapp-cookie-consent` var mı? ✓

2. **WhatsApp Button:**
   - Sağ altta yeşil button görünüyor mu? ✓
   - Hover yapınca büyüyor mu? ✓
   - Tıklayınca WhatsApp açılıyor mu? ✓

3. **Form Loading:**
   - `/pre-register` sayfasına git
   - Formu doldur ve "Ön Kayıt Ol" butonuna tıkla
   - Spinner ve "Gönderiliyor..." görünüyor mu? ✓

4. **Success Animation:**
   - Form tamamlandığında konfeti düşüyor mu? ✓
   - 🎉 emoji animasyon yapıyor mu? ✓

5. **Google Analytics:**
   - F12 → Console'da GA4 script hataları var mı?
   - F12 → Network'te `google-analytics.com` istekleri var mı?

---

## 🚀 Production'a Almadan Önce

### 1. Google Analytics ID'yi Değiştir
```astro
<!-- Layout.astro içinde 2 yerde: -->
G-XXXXXXXXXX → G-YOUR-REAL-ID
```

### 2. WhatsApp Numarasını Kontrol Et
```tsx
// WhatsAppButton.tsx içinde:
const PHONE_NUMBER = "905438992696";  // ✓ Doğru mu?
```

### 3. Build Test
```bash
npm run build
npm run preview
```

### 4. Browser Test
- Chrome ✓
- Firefox ✓
- Safari ✓
- Mobile Chrome ✓
- Mobile Safari ✓

### 5. Privacy Compliance
- Cookie consent çalışıyor mu? ✓
- KVKK metni doğru mu? ✓
- Gizlilik politikası güncel mi? ✓

---

## 🎨 Özelleştirme

### Cookie Consent Banner Renklerini Değiştir:
```tsx
// CookieConsent.tsx içinde:
background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
// Değiştir:
background: 'linear-gradient(135deg, #YOUR-COLOR 0%, #YOUR-DARKER-COLOR 100%)'
```

### WhatsApp Mesajını Değiştir:
```tsx
// WhatsAppButton.tsx içinde:
const messages = {
  tr: 'Merhaba! AsistanApp hakkında bilgi almak istiyorum.',
  en: "Hello! I'd like to learn more about AsistanApp."
};
```

### Success Konfeti Sayısını Değiştir:
```tsx
// PreRegisterForm.tsx Step 3'te:
{[...Array(12)].map((_, i) => ...)}
        ↑↑
    İstediğiniz sayı
```

---

## 📊 Analytics Events (İsteğe Bağlı)

GA4'te custom event'ler göndermek isterseniz:

```javascript
// Cookie kabul edilince:
gtag('event', 'cookie_consent', {
  'consent_type': 'accepted'
});

// Form gönderilince:
gtag('event', 'pre_register', {
  'form_step': 'step_1_complete'
});

// WhatsApp butonuna tıklayınca:
gtag('event', 'whatsapp_click', {
  'button_location': 'floating_button'
});
```

Bu event'leri eklemek için ilgili component'lere ekleyin.

---

## ❌ Sık Karşılaşılan Sorunlar

### Problem: Cookie banner tekrar tekrar çıkıyor
**Çözüm:** Browser localStorage'ı temizle (F12 → Application → Local Storage → Clear)

### Problem: GA4 event'ler gelmiyor
**Çözüm:** 
1. GA4 ID'yi kontrol et (G-XXXXXXXXXX formatında mı?)
2. Cookie consent'i kabul et
3. 24 saat bekle (GA4 real-time'da görünür ama raporlara geçmesi zaman alır)

### Problem: WhatsApp açılmıyor
**Çözüm:** 
1. Telefon numarası doğru mu? (905438992696)
2. WhatsApp yüklü mü?
3. Mobile'da test et

### Problem: Form spinner görünmüyor
**Çözüm:** 
1. global.css'de `@keyframes spin` var mı?
2. Browser cache'i temizle (Ctrl+Shift+R)

### Problem: Konfeti animasyonu çalışmıyor
**Çözüm:** 
1. global.css'de `@keyframes confetti` var mı?
2. Step 3'e geçiş oluyor mu?

---

## 🔍 Debug Modu

GA4 Debug mode'u aktifleştirmek için:

```javascript
// Layout.astro'da gtag config'e ekle:
gtag('config', 'G-YOUR-ID', {
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=None;Secure',
  'debug_mode': true  // <-- EKLE
});
```

Sonra Chrome Extension yükle: **Google Analytics Debugger**

---

## 📞 Destek

Bir sorun çıkarsa:
1. Console'da (F12) hata var mı kontrol et
2. `npm run build` çalışıyor mu?
3. Browser cache'i temizle
4. Dependencies güncel mi? (`npm outdated`)

---

**Son Güncelleme:** 24 Kasım 2025  
**Versiyon:** 1.1.0  
**Test Durumu:** ✅ Hazır
