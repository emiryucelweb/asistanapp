// AsistanApp - Site Scripts
// Language Management & Smooth Animations

(function() {
  'use strict';
  
  // Initialize language from localStorage or default to Turkish
  function initLanguage() {
    try {
      const saved = localStorage.getItem('asistanapp-lang');
      const lang = saved || 'tr';
      document.documentElement.setAttribute('data-lang', lang);
      return lang;
    } catch (e) {
      return 'tr';
    }
  }
  
  // Set language and save to localStorage
  function setLanguage(lang) {
    try {
      document.documentElement.setAttribute('data-lang', lang);
      localStorage.setItem('asistanapp-lang', lang);
      
      // Update active button states
      const buttons = document.querySelectorAll('.lang button');
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
      });
    } catch (e) {
      console.warn('Could not save language preference:', e);
    }
  }
  
  // Global function for language switching
  window.setLang = setLanguage;
  
  // Initialize smooth animations
  function initAnimations() {
    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            
            // Trigger staggered animations for children
            const staggerElements = entry.target.querySelectorAll('.animate-stagger > *');
            staggerElements.forEach((child, index) => {
              setTimeout(() => {
                child.style.opacity = '1';
                child.classList.add('animate-fade-in-up');
              }, index * 150);
            });
            
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      // Observe all animation elements
      document.querySelectorAll('.observe-animation').forEach(el => {
        observer.observe(el);
      });
    }

    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  // Initialize on DOM ready
  function init() {
    const currentLang = initLanguage();
    setLanguage(currentLang);
    initAnimations();
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
