 

// Business Context Provider - Stub implementation
import React, { createContext, useContext } from 'react';

interface BusinessConfig {
  type: string;
  name: string;
  slug?: string; // Tenant identifier
  settings: Record<string, any>;
}

interface BusinessContextType {
  config: BusinessConfig;
  business: BusinessConfig; // Alias for compatibility
  updateConfig: (config: Partial<BusinessConfig>) => void;
}

const BusinessContext = createContext<BusinessContextType | null>(null);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = React.useState<BusinessConfig>({
    type: 'ecommerce',
    name: 'Default Business',
    slug: 'default',
    settings: {}
  });

  const updateConfig = (newConfig: Partial<BusinessConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <BusinessContext.Provider value={{ config, business: config, updateConfig }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
