
import React, { createContext, useContext, useCallback } from 'react';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import toast from 'react-hot-toast';

import { AuthState, User, LoginCredentials, RegisterData, UserRole } from '@/types';
import { logger } from '@/shared/utils/logger';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshTokenAction: () => Promise<string>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
  initializeAuth: () => void;
  
  // Internal state
  error: string | null;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,

        // Actions
        login: async (credentials: LoginCredentials) => {
          try {
            set({ isLoading: true, error: null });
            
            // ✅ DEMO ŞİFRE KONTROLLARI - SHA-256 Hash
            const DEMO_PASSWORDS = {
              admin: '5283d2ebf22e694681ac4fb8aec48d434327b8a84b82ac4627f2c96722d69981', // AsistanApp2025
              superadmin: '54465af9d2d6a93bb780d7b968de24fc5d5e0d74b01e5b7f8e8b4c5d8a9c2f3e', // SuperAdmin2025
              agent: '5283d2ebf22e694681ac4fb8aec48d434327b8a84b82ac4627f2c96722d69981', // AsistanApp2025
            };
            
            const hashPassword = async (pwd: string) => {
              const encoder = new TextEncoder();
              const data = encoder.encode(pwd);
              const hashBuffer = await crypto.subtle.digest('SHA-256', data);
              const hashArray = Array.from(new Uint8Array(hashBuffer));
              return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            };
            
            const hashedPassword = await hashPassword(credentials.password.trim());
            
            // ✅ Email'e göre role belirle - ÇOK SPESIFIK KONTROL
            let userRole: UserRole;
            let requiredHash: string;
            
            if (credentials.email.includes('agent') || credentials.email.includes('ekip')) {
              userRole = 'agent';
              requiredHash = DEMO_PASSWORDS.agent;
            } else if (credentials.email.includes('business')) {
              userRole = 'owner';
              requiredHash = DEMO_PASSWORDS.admin;
            } else if (credentials.email.includes('superadmin') || credentials.email === 'super@asistanapp.com') {
              // SuperAdmin için özel email kontrolü
              userRole = 'admin';
              requiredHash = DEMO_PASSWORDS.superadmin;
            } else {
              // Normal admin
              userRole = 'admin';
              requiredHash = DEMO_PASSWORDS.admin;
            }
            
            // ✅ Şifre kontrolü
            if (hashedPassword !== requiredHash) {
              throw new Error('E-posta veya şifre hatalı!');
            }
            
            // Real API authentication (with fallback to mock)
            try {
              // Try real API login first
              const response = await fetch('http://localhost:3001/api/v1/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
              });
              
              if (response.ok) {
                const apiData = await response.json();
                
                set({
                  user: apiData.data.user,
                  token: apiData.data.token,
                  refreshToken: apiData.data.refreshToken,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
                
                // Store tokens in localStorage for API service
                localStorage.setItem('authToken', apiData.data.token);
                localStorage.setItem('refreshToken', apiData.data.refreshToken);
                localStorage.setItem('tenantId', apiData.data.user.tenantId);
                
                toast.success(`Welcome back, ${apiData.data.user.profile?.firstName || apiData.data.user.email}!`);
                return;
              }
            } catch (apiError) {
              logger.warn('Real API login failed, falling back to mock auth', { error: apiError });
            }
            
            // Fallback to mock authentication for development
            const mockUser = {
              id: '1',
              tenantId: 'default',
              email: credentials.email,
              name: userRole === 'agent' ? 'Ekip Üyesi' : userRole === 'owner' ? 'İşletme Sahibi' : 'Yönetici',
              role: userRole,
              permissions: ['all'],
              mfaEnabled: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              profile: {
                firstName: userRole === 'agent' ? 'Ekip' : userRole === 'owner' ? 'İşletme' : 'Yönetici',
                lastName: userRole === 'agent' ? 'Üyesi' : userRole === 'owner' ? 'Sahibi' : 'User',
                avatar: undefined,
                timezone: 'Europe/Istanbul',
                language: 'tr',
                preferences: {
                  theme: 'light' as const,
                  notifications: {
                    email: true,
                    push: true,
                    sms: false
                  },
                  dashboard: {
                    layout: 'default' as const,
                    widgets: ['stats', 'recent-activities', 'quick-actions']
                  }
                }
              }
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            set({
              user: mockUser,
              token: 'mock-jwt-token',
              refreshToken: 'mock-refresh-token',
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            toast.success(`Hoş geldiniz, ${mockUser.profile?.firstName}!`);
          } catch (error: any) {
            const errorMessage = error.message || 'Login failed. Please try again.';
            set({ 
              error: errorMessage, 
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null,
              refreshToken: null,
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        register: async (_data: RegisterData) => {
          try {
            set({ isLoading: true, error: null });
            
            // Mock registration for development
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set({ isLoading: false });
            
            toast.success('Registration successful! Please check your email to verify your account.');
          } catch (error: any) {
            const errorMessage = 'Registration failed. Please try again.';
            set({ 
              error: errorMessage, 
              isLoading: false,
            });
            toast.error(errorMessage);
            throw error;
          }
        },

        logout: () => {
          // Clear state (mock logout)
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });

          // Clear token refresh timer
          clearTokenRefreshTimer();
          
          toast.success('Logged out successfully');
        },

        refreshTokenAction: async () => {
          try {
            const currentRefreshToken = get().refreshToken;
            if (!currentRefreshToken) {
              throw new Error('No refresh token available');
            }

            // Mock token refresh
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const newToken = 'mock-jwt-token-refreshed';
            const newRefreshToken = 'mock-refresh-token-refreshed';

            set({
              token: newToken,
              refreshToken: newRefreshToken,
            });

            // Schedule next refresh
            scheduleTokenRefresh(newToken);

            return newToken;
          } catch (error) {
            logger.error('Token refresh failed', error as Error);
            // If refresh fails, logout the user
            get().logout();
            throw error;
          }
        },

        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, ...userData },
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        initializeAuth: () => {
          const token = get().token;
          const refreshToken = get().refreshToken;
          const user = get().user;
          
          logger.auth('Initializing auth', { hasToken: !!token, hasRefreshToken: !!refreshToken, hasUser: !!user });
          
          // If no token/refresh token, set as not authenticated
          if (!token || !refreshToken) {
            logger.auth('No token/refreshToken found, logging out');
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
            return;
          }
          
          // Mock token için özel kontrol (development için)
          if (token.startsWith('mock-')) {
            logger.auth('Mock token detected, user authenticated');
            set({ 
              isAuthenticated: true, 
              isLoading: false 
            });
            return;
          }
          
          try {
            // Validate token format (real JWT token)
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
              throw new Error('Invalid token format');
            }
            
            // Check if token is expired
            const payload = JSON.parse(atob(tokenParts[1]));
            const isExpired = payload.exp * 1000 < Date.now();
            
            if (isExpired) {
              logger.auth('Token expired, refreshing');
              // Try to refresh token
              get().refreshTokenAction().catch(() => {
                // If refresh fails, logout
                logger.auth('Token refresh failed, logging out');
                get().logout();
              });
            } else {
              // Token is valid, set up refresh timer
              logger.auth('Token valid, session continues');
              scheduleTokenRefresh(token);
              set({ isAuthenticated: true, isLoading: false });
            }
          } catch (error) {
            logger.warn('Token validation failed', { error });
            // Mock token olabilir, user varsa oturum açık kabul et
            if (user) {
              logger.auth('User info exists, session active');
              set({ isAuthenticated: true, isLoading: false });
            } else {
              logger.auth('No user info, logging out');
              // Clear invalid token
              localStorage.removeItem('authToken');
              localStorage.removeItem('refreshToken');
              // Set as not authenticated
              set({
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
              });
            }
          }
        },

        // Internal setters
        setError: (error: string | null) => set({ error }),
        setLoading: (loading: boolean) => set({ isLoading: loading }),
      }),
      {
        name: 'asistan-auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

// Token refresh timer
let refreshTimer: NodeJS.Timeout | null = null;

const scheduleTokenRefresh = (token: string) => {
  try {
    // Clear existing timer
    clearTokenRefreshTimer();
    
    // Parse token to get expiry
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    // Refresh 5 minutes before expiry
    const refreshTime = expiryTime - currentTime - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      refreshTimer = setTimeout(() => {
        useAuthStore.getState().refreshTokenAction().catch(() => {
          useAuthStore.getState().logout();
        });
      }, refreshTime);
    }
  } catch (error) {
    logger.error('Failed to schedule token refresh', error as Error);
  }
};

const clearTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

// Auth Context Provider
interface AuthContextValue {
  hasPermission: (requiredRoles?: UserRole[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  canAccessResource: (resourceId: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();

  const hasPermission = useCallback((requiredRoles?: UserRole[]) => {
    if (!user || !requiredRoles || requiredRoles.length === 0) {
      return true; // No specific roles required
    }
    
    return requiredRoles.includes(user.role);
  }, [user]);

  const hasRole = useCallback((role: UserRole) => {
    return user?.role === role;
  }, [user]);

  const canAccessResource = useCallback((_resourceId: string, _action: string) => {
    if (!user) return false;
    
    // Implement resource-based permissions here
    // This is a simplified example
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      agent: 2,
      manager: 3,
      admin: 4,
      owner: 5,
    };
    
    const userLevel = roleHierarchy[user.role];
    
    // Different actions require different permission levels
    const actionLevels: Record<string, number> = {
      read: 1,
      create: 2,
      update: 2,
      delete: 3,
      manage: 4,
    };
    
    const requiredLevel = actionLevels[_action] || 1;
    
    return userLevel >= requiredLevel;
  }, [user]);

  const value: AuthContextValue = {
    hasPermission,
    hasRole,
    canAccessResource,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Auth hooks
export const useAuth = () => {
  const authStore = useAuthStore();
  const authContext = useAuthContext();
  
  return {
    ...authStore,
    ...authContext,
  };
};

export const useCurrentUser = () => {
  return useAuthStore((state) => state.user);
};

export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated);
};
