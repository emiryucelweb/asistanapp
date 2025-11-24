import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [lang, setLang] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    // Check if user already gave consent
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }

    // Sync with site language
    const currentLang = document.documentElement.getAttribute('data-lang') || 'tr';
    setLang(currentLang as 'tr' | 'en');

    // Listen for language changes
    const observer = new MutationObserver(() => {
      const newLang = document.documentElement.getAttribute('data-lang') || 'tr';
      setLang(newLang as 'tr' | 'en');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-lang']
    });

    return () => observer.disconnect();
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
    // Enable analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShow(false);
    // Disable analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  };

  if (!show) return null;

  const t = {
    tr: {
      title: '🍪 Çerez Kullanımı',
      message: 'Web sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz. Detaylı bilgi için',
      privacy: 'Gizlilik Politikası',
      accept: 'Kabul Et',
      reject: 'Reddet'
    },
    en: {
      title: '🍪 Cookie Usage',
      message: 'We use cookies to improve your experience on our website. For details, see our',
      privacy: 'Privacy Policy',
      accept: 'Accept',
      reject: 'Reject'
    }
  }[lang];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-xl)',
        padding: 'var(--space-4)',
        zIndex: 1000,
        animation: 'slideInFromBottom 0.4s ease-out'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
            {t.title}
          </h3>
          <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            {t.message}{' '}
            <a href="/privacy-policy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
              {t.privacy}
            </a>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            onClick={handleReject}
            style={{
              padding: 'var(--space-3) var(--space-5)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-secondary)',
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-medium)';
            }}
          >
            {t.reject}
          </button>
          
          <button
            onClick={handleAccept}
            className="btn btn-primary"
            style={{
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              whiteSpace: 'nowrap'
            }}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
