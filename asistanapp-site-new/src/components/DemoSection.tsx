import './DemoSection.css';

function DemoSection() {
  return (
    <section id="demo" className="demo-section">
      <div className="container">
        <div className="demo-header">
          <h2 className="section-title">Try the Live Demo</h2>
          <p className="section-description">
            Experience AsistanApp Panel firsthand. Explore the interface, test features, and see how it can transform your customer support.
          </p>
        </div>
        
        <div className="demo-container">
          <div className="demo-notice">
            <div className="notice-icon">ℹ️</div>
            <div className="notice-content">
              <h3>Demo Panel Installation</h3>
              <p>
                To display the live demo, place your built panel application in the <code>/demo</code> folder. 
                The demo build should be configured with demo tenant credentials and sample data.
              </p>
              <div className="notice-steps">
                <h4>Setup Instructions:</h4>
                <ol>
                  <li>Build your panel with demo configuration: <code>npm run build:demo</code></li>
                  <li>Copy the <code>dist-demo</code> folder contents to <code>asistanapp-site-new/demo/</code></li>
                  <li>The demo will be accessible at <code>/demo/index.html</code></li>
                </ol>
              </div>
            </div>
          </div>

          <div className="demo-frame-wrapper">
            <div className="demo-frame-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">🚀</div>
                <h3>Demo Panel Will Appear Here</h3>
                <p>
                  Once you place the demo build in the <code>/demo</code> folder, 
                  it will be embedded in this iframe automatically.
                </p>
                <div className="placeholder-link">
                  <a href="/demo/index.html" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    Open Demo in New Tab
                  </a>
                </div>
              </div>
            </div>
            {/* Uncomment when demo build is ready */}
            {/* <iframe
              src="/demo/index.html"
              className="demo-iframe"
              title="AsistanApp Panel Demo"
              sandbox="allow-scripts allow-same-origin allow-forms"
            /> */}
          </div>
        </div>

        <div className="demo-features">
          <h3>What You Can Try:</h3>
          <div className="demo-features-grid">
            <div className="demo-feature">
              <span className="demo-feature-icon">✅</span>
              <span>Create and manage support tickets</span>
            </div>
            <div className="demo-feature">
              <span className="demo-feature-icon">✅</span>
              <span>Browse conversation history</span>
            </div>
            <div className="demo-feature">
              <span className="demo-feature-icon">✅</span>
              <span>Test real-time notifications</span>
            </div>
            <div className="demo-feature">
              <span className="demo-feature-icon">✅</span>
              <span>Explore analytics dashboard</span>
            </div>
            <div className="demo-feature">
              <span className="demo-feature-icon">✅</span>
              <span>Customize panel settings</span>
            </div>
            <div className="demo-feature">
              <span className="demo-feature-icon">✅</span>
              <span>View team collaboration features</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoSection;
