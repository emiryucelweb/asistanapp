import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface DemoGuardProps {
  children: React.ReactNode;
}

const DemoGuard: React.FC<DemoGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = sessionStorage.getItem('isDemoAuthenticated') === 'true';
      
      if (!isAuth && location.pathname !== '/demo-login') {
        navigate('/demo-login');
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, location]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default DemoGuard;
