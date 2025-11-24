import React, { useMemo, useState, useEffect } from 'react';

type FormState = { name: string; email: string; consent: boolean; phone?: string; company?: string };
type GrowthState = { jobTitle?: string; companySize?: string; useCase?: string; start?: string };

const initialState: FormState = { name: '', email: '', consent: false };

export default function PreRegisterForm() {
  const [lang, setLang] = useState<'tr'|'en'>('tr');
  const [step, setStep] = useState<1|2|3>(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [growth, setGrowth] = useState<GrowthState>({});
  const [error, setError] = useState<string>('');
  const [toast, setToast] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync with global language
  useEffect(() => {
    const currentLang = document.documentElement.getAttribute('data-lang') || 'tr';
    setLang(currentLang as 'tr'|'en');
  }, []);

  const t = useMemo(() => ({
    tr: {
      progress: step===1? 'Adım 1 / 2' : 'Adım 2 / 2',
      title1: 'Ön Kayıt Formu',
      title2: 'Firmanıza özel demo hazırlayabilmemiz için birkaç soru daha',
      name: 'Ad Soyad *', email: 'E-posta *', phone: 'Telefon', company: 'Şirket Adı',
      consent: 'KVKK kapsamında bilgilerimin işlenmesine ve ürün duyuruları için kullanılmasına onay veriyorum.',
      submit1: '🚀 Ön Kayıt Ol', submit2: '✅ Tercihleri Kaydet', skip: 'Şimdilik Atla',
      ok: 'Tercihleriniz kaydedildi! Size özel demo hazırlamak için iletişime geçeceğiz.',
      thankyou: 'Teşekkürler! Kayıt alındı, bir sonraki adıma geçebilirsiniz.',
      jobTitle: 'Pozisyon', companySize: 'Şirket Büyüklüğü', useCase: 'Öncelikli Kullanım Amacı', startTime: 'Başlama Zamanı',
      owner: 'Sahip/Kurucu', manager: 'Yönetici', employee: 'Çalışan', other: 'Diğer',
      sales: 'Satış Artırma', support: 'Müşteri Destek Otomasyonu', payment: 'Ödeme Kolaylığı',
      now: 'Hemen', month3: '3 Ay İçinde', month6: '6+ Ay Sonra'
    },
    en: {
      progress: step===1? 'Step 1 of 2' : 'Step 2 of 2',
      title1: 'Pre-Registration Form',
      title2: 'A few more questions to help us prepare a custom demo for your company',
      name: 'Full Name *', email: 'Email *', phone: 'Phone', company: 'Company Name',
      consent: 'I consent to the processing of my information under KVKK/GDPR and its use for product announcements.',
      submit1: '🚀 Join Waitlist', submit2: '✅ Save Preferences', skip: 'Skip for now',
      ok: 'Your preferences have been saved! We will contact you to prepare a custom demo.',
      thankyou: 'Thanks! Your signup is received, you can continue to the next step.',
      jobTitle: 'Job Title', companySize: 'Company Size', useCase: 'Primary Use Case', startTime: 'Start Timeline',
      owner: 'Owner/Founder', manager: 'Manager', employee: 'Employee', other: 'Other',
      sales: 'Increase Sales', support: 'Customer Support Automation', payment: 'Payment Simplification',
      now: 'Immediately', month3: 'Within 3 months', month6: '6+ months'
    }
  })[lang], [lang, step]);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }
  
  function onGrowthChange(e: React.ChangeEvent<HTMLSelectElement>) { 
    setGrowth((s)=>({ ...s, [e.target.name]: e.target.value })); 
  }

  function validate(): string | null {
    if (!form.name.trim()) return lang==='tr' ? 'Lütfen ad soyad giriniz.' : 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return lang==='tr' ? 'Geçerli bir e-posta giriniz.' : 'Please enter a valid email.';
    if (!form.consent) return lang==='tr' ? 'KVKK onayını vermelisiniz.' : 'You must provide KVKK/GDPR consent.';
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setError('');
    
    // Sadece adım 2'ye geç, mail gönderme
    setStep(2); 
    setToast(t.thankyou);
  }

  async function submitToFormspree(includeGrowthData = false) {
    const formData = {
      // Temel bilgiler (her zaman gönderilir)
      name: form.name,
      email: form.email,
      phone: form.phone || '',
      company: form.company || '',
      language: lang === 'tr' ? 'Türkçe' : 'English',
      consent: form.consent,
      registrationDate: new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US'),
      registrationTime: new Date().toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-US'),
      
      // Demo tercihleri (sadece 2. adım tamamlanırsa)
      ...(includeGrowthData && {
        jobTitle: growth.jobTitle || '',
        companySize: growth.companySize || '',
        useCase: growth.useCase || '',
        startTimeline: growth.start || '',
        completedStep2: true
      }),
      
      // Form tipi
      formType: includeGrowthData ? 'Complete Registration' : 'Basic Registration'
    };

    try {
      // Formspree ile basit fetch (CORS header'ları ile)
      const response = await fetch('https://formspree.io/f/mnngnddr', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    }
  }

  async function handleStep2Submit() {
    setIsSubmitting(true);
    setError('');
    
    try {
      const success = await submitToFormspree(true);
      
      if (success) {
        setToast(t.ok);
        setStep(3);
      } else {
        setError(lang === 'tr' ? 'Bir hata oluştu, lütfen tekrar deneyin.' : 'An error occurred, please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSkipStep2() {
    setIsSubmitting(true);
    setError('');
    
    try {
      const success = await submitToFormspree(false);
      
      if (success) {
        setToast(lang === 'tr' ? 'Ön kaydınız tamamlandı!' : 'Your pre-registration is complete!');
        setStep(3);
      } else {
        setError(lang === 'tr' ? 'Bir hata oluştu, lütfen tekrar deneyin.' : 'An error occurred, please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card hover-lift animate-fade-in-up" style={{ padding: 'var(--space-8)' }}>
        {/* Progress Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 'var(--space-6)',
          paddingBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{ 
            background: 'var(--primary-light)', 
            color: 'var(--primary)', 
            padding: 'var(--space-2) var(--space-4)', 
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)'
          }}>
            {t.progress}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <button 
              type="button" 
              onClick={() => setLang('tr')}
              style={{
                background: lang === 'tr' ? 'var(--primary)' : 'transparent',
                color: lang === 'tr' ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${lang === 'tr' ? 'var(--primary)' : 'var(--border-medium)'}`,
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              TR
            </button>
            <button 
              type="button" 
              onClick={() => setLang('en')}
              style={{
                background: lang === 'en' ? 'var(--primary)' : 'transparent',
                color: lang === 'en' ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${lang === 'en' ? 'var(--primary)' : 'var(--border-medium)'}`,
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              EN
            </button>
          </div>
        </div>

        {/* Toast Messages */}
        {toast && (
          <div className="alert success" style={{ marginBottom: 'var(--space-6)' }}>
            {toast}
          </div>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>{t.title1}</h2>
            
            <div className="grid grid-2" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">{t.name}</label>
                <input 
                  id="name"
                  className="form-input"
                  name="name" 
                  value={form.name} 
                  onChange={onChange} 
                  required 
                  aria-required="true"
                  placeholder={lang === 'tr' ? 'Emir Yücel' : 'John Doe'}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">{t.email}</label>
                <input 
                  id="email"
                  className="form-input"
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={onChange} 
                  required 
                  aria-required="true"
                  placeholder="info@asistanapp.com.tr"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="company" className="form-label">{t.company}</label>
                <input 
                  id="company"
                  className="form-input"
                  name="company" 
                  value={form.company ?? ''} 
                  onChange={onChange}
                  placeholder={lang === 'tr' ? 'AsistanApp' : 'AsistanApp'}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">{t.phone}</label>
                <input 
                  id="phone"
                  className="form-input"
                  name="phone" 
                  type="tel"
                  value={form.phone ?? ''} 
                  onChange={onChange}
                  placeholder="+90 543 899 2696"
                />
              </div>
            </div>
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                checked={form.consent} 
                onChange={(e) => setForm(s => ({...s, consent: e.target.checked}))}
                id="consent"
              />
              <label htmlFor="consent" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-normal)' }}>
                {t.consent}
              </label>
            </div>
            
            {error && <div className="alert error">{error}</div>}
            
            <button 
              className="btn btn-primary btn-lg" 
              type="submit" 
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.6s linear infinite'
                }}></span>
              )}
              {isSubmitting 
                ? (lang === 'tr' ? 'Gönderiliyor...' : 'Submitting...') 
                : t.submit1
              }
            </button>
          </form>
        )}

        {/* Step 2: Additional Information */}
        {step === 2 && (
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>{t.title2}</h2>
            
            <div className="grid grid-2" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="form-group">
                <label htmlFor="jobTitle" className="form-label">{t.jobTitle}</label>
                <select id="jobTitle" className="form-select" name="jobTitle" onChange={onGrowthChange} defaultValue="">
                  <option value="" disabled>—</option>
                  <option value="owner">{t.owner}</option>
                  <option value="manager">{t.manager}</option>
                  <option value="employee">{t.employee}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="companySize" className="form-label">{t.companySize}</label>
                <select id="companySize" className="form-select" name="companySize" onChange={onGrowthChange} defaultValue="">
                  <option value="" disabled>—</option>
                  <option value="1-10">1–10 {lang === 'tr' ? 'kişi' : 'people'}</option>
                  <option value="11-50">11–50 {lang === 'tr' ? 'kişi' : 'people'}</option>
                  <option value="50+">50+ {lang === 'tr' ? 'kişi' : 'people'}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="useCase" className="form-label">{t.useCase}</label>
                <select id="useCase" className="form-select" name="useCase" onChange={onGrowthChange} defaultValue="">
                  <option value="" disabled>—</option>
                  <option value="sales">{t.sales}</option>
                  <option value="support">{t.support}</option>
                  <option value="payment">{t.payment}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="startTime" className="form-label">{t.startTime}</label>
                <select id="startTime" className="form-select" name="start" onChange={onGrowthChange} defaultValue="">
                  <option value="" disabled>—</option>
                  <option value="now">{t.now}</option>
                  <option value="3m">{t.month3}</option>
                  <option value="6m+">{t.month6}</option>
                </select>
              </div>
            </div>
            
            {error && <div className="alert error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}
            
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={handleStep2Submit}
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                {isSubmitting && (
                  <span className="spinner" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.6s linear infinite'
                  }}></span>
                )}
                {isSubmitting 
                  ? (lang === 'tr' ? 'Kaydediliyor...' : 'Saving...') 
                  : t.submit2
                }
              </button>
              <button 
                type="button"
                onClick={handleSkipStep2}
                disabled={isSubmitting}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: isSubmitting ? 'var(--text-muted)' : 'var(--text-secondary)', 
                  textDecoration: 'underline', 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                {t.skip}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Thank You */}
        {step === 3 && (
          <div className="text-center animate-fade-in-scale">
            <div className="celebrate" style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', display: 'inline-block' }}>
              🎉
            </div>
            <h2 style={{ color: 'var(--primary)', marginBottom: 'var(--space-4)' }}>
              {lang === 'tr' ? 'Teşekkürler!' : 'Thank You!'}
            </h2>
            <div className="alert success" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
            }}>
              {t.ok}
            </div>
            <p style={{ marginTop: 'var(--space-6)', color: 'var(--text-muted)' }}>
              {lang === 'tr' 
                ? 'Size en kısa sürede dönüş yapacağız. Bu sayfayı kapatabilirsiniz.' 
                : 'We will get back to you as soon as possible. You can close this page.'
              }
            </p>
            
            {/* Confetti Elements */}
            <div style={{ position: 'relative', height: '0', overflow: 'visible' }}>
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="confetti"
                  style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: '0',
                    fontSize: '1.5rem',
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                >
                  {['🎊', '🎉', '✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 6)]}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}