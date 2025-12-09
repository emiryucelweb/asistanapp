 
/* =========================================
   AsistanApp - API Data Hook
   Progressive Mock-to-API Migration
   NOTE: Uses `any[]` for mock data arrays during migration phase
========================================= */

import { useState, useEffect } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { useMockData } from './useMockData';
import apiService from '@/services/api-service';
import { MockCustomer, DashboardStats } from '@/data/mock-data-generator';
import { logger } from '@/shared/utils/logger';

// Feature flags for progressive API migration
const FEATURE_FLAGS = {
  USE_API_DASHBOARD: true,  // ✅ ACTIVATED: Dashboard analytics API
  USE_API_CUSTOMERS: true,  // ✅ ACTIVATED: Customers/Leads API  
  USE_API_PRODUCTS: false,  // Toggle: Products API
  USE_API_ORDERS: false,    // Toggle: Orders API
  USE_API_APPOINTMENTS: false, // Toggle: Appointments API
  USE_API_CONVERSATIONS: false, // Toggle: Conversations API
} as const;

interface ApiDataState {
  dashboardStats: DashboardStats;
  sectorCustomers: MockCustomer[];
  products: any[];
  orders: any[];
  appointments: any[];
  conversations: any[];
  isLoading: boolean;
  error: string | null;
}

