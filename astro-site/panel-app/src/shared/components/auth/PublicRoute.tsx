 

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth-store';
import { FullPageLoader } from '@/shared/ui/loading';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectIfAuthenticated = true 
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return <FullPageLoader variant="dots" size="xl" color="primary" />;
  }

  // Redirect to appropriate dashboard based on user role or current path
  if (isAuthenticated && redirectIfAuthenticated) {
    const from = (location.state as any)?.from?.pathname;
    
    if (from) {
      return <Navigate to={from} replace />;
    }
    
    // Determine redirect based on current login path
    let dashboardPath = '/admin/dashboard'; // Default
    
    if (location.pathname.includes('/agent')) {
      dashboardPath = '/agent/dashboard';
    } else if (location.pathname.includes('/asistansuper')) {
      dashboardPath = '/asistansuper/dashboard';
    }
    
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
