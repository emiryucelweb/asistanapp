/**
 * Subdomain Detection & Routing Utility
 * Her subdomain'in kendi dashboard'ına yönlendirilmesi
 */

import { logger } from '@/shared/utils/logger';

export type SubdomainType = 'customer' | 'agent' | 'admin' | 'unknown';

export interface SubdomainConfig {
  type: SubdomainType;
  name: string;
  baseRoute: string;
  loginRoute: string;
  defaultRoute: string;
  allowedRoles: string[];
}

/**
 * Subdomain yapılandırmaları
 */
export const SUBDOMAIN_CONFIG: Record<SubdomainType, SubdomainConfig> = {
  customer: {
    type: 'customer',
    name: 'Firma Sahibi Paneli',
    baseRoute: '/admin',
    loginRoute: '/admin/login',
    defaultRoute: '/admin/dashboard',
    allowedRoles: ['owner', 'admin', 'manager'],
  },
  agent: {
    type: 'agent',
    name: 'Çalışan Paneli',
    baseRoute: '/agent',
    loginRoute: '/agent/login',
    defaultRoute: '/agent/conversations',
    allowedRoles: ['agent'],
  },
  admin: {
    type: 'admin',
    name: 'AsistanApp Super Admin',
    baseRoute: '/asistansuper',
    loginRoute: '/asistansuper/login',
    defaultRoute: '/asistansuper/dashboard',
    allowedRoles: ['superadmin'],
  },
  unknown: {
    type: 'unknown',
    name: 'Unknown',
    baseRoute: '/',
    loginRoute: '/login',
    defaultRoute: '/admin/dashboard',
    allowedRoles: [],
  },
};

/**
 * URL'den subdomain'i çıkar
 */
export const getSubdomain = (): string | null => {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  
  // localhost veya IP adresi için subdomain yok
  if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }

  const parts = hostname.split('.');
  
  // En az 3 parça olmalı: subdomain.domain.com
  if (parts.length < 3) {
    return null;
  }

  return parts[0];
};

/**
 * Subdomain tipini belirle
 */
export const getSubdomainType = (): SubdomainType => {
  const subdomain = getSubdomain();

  // Localhost için path'e göre belirle
  if (!subdomain) {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/asistansuper')) return 'admin';
    if (pathname.startsWith('/agent')) return 'agent';
    if (pathname.startsWith('/admin')) return 'customer';
    return 'customer';
  }

  // Subdomain varsa subdomain'e göre belirle
  switch (subdomain) {
    case 'agent':
      return 'agent';
    case 'admin':
      return 'admin';
    case 'app':
    case 'panel':
    case 'dashboard':
      return 'customer';
    default:
      // Tenant slug olabilir (customer subdomain)
      return 'customer';
  }
};

/**
 * Mevcut subdomain config'ini getir
 */
export const getCurrentSubdomainConfig = (): SubdomainConfig => {
  const type = getSubdomainType();
  return SUBDOMAIN_CONFIG[type];
};

/**
 * Kullanıcının bu subdomain'e erişim yetkisi var mı?
 */
export const canAccessSubdomain = (userRole: string, subdomainType: SubdomainType): boolean => {
  const config = SUBDOMAIN_CONFIG[subdomainType];
  return config.allowedRoles.includes(userRole);
};

/**
 * Kullanıcıyı doğru subdomain'e yönlendir
 */
export const redirectToCorrectSubdomain = (userRole: string): string | null => {
  const currentType = getSubdomainType();
  const currentConfig = SUBDOMAIN_CONFIG[currentType];

  // Kullanıcının erişim yetkisi varsa yönlendirme yapma
  if (currentConfig.allowedRoles.includes(userRole)) {
    return null;
  }

  // Kullanıcının rolüne göre doğru subdomain'i bul
  let targetType: SubdomainType = 'customer';

  if (userRole === 'agent') {
    targetType = 'agent';
  } else if (userRole === 'superadmin') {
    targetType = 'admin';
  } else if (['owner', 'admin', 'manager'].includes(userRole)) {
    targetType = 'customer';
  }

  const targetConfig = SUBDOMAIN_CONFIG[targetType];

  // Localhost için path-based routing
  if (!getSubdomain()) {
    return targetConfig.defaultRoute;
  }

  // Production için subdomain-based routing
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  const domain = parts.slice(-2).join('.'); // asistanapp.com

  let targetSubdomain = '';
  switch (targetType) {
    case 'agent':
      targetSubdomain = 'agent';
      break;
    case 'admin':
      targetSubdomain = 'admin';
      break;
    case 'customer':
    default:
      targetSubdomain = 'app';
      break;
  }

  return `https://${targetSubdomain}.${domain}${targetConfig.defaultRoute}`;
};

/**
 * Subdomain bilgilerini console'a yazdır (debug için)
 */
export const debugSubdomain = () => {
  const subdomain = getSubdomain();
  const type = getSubdomainType();
  const config = getCurrentSubdomainConfig();

  logger.debug('🌐 Subdomain Debug Info', {
    currentUrl: window.location.href,
    hostname: window.location.hostname,
    subdomain: subdomain || 'none (localhost)',
    type,
    config
  });

  return { subdomain, type, config };
};

/**
 * Başka bir subdomain'e link oluştur
 */
export const createCrossSubdomainLink = (
  targetType: SubdomainType,
  path: string = ''
): string => {
  const subdomain = getSubdomain();

  // Localhost için path-based routing
  if (!subdomain) {
    const baseRoute = SUBDOMAIN_CONFIG[targetType].baseRoute;
    return `${baseRoute}${path}`;
  }

  // Production için subdomain-based routing
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  const domain = parts.slice(-2).join('.');

  let targetSubdomain = '';
  switch (targetType) {
    case 'agent':
      targetSubdomain = 'agent';
      break;
    case 'admin':
      targetSubdomain = 'admin';
      break;
    case 'customer':
    default:
      targetSubdomain = 'app';
      break;
  }

  return `https://${targetSubdomain}.${domain}${path}`;
};

