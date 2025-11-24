import { useState, useEffect } from 'react';

export default function WhatsAppButton() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);

    // Sync with site language
    const currentLang = document.documentElement.getAttribute('data-lang') || 'tr';
    setLang(currentLang as 'tr' | 'en');

    const observer = new MutationObserver(() => {
      const newLang = document.documentElement.getAttribute('data-lang') || 'tr';
      setLang(newLang as 'tr' | 'en');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-lang']
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const phoneNumber = '905312294707'; // +90 531 229 4707
  const message = lang === 'tr' 
    ? 'Merhaba, AsistanApp hakkında bilgi almak istiyorum.'
    : 'Hello, I would like to get information about AsistanApp.';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const tooltip = lang === 'tr' ? 'WhatsApp ile İletişime Geç' : 'Contact via WhatsApp';

  if (!isVisible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tooltip}
      title={tooltip}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        background: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
        cursor: 'pointer',
        zIndex: 999,
        transition: 'all 0.3s ease',
        animation: 'fadeInScale 0.5s ease-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 0C7.163 0 0 7.163 0 16c0 2.828.738 5.485 2.03 7.782L0 32l8.446-2.016A15.934 15.934 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.738 22.708c-.328.923-1.631 1.694-2.662 1.923-.71.154-1.636.277-4.748-1.022-3.964-1.654-6.515-5.692-6.715-5.954-.195-.262-1.6-2.13-1.6-4.062 0-1.931 1.015-2.883 1.374-3.277.36-.394.784-.492 1.046-.492.262 0 .523.005.754.014.242.01.566-.092.885.676.328.787 1.118 2.717 1.215 2.915.098.197.164.426.033.688-.13.262-.197.426-.393.656-.197.23-.414.512-.59.689-.197.196-.401.41-.173.804.23.393.999 1.648 2.145 2.668 1.476 1.315 2.72 1.723 3.108 1.915.39.192.62.164.85-.098.23-.262.984-1.148 1.246-1.542.262-.394.524-.328.885-.196.36.13 2.292 1.082 2.684 1.279.393.197.656.295.754.459.098.164.098.951-.23 1.874z"
          fill="white"
        />
      </svg>

      {/* Pulse animation ring */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid #25D366',
          animation: 'pulse 2s infinite'
        }}
      />
    </a>
  );
}
