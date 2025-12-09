import './Features.css';

function Features() {
  const features = [
    {
      icon: '💬',
      title: 'Unified Inbox',
      description: 'Manage all customer conversations from multiple channels in one centralized dashboard.'
    },
    {
      icon: '🎫',
      title: 'Smart Ticketing',
      description: 'Intelligent ticket routing and prioritization to ensure no customer request goes unanswered.'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Seamless collaboration tools for your support team with real-time updates and notifications.'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics to track performance, measure satisfaction, and optimize operations.'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Assistance',
      description: 'Leverage AI to automate responses, categorize tickets, and provide intelligent suggestions.'
    },
    {
      icon: '🔧',
      title: 'Customizable Workflows',
      description: 'Create custom workflows and automations tailored to your unique business processes.'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-description">
            Everything you need to deliver exceptional customer support
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
