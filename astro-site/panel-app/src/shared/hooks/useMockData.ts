/* =========================================
   AsistanApp - Enhanced Mock Data Hook
   Dashboard için 660 müşteri verisi yönetimi - Refactored
========================================= */

import { useState, useEffect } from 'react';
import { logger } from '@/shared/utils/logger';
import { useBusiness } from '@/contexts/BusinessContext';
import { BusinessType, businessTypeConfigs } from '@/shared/config/business-types';
import {
  MockCustomer,
  generateMockData,
  calculateDashboardStats,
  saveMockDataToStorage,
  loadMockDataFromStorage
} from '@/data/mock-data-generator';

interface DashboardStats {
  activeConversations: number;
  totalMessages: number;
  totalRevenue: number;
  vipCustomers: number;
  channelStats: {
    whatsapp: number;
    instagram: number;
    web: number;
    phone: number;
  };
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalCustomers: number;
}

// Helper function to convert array to sector-based record
const convertArrayToSectorRecord = (customers: MockCustomer[]): Record<BusinessType, MockCustomer[]> => {
  const record = {} as Record<BusinessType, MockCustomer[]>;
  
  // Initialize all sectors
  Object.keys(businessTypeConfigs).forEach(sectorKey => {
    const sector = sectorKey as BusinessType;
    record[sector] = [];
  });
  
  // Group customers by sector (extracted from customer.id)
  customers.forEach(customer => {
    const sectorMatch = customer.id.match(/^([^_]+)_/);
    if (sectorMatch) {
      const sector = sectorMatch[1] as BusinessType;
      if (record[sector]) {
        record[sector].push(customer);
      }
    }
  });
  
  return record;
};