export const useApiData = () => {
  const { businessType } = useBusiness();
  
  // Fallback to mock data
  const mockData = useMockData();
  
  const [apiData, setApiData] = useState<ApiDataState>({
    dashboardStats: mockData.dashboardStats,
    sectorCustomers: mockData.sectorCustomers,
    products: [],
    orders: [],
    appointments: [],
    conversations: [],
    isLoading: false,
    error: null,
  });

  // Dashboard Analytics API Integration
  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    if (!FEATURE_FLAGS.USE_API_DASHBOARD) {
      return mockData.dashboardStats;
    }

    try {
      const response = await apiService.get('/analytics/overview');
      
      // Transform API response to DashboardStats format
      const data = (response.data as any) || {};
      return {
        activeConversations: data.conversationStats?.active || 0,
        totalMessages: data.conversationStats?.totalMessages || 0,
        totalRevenue: data.orderStats?.totalRevenue || 0,
        vipCustomers: data.leadStats?.vipCount || 0,
        channelStats: data.channelBreakdown || { whatsapp: 0, instagram: 0, web: 0, phone: 0 },
        todayCount: data.leadStats?.today || 0,
        weekCount: data.leadStats?.week || 0,
        monthCount: data.leadStats?.month || 0,
        totalCustomers: data.leadStats?.total || 0,
      };
    } catch (error) {
      logger.warn('Dashboard API failed, falling back to mock data', { error: error instanceof Error ? error.message : String(error) });
      return mockData.dashboardStats;
    }
  };

  // Customers/Leads API Integration  
  const fetchCustomers = async (): Promise<MockCustomer[]> => {
    if (!FEATURE_FLAGS.USE_API_CUSTOMERS) {
      return mockData.sectorCustomers;
    }

    try {
      const response = await apiService.get('/leads', {
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      // Transform API leads to MockCustomer format  
      const data = (response.data as any) || {};
      return data.leads?.map((lead: any) => ({
        id: lead.id,
        name: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        leadScore: lead.leadScore,
        source: lead.source,
        tags: lead.tags || [],
        sector: businessType,
        lastActivity: lead.lastActivityAt || lead.createdAt,
        totalSpent: lead.totalValue || 0,
        orderCount: lead.orderCount || 0,
        channel: lead.preferredChannel || 'web'
      })) || [];
    } catch (error) {
      logger.warn('Customers API failed, falling back to mock data', { error: error instanceof Error ? error.message : String(error) });
      return mockData.sectorCustomers;
    }
  };

  // Products API Integration
  const fetchProducts = async (): Promise<any[]> => {
    if (!FEATURE_FLAGS.USE_API_PRODUCTS) {
      return []; // No mock products in mockData, pages generate their own
    }

    try {
      const response = await apiService.get('/products', {
        limit: 50,
        status: 'active'
      });
      return (response.data as any)?.products || [];
    } catch (error) {
      logger.warn('Products API failed, falling back to empty array', { error: error instanceof Error ? error.message : String(error) });
      return [];
    }
  };

  // Orders API Integration
  const fetchOrders = async (): Promise<any[]> => {
    if (!FEATURE_FLAGS.USE_API_ORDERS) {
      return [];
    }

    try {
      const response = await apiService.get('/orders');
      return (response.data as any)?.orders || [];
    } catch (error) {
      logger.warn('Orders API failed, falling back to empty array', { error: error instanceof Error ? error.message : String(error) });
      return [];
    }
  };

  // Appointments API Integration
  const fetchAppointments = async (): Promise<any[]> => {
    if (!FEATURE_FLAGS.USE_API_APPOINTMENTS) {
      return [];
    }

    try {
      const response = await apiService.get('/appointments');
      return (response.data as any)?.appointments || [];
    } catch (error) {
      logger.warn('Appointments API failed, falling back to empty array', { error: error instanceof Error ? error.message : String(error) });
      return [];
    }
  };

  // Conversations API Integration
  const fetchConversations = async (): Promise<any[]> => {
    if (!FEATURE_FLAGS.USE_API_CONVERSATIONS) {
      return [];
    }

    try {
      const response = await apiService.get('/conversations', {
        limit: 50
      });
      return (response.data as any)?.conversations || [];
    } catch (error) {
      logger.warn('Conversations API failed, falling back to empty array', { error: error instanceof Error ? error.message : String(error) });
      return [];
    }
  };

  // Main data fetching effect
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      if (!isMounted) return;
      
      setApiData(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Fetch all data in parallel
        const [
          dashboardStats,
          customers,
          products,
          orders,
          appointments,
          conversations
        ] = await Promise.allSettled([
          fetchDashboardStats(),
          fetchCustomers(),
          fetchProducts(),
          fetchOrders(),
          fetchAppointments(),
          fetchConversations()
        ]);

        if (!isMounted) return;

        setApiData({
          dashboardStats: dashboardStats.status === 'fulfilled' ? dashboardStats.value : mockData.dashboardStats,
          sectorCustomers: customers.status === 'fulfilled' ? customers.value : mockData.sectorCustomers,
          products: products.status === 'fulfilled' ? products.value : [],
          orders: orders.status === 'fulfilled' ? orders.value : [],
          appointments: appointments.status === 'fulfilled' ? appointments.value : [],
          conversations: conversations.status === 'fulfilled' ? conversations.value : [],
          isLoading: false,
          error: null,
        });

        logger.debug('API Data loaded successfully');

      } catch (error) {
        logger.error('API Data loading failed', error as Error);
        
        if (!isMounted) return;
        
        // Complete fallback to mock data
        setApiData({
          dashboardStats: mockData.dashboardStats,
          sectorCustomers: mockData.sectorCustomers,
          products: [],
          orders: [],
          appointments: [],
          conversations: [],
          isLoading: false,
          error: 'API loading failed, using mock data',
        });
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
   
  // TODO: Missing fetch functions - circular dependency
  }, [businessType, mockData.dashboardStats, mockData.sectorCustomers]);

  // Return unified interface (same as useMockData + additional API data)
  return {
    // Core mock data compatibility
    dashboardStats: apiData.dashboardStats,
    sectorCustomers: apiData.sectorCustomers,
    isLoading: mockData.isLoading || apiData.isLoading,
    
    // Extended API data
    products: apiData.products,
    orders: apiData.orders,
    appointments: apiData.appointments,
    conversations: apiData.conversations,
    error: apiData.error,
    
    // Mock data methods for backward compatibility
    regenerateMockData: mockData.regenerateMockData,
    updateCustomer: mockData.updateCustomer,
    addCustomer: mockData.addCustomer,
    allMockData: mockData.allMockData,
    
    // Feature flag status for debugging
    featureFlags: FEATURE_FLAGS,
  };
};

// Export feature flags for external control
export { FEATURE_FLAGS };
export type { ApiDataState };
