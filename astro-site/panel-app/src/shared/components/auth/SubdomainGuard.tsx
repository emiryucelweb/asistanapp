/**
 * Subdomain Guard Component
 * Kullanıcıyı rolüne göre doğru subdomain'e yönlendirir
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth-store';
import {
  getSubdomainType,
  canAccessSubdomain,
  redirectToCorrectSubdomain,
  getCurrentSubdomainConfig,
} from '@/utils/subdomain';
import { FullPageLoader } from '@/shared/ui/loading';

interface SubdomainGuardProps {
  children: React.ReactNode;
}

const SubdomainGuard: React.FC<SubdomainGuardProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    if (isLoading) return;

    const checkSubdomainAccess = () => {
      const currentType = getSubdomainType();
      const config = getCurrentSubdomainConfig();

      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      if (!isAuthenticated || !user) {
        navigate(config.loginRoute, { replace: true });
        setIsChecking(false);
        return;
      }

      // Kullanıcının bu subdomain'e erişim yetkisi var mı?
      const hasAccess = canAccessSubdomain(user.role, currentType);

      if (!hasAccess) {
        // Doğru subdomain'e yönlendir
        const redirectUrl = redirectToCorrectSubdomain(user.role);
        if (redirectUrl) {
          // External redirect (farklı subdomain)
          if (redirectUrl.startsWith('http')) {
            window.location.href = redirectUrl;
            return;
          }
          // Internal redirect (aynı subdomain, farklı path)
          navigate(redirectUrl, { replace: true });
          return;
        }
      }

      setIsChecking(false);
    };

    checkSubdomainAccess();
  }, [isAuthenticated, user, isLoading, navigate]);

  if (isLoading || isChecking) {
    return <FullPageLoader variant="dots" size="xl" color="primary" />;
  }

  return <>{children}</>;
};

export default SubdomainGuard;


