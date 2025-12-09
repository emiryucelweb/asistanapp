import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth-store';
import { FullPageLoader } from '@/shared/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredPermission 
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return <FullPageLoader variant="dots" size="xl" color="primary" />;
  }

  // Redirect to appropriate login page based on current path
  if (!isAuthenticated || !user) {
    let loginPath = '/admin/login'; // Default to admin login
    
    if (location.pathname.startsWith('/agent')) {
      loginPath = '/agent/login';
    } else if (location.pathname.startsWith('/asistansuper')) {
      loginPath = '/asistansuper/login';
    }
    
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission requirement
  if (requiredPermission && user.permissions && !user.permissions.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
