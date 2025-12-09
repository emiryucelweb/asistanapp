/* =========================================
   AsistanApp - Enhanced Business Context
   Kapsamlı refactor ile stabilize edildi
========================================= */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  BusinessType, 
  BusinessTypeConfig, 
  ModuleConfig,
  getBusinessTypeConfig, 
  getEnabledModules,
  isModuleEnabled,
  DEFAULT_BUSINESS_TYPE,
  detectBusinessType
} from '@/shared/config/business-types';
import { logger } from '@/shared/utils/logger';

// Consistent localStorage key
const STORAGE_KEY = 'asistanapp_business_type';

interface BusinessContextType {
  // Current business configuration
  businessType: BusinessType;
  config: BusinessTypeConfig;
  enabledModules: ModuleConfig[];
  isLoading: boolean;
  
  // Business management
  setBusinessType: (type: BusinessType) => void;
  isModuleEnabled: (moduleId: string) => boolean;
  getTerminology: (key: keyof BusinessTypeConfig['terminology']) => string;
  
  // Auto-detection
  detectAndSetBusinessType: (businessName: string, description?: string) => BusinessType;
  resetToDefault: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

interface BusinessProviderProps {
  children: ReactNode;
  defaultBusinessType?: BusinessType;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ 
  children, 
  defaultBusinessType = DEFAULT_BUSINESS_TYPE 
}) => {
  const [businessType, setBusinessTypeState] = useState<BusinessType>(defaultBusinessType);
  const [config, setConfig] = useState<BusinessTypeConfig>(getBusinessTypeConfig(defaultBusinessType));
  const [enabledModules, setEnabledModules] = useState<ModuleConfig[]>(getEnabledModules(defaultBusinessType));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedBusinessType = localStorage.getItem(STORAGE_KEY) as BusinessType;
      
      if (savedBusinessType && savedBusinessType !== businessType) {
        logger.debug('Loading saved business type', { businessType: savedBusinessType });
        setBusinessTypeState(savedBusinessType);
      }
    } catch (error) {
      logger.warn('Error loading business type from localStorage', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsLoading(false);
    }
  }, [businessType]);

  // Update configuration when business type changes
  useEffect(() => {
    try {
      logger.debug('Business type changing', { businessType });
      
      const newConfig = getBusinessTypeConfig(businessType);
      const newEnabledModules = getEnabledModules(businessType);
      
      setConfig(newConfig);
      setEnabledModules(newEnabledModules);
      
      // Update CSS custom properties for theming
      const root = document.documentElement;
      root.style.setProperty('--business-primary', newConfig.colors.primary);
      root.style.setProperty('--business-secondary', newConfig.colors.secondary);
      root.style.setProperty('--business-accent', newConfig.colors.accent);
      
      // Store in localStorage for persistence
      localStorage.setItem(STORAGE_KEY, businessType);
      
      logger.debug('Business configuration updated', {
        type: businessType,
        name: newConfig.name,
        enabledModules: newEnabledModules.length
      });
      
    } catch (error) {
      logger.error('Error updating business configuration', error as Error, { businessType });
    }
  }, [businessType]);

  const setBusinessType = (type: BusinessType) => {
    logger.debug('Setting business type', { type });
    setBusinessTypeState(type);
    
    // Show enhanced notification
    try {
      const newConfig = getBusinessTypeConfig(type);
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="
          position: fixed; 
          top: 20px; 
          right: 20px; 
          background: ${newConfig.colors.primary}; 
          color: white; 
          padding: 16px 24px; 
          border-radius: var(--radius-xl); 
          box-shadow: var(--shadow-xl); 
          z-index: 9999;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          animation: slideIn 0.3s ease-out;
          max-width: 300px;
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">${newConfig.emoji}</span>
            <div>
              <div>${newConfig.name} sektörüne geçildi!</div>
              <div style="font-size: var(--font-size-xs); opacity: 0.9; margin-top: 2px;">
                ${newConfig.description}
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add animation styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(notification);
      
      // Auto remove after 4 seconds with animation
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          try {
            document.body.removeChild(notification);
            document.head.removeChild(style);
          } catch (cleanupError) {
            // Element might already be removed - silently ignore
            logger.debug('Notification cleanup skipped', { error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError) });
          }
        }, 300);
      }, 4000);
      
    } catch (error) {
      logger.warn('Error showing notification', { error: error instanceof Error ? error.message : String(error) });
    }
  };

  const checkModuleEnabled = (moduleId: string): boolean => {
    return isModuleEnabled(businessType, moduleId);
  };

  const getTerminology = (key: keyof BusinessTypeConfig['terminology']): string => {
    return config.terminology[key] || key;
  };

  const detectAndSetBusinessType = (businessName: string, description?: string): BusinessType => {
    const detectedType = detectBusinessType(businessName, description);
    logger.debug('Auto-detected business type', { detectedType, businessName });
    setBusinessType(detectedType);
    return detectedType;
  };

  const resetToDefault = () => {
    logger.debug('Resetting to default business type', { defaultType: DEFAULT_BUSINESS_TYPE });
    localStorage.removeItem(STORAGE_KEY);
    setBusinessType(DEFAULT_BUSINESS_TYPE);
  };

  const contextValue: BusinessContextType = {
    businessType,
    config,
    enabledModules,
    isLoading,
    setBusinessType,
    isModuleEnabled: checkModuleEnabled,
    getTerminology,
    detectAndSetBusinessType,
    resetToDefault
  };

  return (
    <BusinessContext.Provider value={contextValue}>
      {children}
    </BusinessContext.Provider>
  );
};

// Custom hook to use business context
export const useBusiness = (): BusinessContextType => {
  const context = useContext(BusinessContext);
  
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  
  return context;
};

// Helper hooks for common use cases
export const useBusinessConfig = (): BusinessTypeConfig => {
  const { config } = useBusiness();
  return config;
};

export const useEnabledModules = (): ModuleConfig[] => {
  const { enabledModules } = useBusiness();
  return enabledModules;
};

export const useBusinessTerminology = () => {
  const { getTerminology } = useBusiness();
  return getTerminology;
};

export const useModuleEnabled = (moduleId: string): boolean => {
  const { isModuleEnabled } = useBusiness();
  return isModuleEnabled(moduleId);
};