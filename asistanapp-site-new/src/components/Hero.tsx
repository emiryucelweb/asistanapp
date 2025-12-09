import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            AsistanApp Panel
          </h1>
          <p className="hero-subtitle">
            Modern Customer Support Management Platform
          </p>
          <p className="hero-description">
            Transform your customer support operations with our powerful, intuitive panel. 
            Manage tickets, conversations, and team collaboration all in one place.
          </p>
          <div className="hero-actions">
            <a href="#demo" className="btn btn-primary">
              Try Live Demo
            </a>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-placeholder">
            <svg width="100%" height="100%" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="600" height="400" rx="8" fill="#f3f4f6"/>
              <rect x="20" y="20" width="560" height="60" rx="4" fill="#e5e7eb"/>
              <rect x="40" y="35" width="120" height="30" rx="4" fill="#d1d5db"/>
              <rect x="20" y="100" width="180" height="280" rx="4" fill="#e5e7eb"/>
              <rect x="40" y="120" width="140" height="20" rx="2" fill="#d1d5db"/>
              <rect x="40" y="150" width="140" height="20" rx="2" fill="#d1d5db"/>
              <rect x="40" y="180" width="140" height="20" rx="2" fill="#d1d5db"/>
              <rect x="220" y="100" width="360" height="280" rx="4" fill="#e5e7eb"/>
              <rect x="240" y="120" width="320" height="40" rx="2" fill="#d1d5db"/>
              <rect x="240" y="170" width="320" height="80" rx="2" fill="#d1d5db"/>
              <rect x="240" y="260" width="320" height="80" rx="2" fill="#d1d5db"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
