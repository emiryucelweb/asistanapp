import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Components
import { FullPageLoader } from '@/shared/ui/loading';
import {
  DashboardLoadingState,
  ConversationsLoadingState,
  TableLoadingState,
  ProfileLoadingState,
  SettingsLoadingState,
  TeamChatLoadingState,
  GenericPageLoadingState,
} from '@/shared/ui/loading/PageLoadingState';
import MainLayout from '@/shared/components/layout/MainLayout';
import ProtectedRoute from '@/shared/components/auth/ProtectedRoute';
import PublicRoute from '@/shared/components/auth/PublicRoute';
import DemoGuard from '@/shared/components/auth/DemoGuard';
import { ErrorBoundary } from '@/shared/components/errors';
import { WebVitalsMonitor } from '@/shared/components/monitoring';

// Hooks
import { useAuthStore } from '@/shared/stores/auth-store';
import { useWebSocket } from '@/shared/hooks/useWebSocket';

// Utils
import { logger } from '@/shared/utils/logger';
import { setupGlobalErrorHandlers } from '@/shared/utils/global-error-handler';

// Contexts
import { BusinessProvider } from './contexts/BusinessContext';

// React Query
import { queryClient } from './lib/react-query/queryClient';

// Pages
const PanelSelector = React.lazy(() => import('@/shared/pages/PanelSelector'));
const DemoLoginPage = React.lazy(() => import('@/shared/pages/DemoLoginPage'));
const LoginPage = React.lazy(() => import('@/shared/pages/auth/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('@/shared/pages/auth/ForgotPasswordPage'));
const AdminLoginPage = React.lazy(() => import('@/shared/pages/auth/AdminLoginPage'));
const AdminForgotPasswordPage = React.lazy(() => import('@/shared/pages/auth/AdminForgotPasswordPage'));
const AgentLoginPage = React.lazy(() => import('@/shared/pages/auth/AgentLoginPage'));
const AgentForgotPasswordPage = React.lazy(() => import('@/shared/pages/auth/AgentForgotPasswordPage'));
const DashboardPage = React.lazy(() => import('@/features/admin/pages/dashboard/DashboardPage'));
const ConversationsPage = React.lazy(() => import('@/features/admin/pages/conversations/ConversationsPage'));
const ReportsPage = React.lazy(() => import('@/features/admin/pages/reports/ReportsPage'));
const SettingsPage = React.lazy(() => import('@/features/admin/pages/settings/SettingsPage'));
const TeamPage = React.lazy(() => import('@/features/admin/pages/team/TeamPage'));
const TeamChatPage = React.lazy(() => import('@/features/admin/pages/team/TeamChatPage'));
const HelpPage = React.lazy(() => import('@/shared/pages/help/HelpPage'));
const NotFoundPage = React.lazy(() => import('@/shared/pages/errors/NotFoundPage'));
const ServerErrorPage = React.lazy(() => import('@/shared/pages/errors/ServerErrorPage'));

// Agent Pages
const AgentDashboard = React.lazy(() => import('@/features/agent/pages/dashboard/AgentDashboard'));
const AgentConversations = React.lazy(() => import('@/features/agent/pages/conversations/AgentConversations'));
const ConversationDetail = React.lazy(() => import('@/features/agent/pages/conversations/ConversationDetail'));
const VoiceCallScreen = React.lazy(() => import('@/features/agent/pages/conversations/VoiceCallScreen'));
const AgentProfilePage = React.lazy(() => import('@/features/agent/pages/profile/AgentProfilePage'));
const AgentAIChatPage = React.lazy(() => import('@/features/agent/pages/ai-chat/AgentAIChatPage'));

// Super Admin Pages
const AdminDashboard = React.lazy(() => import('@/features/admin/pages/AdminDashboard'));
const AdminUsers = React.lazy(() => import('@/features/admin/pages/AdminUsers'));
const AdminAnalytics = React.lazy(() => import('@/features/admin/pages/AdminAnalytics'));
const AdminSystem = React.lazy(() => import('@/features/admin/pages/AdminSystem'));
const AdminSettings = React.lazy(() => import('@/features/admin/pages/AdminSettings'));
const TenantsPage = React.lazy(() => import('@/features/super-admin/pages/TenantsPage'));
const TenantDetailPage = React.lazy(() => import('@/features/super-admin/pages/TenantDetailPage'));
const FinancialReportsPage = React.lazy(() => import('@/features/super-admin/pages/FinancialReportsPage'));

// Agent Layout
import AgentLayout from '@/features/agent/components/layout/AgentLayout';

// Admin Layout
import AdminLayout from '@/features/admin/components/layout/AdminLayout';

// Loading component for initial app bootstrap
const PageLoadingSpinner = () => <FullPageLoader variant="dots" size="xl" color="primary" />;

function App() {
  logger.debug('App rendering');
  const { isLoading, initializeAuth } = useAuthStore();

  // Initialize WebSocket for real-time notifications
  useWebSocket();

  useEffect(() => {
    logger.info('Initializing auth');
    initializeAuth();
  }, []); // Sadece mount'ta bir kere çalışsın

  // Setup global error handlers
  useEffect(() => {
    setupGlobalErrorHandlers();
    logger.info('Global error handlers initialized');
  }, []);

  // Dark mode'u localStorage'dan yükle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedCustomization = localStorage.getItem('customization');
    
    if (savedCustomization) {
      try {
        const parsed = JSON.parse(savedCustomization);
        if (parsed.theme === 'dark') {
          document.documentElement.classList.add('dark');
          logger.debug('Dark mode loaded from customization');
        }
        if (parsed.accentColor) {
          document.documentElement.style.setProperty('--accent-color', parsed.accentColor);
        }
        if (parsed.language) {
          document.documentElement.setAttribute('lang', parsed.language);
        }
      } catch (error) {
        logger.error('Failed to load customization', error as Error);
      }
    } else if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      logger.debug('Dark mode loaded from theme');
    }
  }, []);

  logger.debug('App state', { isLoading });

  if (isLoading) {
    logger.debug('Showing loading spinner');
    return <PageLoadingSpinner />;
  }

  logger.debug('Rendering main app');

  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <QueryClientProvider client={queryClient}>
        {/* Web Vitals Monitoring (Production only) */}
        <WebVitalsMonitor enabled={import.meta.env.PROD} />
        
        <div className="App">
      <BusinessProvider defaultBusinessType="dental_clinic">
        <DemoGuard>
          <Routes>
            <Route
              path="/demo-login"
              element={
                <Suspense fallback={<FullPageLoader variant="dots" />}>
                  <DemoLoginPage />
                </Suspense>
              }
            />
            {/* Public routes - Firma Sahibi */}
            <Route
              path="/admin/login"
              element={
                <PublicRoute>
                  <Suspense fallback={<FullPageLoader variant="dots" />}>
                    <LoginPage />
                  </Suspense>
                </PublicRoute>
              }
            />
            <Route
              path="/admin/forgot-password"
              element={
                <PublicRoute>
                  <Suspense fallback={<FullPageLoader variant="dots" />}>
                    <ForgotPasswordPage />
                  </Suspense>
                </PublicRoute>
              }
            />

            {/* Public routes - AsistanApp Super Admin */}
            <Route
              path="/asistansuper/login"
              element={
                <PublicRoute>
                  <Suspense fallback={<FullPageLoader variant="dots" />}>
                    <AdminLoginPage />
                  </Suspense>
                </PublicRoute>
              }
            />
            <Route
              path="/asistansuper/forgot-password"
              element={
                <PublicRoute>
                  <Suspense fallback={<FullPageLoader variant="dots" />}>
                    <AdminForgotPasswordPage />
                  </Suspense>
                </PublicRoute>
              }
            />

            {/* Public routes - Agent Dashboard */}
            <Route
              path="/agent/login"
              element={
                <PublicRoute>
                  <Suspense fallback={<FullPageLoader variant="dots" />}>
                    <AgentLoginPage />
                  </Suspense>
                </PublicRoute>
              }
            />
            <Route
              path="/agent/forgot-password"
              element={
                <PublicRoute>
                  <Suspense fallback={<FullPageLoader variant="dots" />}>
                    <AgentForgotPasswordPage />
                  </Suspense>
                </PublicRoute>
              }
            />

            {/* Protected routes - Dashboard */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<DashboardLoadingState />}>
                      <DashboardPage />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Conversations */}
            <Route
              path="/admin/conversations"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<ConversationsLoadingState />}>
                      <ConversationsPage />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Reports */}
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<TableLoadingState />}>
                      <ReportsPage />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Settings */}
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<SettingsLoadingState />}>
                      <SettingsPage />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected routes - Team */}
                      <Route 
              path="/admin/team"
                        element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<TableLoadingState />}>
                      <TeamPage />
                    </Suspense>
                  </MainLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
              path="/admin/team/chat"
                        element={
                <ProtectedRoute>
                  <Suspense fallback={<TeamChatLoadingState />}>
                    <TeamChatPage />
                  </Suspense>
                          </ProtectedRoute>
                        } 
                      />

            {/* Protected routes - Help */}
                      <Route 
              path="/admin/help"
                        element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suspense fallback={<GenericPageLoadingState />}>
                      <HelpPage />
                    </Suspense>
                  </MainLayout>
                          </ProtectedRoute>
                        } 
                      />

            {/* Super Admin Panel Routes */}
            <Route
              path="/asistansuper/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Suspense fallback={<DashboardLoadingState />}>
                      <AdminDashboard />
                    </Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/asistansuper/tenants"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Suspense fallback={<TableLoadingState />}>
                      <TenantsPage />
                    </Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/asistansuper/tenants/:tenantId"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Suspense fallback={<GenericPageLoadingState />}>
                      <TenantDetailPage />
                    </Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/asistansuper/financial-reports"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Suspense fallback={<DashboardLoadingState />}>
                      <FinancialReportsPage />
                    </Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/asistansuper/users"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Suspense fallback={<TableLoadingState />}>
                      <AdminUsers />
                    </Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/asistansuper/analytics"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Suspense fallback={<DashboardLoadingState />}>
                      <AdminAnalytics />
                    </Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/asistansuper/system"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Suspense fallback={<GenericPageLoadingState />}>
                      <AdminSystem />
                    </Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/asistansuper/settings"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Suspense fallback={<SettingsLoadingState />}>
                      <AdminSettings />
                    </Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Agent Panel Routes */}
            <Route
              path="/agent/dashboard"
              element={
                <ProtectedRoute>
                  <AgentLayout>
                    <Suspense fallback={<DashboardLoadingState />}>
                      <AgentDashboard />
                    </Suspense>
                  </AgentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/conversations"
              element={
                <ProtectedRoute>
                  <AgentLayout>
                    <Suspense fallback={<ConversationsLoadingState />}>
                      <AgentConversations />
                    </Suspense>
                  </AgentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/conversations/:id"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<ConversationsLoadingState />}>
                    <ConversationDetail />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/voice-call/:id"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<GenericPageLoadingState />}>
                    <VoiceCallScreen />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/profile"
              element={
                <ProtectedRoute>
                  <AgentLayout>
                    <Suspense fallback={<ProfileLoadingState />}>
                      <AgentProfilePage />
                    </Suspense>
                  </AgentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/ai-chat"
              element={
                <ProtectedRoute>
                  <AgentLayout>
                    <Suspense fallback={<ConversationsLoadingState />}>
                      <AgentAIChatPage />
                    </Suspense>
                  </AgentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent/team/chat"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<TeamChatLoadingState />}>
                    <TeamChatPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* Root - Panel Selector */}
            <Route
              path="/"
              element={
                <Suspense fallback={<FullPageLoader variant="dots" />}>
                  <PanelSelector />
                </Suspense>
              }
            />

            {/* Error Pages */}
            <Route
              path="/error/500"
              element={
                <Suspense fallback={<FullPageLoader variant="dots" />}>
                  <ServerErrorPage />
                </Suspense>
              }
            />

            {/* 404 - Catch all */}
            <Route
              path="*"
              element={
                <Suspense fallback={<FullPageLoader variant="dots" />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Routes>
        </DemoGuard>
      </BusinessProvider>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'dark:bg-slate-800 dark:text-gray-100',
          style: {
            padding: '16px',
            borderRadius: '12px',
          },
          success: {
            className: 'dark:bg-slate-800 dark:text-gray-100',
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            className: 'dark:bg-slate-800 dark:text-gray-100',
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