export const useMockData = () => {
  const { businessType, isLoading: businessLoading } = useBusiness();
  const [allMockData, setAllMockData] = useState<Record<BusinessType, MockCustomer[]>>({} as Record<BusinessType, MockCustomer[]>);
  const [sectorCustomers, setSectorCustomers] = useState<MockCustomer[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeConversations: 0,
    totalMessages: 0,
    totalRevenue: 0,
    vipCustomers: 0,
    channelStats: { whatsapp: 0, instagram: 0, web: 0, phone: 0 },
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
    totalCustomers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize mock data once
  useEffect(() => {
    const initializeMockData = async () => {
      try {
        logger.debug('🔄 Initializing mock data...');
        setIsLoading(true);
        
        // Try to load from localStorage first
        const loadedData = loadMockDataFromStorage();
        
        let sectorData: Record<BusinessType, MockCustomer[]>;
        
        if (!loadedData || (Array.isArray(loadedData) && loadedData.length === 0)) {
          logger.debug('📦 Generating new mock data for all sectors...');
          const generatedData = generateMockData();
          sectorData = convertArrayToSectorRecord(generatedData);
          saveMockDataToStorage(generatedData);
        } else {
          logger.debug('✅ Loaded existing mock data from storage');
          // Convert array to record if needed
          if (Array.isArray(loadedData)) {
            sectorData = convertArrayToSectorRecord(loadedData);
          } else {
            // Already in record format
            sectorData = loadedData as Record<BusinessType, MockCustomer[]>;
          }
        }
        
        setAllMockData(sectorData);
        
      } catch (error) {
        logger.error('❌ Error initializing mock data:', error);
        // Fallback to generating new data
        const fallbackData = generateMockData();
        setAllMockData(convertArrayToSectorRecord(fallbackData));
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only initialize once
    if (Object.keys(allMockData).length === 0) {
      initializeMockData();
    }
   
  // TODO: Missing allMockData dependency
  }, []);
  
  // Update sector-specific data when business type changes
  useEffect(() => {
    if (!businessLoading && !isLoading && allMockData[businessType]) {
      logger.debug('🏢 Updating sector data for:', { businessType });
      
      try {
        const customers = allMockData[businessType] || [];
        setSectorCustomers(customers);
        
        const stats = calculateDashboardStats(customers);
        setDashboardStats(stats);
        
        logger.debug('✅ Sector data updated:', {
          customers: customers.length,
          totalRevenue: stats.totalRevenue
        });
        
      } catch (error) {
        logger.error('❌ Error updating sector data:', error);
      }
    }
  }, [businessType, allMockData, businessLoading, isLoading]);
  
  // Regenerate all mock data
  const regenerateMockData = () => {
    logger.debug('🔄 Regenerating all mock data...');
    setIsLoading(true);
    
    try {
      const newDataArray = generateMockData();
      const newData = convertArrayToSectorRecord(newDataArray);
      setAllMockData(newData);
      saveMockDataToStorage(newDataArray);
      
      // Update current sector data
      const customers = newData[businessType] || [];
      setSectorCustomers(customers);
      setDashboardStats(calculateDashboardStats(customers));
      
      logger.debug('✅ Mock data regenerated successfully');
      
    } catch (error) {
      logger.error('❌ Error regenerating mock data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update specific customer
  const updateCustomer = (customerId: string, updates: Partial<MockCustomer>) => {
    try {
      const updatedData = { ...allMockData };
      
      // Find and update customer in the appropriate sector
      Object.keys(updatedData).forEach((sector) => {
        const customers = updatedData[sector as BusinessType];
        const customerIndex = customers.findIndex(c => c.id === customerId);
        
        if (customerIndex !== -1) {
          customers[customerIndex] = { ...customers[customerIndex], ...updates };
        }
      });
      
      setAllMockData(updatedData);
      
      // Convert back to array for storage
      const dataArray: MockCustomer[] = [];
      Object.values(updatedData).forEach(customers => {
        dataArray.push(...customers);
      });
      saveMockDataToStorage(dataArray);
      
      // Update current sector if affected
      if (updatedData[businessType]) {
        const customers = updatedData[businessType] || [];
        setSectorCustomers(customers);
        setDashboardStats(calculateDashboardStats(customers));
      }
      
      logger.debug('✅ Customer updated:', { customerId });
      
    } catch (error) {
      logger.error('❌ Error updating customer:', error);
    }
  };
  
  // Add new customer to current sector
  const addCustomer = (customer: Omit<MockCustomer, 'id'>) => {
    try {
      const newCustomer: MockCustomer = {
        ...customer,
        id: `${businessType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      const updatedData = { ...allMockData };
      if (!updatedData[businessType]) {
        updatedData[businessType] = [];
      }
      
      updatedData[businessType].push(newCustomer);
      
      setAllMockData(updatedData);
      
      // Convert back to array for storage
      const dataArray: MockCustomer[] = [];
      Object.values(updatedData).forEach(customers => {
        dataArray.push(...customers);
      });
      saveMockDataToStorage(dataArray);
      
      // Update current sector data
      const customers = updatedData[businessType] || [];
      setSectorCustomers(customers);
      setDashboardStats(calculateDashboardStats(customers));
      
      logger.debug('✅ Customer added to', { businessType });
      
      return newCustomer;
      
    } catch (error) {
      logger.error('❌ Error adding customer:', error);
      return null;
    }
  };
  
  // Get customers by time category
  const getCustomersByTimeCategory = (category: 'today' | 'week' | 'month' | 'year') => {
    return sectorCustomers.filter(customer => customer.timeCategory === category);
  };
  
  // Get top customers by revenue
  const getTopCustomers = (limit: number = 5) => {
    return [...sectorCustomers]
      .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
      .slice(0, limit);
  };
  
  return {
    // Data
    sectorCustomers,
    dashboardStats,
    allMockData,
    
    // State
    isLoading: isLoading || businessLoading,
    
    // Actions
    regenerateMockData,
    updateCustomer,
    addCustomer,
    
    // Helpers
    getCustomersByTimeCategory,
    getTopCustomers
  };
};