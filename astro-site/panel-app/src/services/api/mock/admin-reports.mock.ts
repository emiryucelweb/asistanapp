/**
 * Mock Data for Admin Reports API
 * Used when API_CONFIG.USE_MOCK_DATA is true
 */

import { mockDelay } from '../config';
import { Target, MessageSquare, AlertCircle, CheckCircle, Clock, TrendingUp, Users, BarChart3, Zap } from 'lucide-react';
import React from 'react';

// ==================== AI REPORT DATA ====================

export const mockAIReportData = {
  intentBreakdown: [
    { name: 'Sipariş Takibi', accuracy: 94.2, count: 4850, icon: React.createElement(Target, { className: 'w-4 h-4' }) },
    { name: 'Ürün Sorguları', accuracy: 91.8, count: 3920, icon: React.createElement(MessageSquare, { className: 'w-4 h-4' }) },
    { name: 'Destek Talepleri', accuracy: 88.5, count: 2840, icon: React.createElement(AlertCircle, { className: 'w-4 h-4' }) },
    { name: 'Genel Bilgi', accuracy: 85.2, count: 1980, icon: React.createElement(CheckCircle, { className: 'w-4 h-4' }) },
    { name: 'Şikayet', accuracy: 79.8, count: 1250, icon: React.createElement(Clock, { className: 'w-4 h-4' }) },
  ],
  performanceTrend: [
    { period: 'Hafta 1', success: 82.1 },
    { period: 'Hafta 2', success: 84.3 },
    { period: 'Hafta 3', success: 86.2 },
    { period: 'Hafta 4', success: 87.5 },
  ],
};

// ==================== CHANNELS REPORT DATA ====================

export const mockChannelsReportData = {
  channelPerformance: [
    { name: 'WhatsApp', conversations: 5240, satisfaction: 4.7, avgResponseTime: '1.2dk' },
    { name: 'Instagram', conversations: 3180, satisfaction: 4.5, avgResponseTime: '1.8dk' },
    { name: 'Web', conversations: 2940, satisfaction: 4.6, avgResponseTime: '1.5dk' },
    { name: 'Telefon', conversations: 1098, satisfaction: 4.8, avgResponseTime: '0.8dk' },
  ],
  channelTrend: [
    { month: 'Oca', whatsapp: 4200, instagram: 2800, web: 2400, phone: 950 },
    { month: 'Şub', whatsapp: 4800, instagram: 3000, web: 2650, phone: 1020 },
    { month: 'Mar', whatsapp: 5240, instagram: 3180, web: 2940, phone: 1098 },
  ],
};

// ==================== SATISFACTION REPORT DATA ====================

export const mockSatisfactionReportData = {
  ratingDistribution: [
    { rating: 5, count: 6420, percentage: 51.5 },
    { rating: 4, count: 3980, percentage: 31.9 },
    { rating: 3, count: 1240, percentage: 9.9 },
    { rating: 2, count: 520, percentage: 4.2 },
    { rating: 1, count: 298, percentage: 2.4 },
  ],
  satisfactionTrend: [
    { month: 'Oca', score: 4.5 },
    { month: 'Şub', score: 4.6 },
    { month: 'Mar', score: 4.8 },
  ],
  feedbackCategories: [
    { category: 'Hızlı Yanıt', count: 2840, sentiment: 'positive' },
    { category: 'Çözüm Kalitesi', count: 2120, sentiment: 'positive' },
    { category: 'Gecikmeler', count: 680, sentiment: 'negative' },
    { category: 'Eksik Bilgi', count: 420, sentiment: 'negative' },
  ],
};

// ==================== TIME REPORT DATA ====================

