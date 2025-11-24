# AsistanApp - Test ve Deploy Checklist

## ✅ Geliştirme Ortamı Testi

### 1. Bağımlılıkları Yükle
```bash
cd astro-site
npm install
```

### 2. Development Server Başlat
```bash
npm run dev
```
Tarayıcıda `http://localhost:4321` adresini aç.

### 3. Manuel Kontroller

#### Dil Değiştirme
- [ ] Sağ üstteki TR/EN butonlarına tıkla
- [ ] Sayfa içeriği değişiyor mu?
- [ ] LocalStorage'da `asistanapp-lang` kaydediliyor mu? (DevTools → Application)

#### Navigasyon
- [ ] Tüm menü linkleri çalışıyor mu?
- [ ] Tab tuşuna bas → "Ana içeriğe geç" linki görünüyor mu?
- [ ] Enter'a bas → Ana içeriğe atlıyor mu?

#### Form Testi (Pre-Register)
- [ ] `/pre-register` sayfasına git
- [ ] Form alanlarına tıkla → Label vurgulanıyor mu?
- [ ] Zorunlu alanları boş bırak → Hata mesajı geliyor mu?
- [ ] Formu doldur → Formspree'ye gidiyor mu?
- [ ] 2. adım soruları görünüyor mu?

#### Animasyonlar
- [ ] Sayfayı aşağı kaydır
- [ ] Kartlar yumuşakça görünüyor mu?
- [ ] Hover efektleri çalışıyor mu?

#### Responsive Test
- [ ] DevTools → Responsive mode
- [ ] Mobil (375px), Tablet (768px), Desktop (1200px)
- [ ] Menu mobilde düzgün görünüyor mu?

---

## 🏗️ Production Build

### 1. Build Yap
```bash
npm run build
```

**Beklenen Çıktı:**
```
✓ Completed in XXXms.
✓ Built in XXXs
```

### 2. Build Önizleme
```bash
npm run preview
```
Tarayıcıda `http://localhost:4321` adresini aç.

### 3. Build Dosyalarını Kontrol Et
```bash
ls -la dist/
```

**Olması Gerekenler:**
- [ ] `index.html`
- [ ] `sitemap.xml`
- [ ] `robots.txt`
- [ ] `og-image.svg`
- [ ] `scripts/site.js`
- [ ] `_astro/*.css` ve `*.js` dosyaları
- [ ] Tüm sayfa klasörleri (features/, pricing/, vs.)

---

## 🔍 SEO Testleri

### 1. Meta Tag Kontrolü
Herhangi bir sayfada → Sağ tık → "Sayfa Kaynağını Görüntüle"

**Kontrol Et:**
- [ ] `<link rel="canonical" ...>` var mı?
- [ ] `<meta property="og:image" ...>` var mı?
- [ ] `<meta name="twitter:image" ...>` var mı?
- [ ] `<script type="application/ld+json">` (JSON-LD) var mı?

### 2. Sitemap Testi
Tarayıcıda aç: `http://localhost:4321/sitemap.xml`
- [ ] XML düzgün formatlanmış mı?
- [ ] Tüm sayfalar listeleniyor mu?

### 3. Robots.txt Testi
Tarayıcıda aç: `http://localhost:4321/robots.txt`
- [ ] `User-agent: *` ve `Allow: /` var mı?
- [ ] Sitemap URL doğru mu?

### 4. Open Graph Debug
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] URL: `https://asistanapp.com.tr`
- [ ] Görsel çıkıyor mu?

### 5. Twitter Card Validator
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] URL gir → "Preview card" görünüyor mu?

---

## ♿ Erişilebilirlik Testleri

### 1. Klavye Navigasyonu
- [ ] Tab → Tüm interaktif elemanlara ulaşılıyor mu?
- [ ] Enter/Space → Butonlar çalışıyor mu?
- [ ] Esc → Modal/dropdown kapanıyor mu? (varsa)

### 2. Ekran Okuyucu Simülasyonu
- [ ] Chrome DevTools → Lighthouse → Accessibility
- [ ] Score 95+ olmalı

### 3. Form Erişilebilirlik
- [ ] Form input'larına tıkla
- [ ] Ekran okuyucu (VoiceOver/NVDA) label'ı okuyor mu?

---

## ⚡ Performans Testleri

### 1. Lighthouse Test
Chrome DevTools → Lighthouse → "Analyze page load"

**Beklenen Skorlar:**
- [ ] Performance: 90+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 95+

### 2. PageSpeed Insights
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] URL: `https://asistanapp.com.tr`
- [ ] Mobil ve Desktop skorları 90+ olmalı

### 3. Font Loading
- [ ] Network tab → Fonts
- [ ] Inter font'u preload ile hızlı yükleniyor mu?

---

## 🚀 Deploy Kontrolleri

### GitHub Pages Deploy Sonrası

1. **DNS Kontrol**
```bash
nslookup asistanapp.com.tr
```

2. **SSL Sertifikası**
- [ ] `https://` çalışıyor mu?
- [ ] Tarayıcıda kilit simgesi var mı?

3. **Canlı Site Testleri**
- [ ] Ana sayfa yükleniyor mu?
- [ ] Tüm alt sayfalar erişilebilir mi?
- [ ] Static asset'ler (CSS/JS/görseller) yükleniyor mu?

4. **Google Search Console**
- [ ] Sitemap gönder: `https://asistanapp.com.tr/sitemap.xml`
- [ ] URL inceleme: Ana sayfayı indeksle
- [ ] Coverage raporunu kontrol et

5. **Analytics Kurulumu** (Opsiyonel)
- [ ] Google Analytics / PostHog entegrasyonu
- [ ] GDPR cookie consent banner

---

## 🐛 Hata Ayıklama

### Build Hataları
```bash
# Cache temizle
rm -rf dist/ .astro/ node_modules/.vite/

# Yeniden yükle
npm install

# Tekrar build
npm run build
```

### JavaScript Hataları
- DevTools → Console
- Herhangi bir kırmızı hata var mı?

### CSS Hataları
- DevTools → Sources → global.css
- Stil uygulanmıyor mu?

---

## 📋 Son Checklist

Canlıya almadan önce:

- [ ] Tüm sayfalar çalışıyor
- [ ] Form gönderimi çalışıyor
- [ ] Dil değiştirme çalışıyor
- [ ] SEO meta etiketleri eksiksiz
- [ ] Sitemap ve robots.txt canlıda
- [ ] OG görseli sosyal medyada çıkıyor
- [ ] Lighthouse skorları 90+
- [ ] Mobil responsive
- [ ] KVKK/GDPR metinleri güncel
- [ ] İletişim bilgileri doğru

---

## 🎉 Her Şey Tamam!

Tüm testler geçti mi? Deploy yapabilirsiniz! 🚀

**Deploy Komutu:**
```bash
git add .
git commit -m "feat: SEO, accessibility, and performance improvements"
git push origin main
```

GitHub Actions otomatik deploy başlatacak!
