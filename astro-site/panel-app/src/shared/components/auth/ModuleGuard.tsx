/* =========================================
   AsistanApp - Module Guard Component
   Sektöre uygun olmayan modülleri kontrol eder
========================================= */

import React from 'react';
import { logger } from '@/shared/utils/logger';
import { useBusiness } from '@/contexts/BusinessContext';
import DisabledModulePage from '@/shared/pages/DisabledModulePage';

interface ModuleGuardProps {
  children: React.ReactNode;
  moduleId: string;
}

const ModuleGuard: React.FC<ModuleGuardProps> = ({ children, moduleId }) => {
  const { enabledModules, isLoading } = useBusiness();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>
      </div>
    );
  }
  
  // Bu modülün etkin olup olmadığını kontrol et
  const isModuleEnabled = enabledModules.find(
    module => module.id === moduleId
  )?.enabled ?? false;
  
  logger.debug('🛡️ ModuleGuard check:', { moduleId, isModuleEnabled, availableModules: enabledModules.length });
  
  if (!isModuleEnabled) {
    return <DisabledModulePage />;
  }
  
  return <>{children}</>;
};

export default ModuleGuard;