export const mockTimeReportData = {
  hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    conversations: Math.floor(Math.random() * 500) + 100,
  })),
  avgResponseByDay: [
    { day: 'Pzt', avgTime: 1.2 },
    { day: 'Sal', avgTime: 1.4 },
    { day: 'Çar', avgTime: 1.3 },
    { day: 'Per', avgTime: 1.5 },
    { day: 'Cum', avgTime: 1.8 },
    { day: 'Cmt', avgTime: 2.1 },
    { day: 'Paz', avgTime: 2.4 },
  ],
  peakHours: [
    { hour: '14:00-15:00', volume: 842 },
    { hour: '10:00-11:00', volume: 756 },
    { hour: '15:00-16:00', volume: 698 },
  ],
};

// ==================== TEAM REPORT DATA ====================

export const mockTeamReportData = {
  agentPerformance: [
    { name: 'Ahmet Yılmaz', conversations: 284, satisfaction: 4.9, avgResponseTime: '0.9dk' },
    { name: 'Ayşe Demir', conversations: 268, satisfaction: 4.8, avgResponseTime: '1.1dk' },
    { name: 'Mehmet Kaya', conversations: 251, satisfaction: 4.7, avgResponseTime: '1.3dk' },
    { name: 'Fatma Şahin', conversations: 232, satisfaction: 4.6, avgResponseTime: '1.5dk' },
    { name: 'Ali Çelik', conversations: 198, satisfaction: 4.5, avgResponseTime: '1.7dk' },
  ],
  teamWorkload: [
    { agent: 'Ahmet Y.', assigned: 42, resolved: 38 },
    { agent: 'Ayşe D.', assigned: 38, resolved: 35 },
    { agent: 'Mehmet K.', assigned: 36, resolved: 32 },
    { agent: 'Fatma Ş.', assigned: 34, resolved: 31 },
    { agent: 'Ali Ç.', assigned: 28, resolved: 24 },
  ],
};

// ==================== MOCK API IMPLEMENTATIONS ====================

export const mockAdminReportsApi = {
  async getAIReport(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return mockAIReportData;
  },

  async getChannelsReport(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return mockChannelsReportData;
  },

  async getSatisfactionReport(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return mockSatisfactionReportData;
  },

  async getTimeReport(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return mockTimeReportData;
  },

  async getTeamReport(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return mockTeamReportData;
  },

  // Conversion, Financial, Trends, SLA raporları için de mocklar eklenebilir
  async getConversionReport(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return {
      conversionRate: 12.5,
      totalLeads: 3240,
      convertedLeads: 405,
      conversionTrend: [
        { month: 'Oca', rate: 11.2 },
        { month: 'Şub', rate: 11.8 },
        { month: 'Mar', rate: 12.5 },
      ],
    };
  },

  async getFinancialReport(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return {
      totalRevenue: 42500,
      costs: 15200,
      profit: 27300,
      profitMargin: 64.2,
      monthlyTrend: [
        { month: 'Oca', revenue: 38000, cost: 14000 },
        { month: 'Şub', revenue: 40200, cost: 14800 },
        { month: 'Mar', revenue: 42500, cost: 15200 },
      ],
    };
  },

  async getTrendsReport(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return {
      popularTopics: [
        { topic: 'Kargo Takibi', trend: '+18%', volume: 2840 },
        { topic: 'İade İşlemleri', trend: '+12%', volume: 1920 },
        { topic: 'Ürün Bilgisi', trend: '-5%', volume: 1540 },
      ],
      emergingIssues: [
        { issue: 'Teslimat Gecikmeleri', severity: 'high', count: 420 },
        { issue: 'Ödeme Sorunları', severity: 'medium', count: 280 },
      ],
    };
  },

  async getSLAReport(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return {
      slaCompliance: 92.5,
      firstResponseSLA: 94.2,
      resolutionSLA: 88.7,
      slaBreaches: [
        { date: '2024-03-15', type: 'Response', duration: '8.2dk', target: '5dk' },
        { date: '2024-03-12', type: 'Resolution', duration: '4.5s', target: '4s' },
      ],
    };
  },
};

