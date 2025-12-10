export interface TenantSubscription {
  plan: 'starter' | 'professional' | 'enterprise' | 'custom';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  startDate: string;
  renewalDate: string;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  currency: string;
}

export interface Tenant {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  subscription: TenantSubscription;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  stats: {
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: number;
    activeAgents: number;
  };
  createdAt: string;
  lastActivity: string;
  health: 'excellent' | 'good' | 'fair' | 'poor';
}

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-001',
    companyName: 'TechVista E-Ticaret',
    domain: 'techvista.asistanapp.com.tr',
    industry: 'E-Ticaret - Elektronik',
    companySize: 'medium',
    subscription: {
      plan: 'professional',
      status: 'active',
      startDate: '2024-06-15',
      renewalDate: '2025-12-15',
      billingCycle: 'yearly',
      price: 24999,
      currency: 'TRY'
    },
    contact: {
      name: 'Mehmet Yılmaz',
      email: 'mehmet@techvista.com',
      phone: '+905301234567'
    },
    stats: {
      totalCustomers: 12847,
      totalOrders: 28934,
      totalRevenue: 4567890,
      activeAgents: 12
    },
    createdAt: '2024-06-15T09:00:00Z',
    lastActivity: '2025-12-10T11:45:00Z',
    health: 'excellent'
  },
  {
    id: 'tenant-002',
    companyName: 'ModaGiyim Online',
    domain: 'modagiyim.asistanapp.com.tr',
    industry: 'E-Ticaret - Moda',
    companySize: 'small',
    subscription: {
      plan: 'starter',
      status: 'active',
      startDate: '2025-09-01',
      renewalDate: '2026-03-01',
      billingCycle: 'monthly',
      price: 1999,
      currency: 'TRY'
    },
    contact: {
      name: 'Ayşe Demir',
      email: 'ayse@modagiyim.com',
      phone: '+905312345678'
    },
    stats: {
      totalCustomers: 3456,
      totalOrders: 5678,
      totalRevenue: 892345,
      activeAgents: 3
    },
    createdAt: '2025-09-01T10:30:00Z',
    lastActivity: '2025-12-10T11:30:00Z',
    health: 'good'
  }
];

export const mockTenantStats = {
  totalTenants: 247,
  activeTenants: 234,
  trialTenants: 8,
  suspendedTenants: 5,
  planDistribution: {
    starter: 87,
    professional: 124,
    enterprise: 21,
    custom: 15
  },
  monthlyRecurringRevenue: 1247890,
  yearlyRecurringRevenue: 14974680
};
