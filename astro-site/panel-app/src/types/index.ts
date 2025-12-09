 
// NOTE: This file intentionally uses `any` for:
// - Dynamic AI tool responses & payloads (ToolCall, LLMResponse)
// - Generic form data & filter values (FormData, Filter)
// - WebSocket message types (WebSocketMessage)
// - Extension/plugin metadata (UIComponent, Action, HandoffRequest, IntegrationConfig)
// - Leads (structure not yet defined)
// All `any` types are documented & necessary for framework flexibility

// API Response Types
// Generic default olarak 'unknown' kullanarak tip güvenliği sağlanır
// Kullanım: ApiResponse<User>, ApiResponse<Product>, etc.
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

// Error detayları farklı kaynaklardan farklı yapılarda gelebilir
// (validation errors, database errors, external API errors, etc.)
// Merkezi error handler'da işlenmesi önerilir
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>; // Error detayları dynamic structure'da olabilir // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Authentication Types
export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  mfaEnabled: boolean;
  agentId?: string; // Agent ID if user is an agent
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  timezone: string;
  language: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: 'default' | 'compact' | 'detailed';
    widgets: string[];
  };
}

export type UserRole = 'owner' | 'admin' | 'manager' | 'agent' | 'viewer';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  mfaCode?: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantName: string;
}

// Tenant Types
export interface Tenant {
  id: string;
  name: string;
  apiKey: string;
  dataResidency: 'eu' | 'us' | 'tr';
  createdAt: string;
  updatedAt: string;
  settings: TenantSettings;
  subscription?: TenantSubscription;
}

export interface TenantSettings {
  timezone: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  businessHours: BusinessHours;
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  features: {
    voiceEnabled: boolean;
    multiChannel: boolean;
    analytics: boolean;
    customIntegrations: boolean;
  };
}

export interface BusinessHours {
  [key: string]: {
    isOpen: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
  };
}

export interface TenantSubscription {
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  limits: {
    conversations: number;
    users: number;
    storage: number; // in GB
    apiCalls: number;
  };
  usage: {
    conversations: number;
    users: number;
    storage: number;
    apiCalls: number;
  };
}

// Billing & Financial Types
export interface TenantBilling {
  tenantId: string;
  tenantName: string;
  subscription: TenantSubscription;
  monthlyRevenue: number;
  totalRevenue: number;
  apiCosts: APIUsageCosts;
  profitMargin: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  lastPaymentDate?: string;
  nextBillingDate: string;
  billingEmail: string;
  billingAddress?: BillingAddress;
}

export interface APIUsageCosts {
  llm: {
    provider: 'openai' | 'anthropic' | 'google' | 'azure';
    totalCalls: number;
    totalTokens: number;
    totalCost: number;
    breakdown: {
      gpt4: { calls: number; tokens: number; cost: number };
      gpt35: { calls: number; tokens: number; cost: number };
      embedding: { calls: number; tokens: number; cost: number };
    };
  };
  voice: {
    provider: 'elevenlabs' | 'azure' | 'google';
    totalMinutes: number;
    totalCost: number;
  };
  whatsapp: {
    totalMessages: number;
    totalCost: number;
  };
  storage: {
    totalGB: number;
    totalCost: number;
  };
  other: {
    description: string;
    totalCost: number;
  }[];
  totalMonthlyCost: number;
}

export interface BillingAddress {
  company: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId?: string;
}

export interface TenantFinancialSummary {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  totalMonthlyRevenue: number;
  totalMonthlyCosts: number;
  totalProfit: number;
  averageRevenuePerTenant: number;
  churnRate: number;
  growthRate: number;
}

export interface TenantUsageMetrics {
  tenantId: string;
  period: {
    start: string;
    end: string;
  };
  conversations: {
    total: number;
    byChannel: Record<Channel, number>;
    avgDuration: number;
  };
  messages: {
    total: number;
    aiGenerated: number;
    agentHandled: number;
  };
  apiCalls: {
    total: number;
    byEndpoint: Record<string, number>;
  };
  storage: {
    totalGB: number;
    files: number;
    media: number;
  };
  activeUsers: number;
}

// Conversation Types
export interface Conversation {
  id: string;
  tenantId: string;
  channel: Channel;
  channelUserId: string;
  status: ConversationStatus;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedBy?: string; // Who assigned it (system/owner)
  assignmentType?: AssignmentType; // How it was assigned
  queuePosition?: number; // Position in queue if waiting (1st, 2nd, 3rd conversation)
  waitingSince?: string; // When it entered waiting queue
  tags: string[];
  priority: ConversationPriority;
  metadata: ConversationMetadata;
  customer?: Customer;
  messages?: Message[];
  summary?: ConversationSummary;
}

export type Channel = 'whatsapp' | 'instagram' | 'facebook' | 'twitter' | 'web' | 'voice';
export type ConversationStatus = 'open' | 'waiting' | 'assigned' | 'resolved' | 'closed' | 'escalated';
export type ConversationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type AssignmentType = 'auto' | 'manual' | 'owner';

export interface ConversationMetadata {
  source: string;
  referrer?: string;
  userAgent?: string;
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
  deviceInfo?: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
}

export interface ConversationSummary {
  intent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  resolution: string;
  satisfaction?: number;
  duration: number; // in seconds
  messageCount: number;
  handoffReason?: string;
}

// Message Types
export interface Message {
  id: string;
  tenantId: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  channel: Channel;
  messageType: MessageType;
  metadata: MessageMetadata;
  isRead: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
  intent?: string;
  toolCalls?: ToolCall[];
  llmResponse?: LLMResponse;
  error?: string;
  cost?: number;
  latency?: number;
  tokenUsage?: TokenUsage;
  rerankScore?: number;
  usedContext?: string[];
  feedback?: MessageFeedback;
  isPartOfSequence: boolean;
}

export type MessageSender = 'user' | 'assistant' | 'agent' | 'system';
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'file' | 'location' | 'contact' | 'sticker';

export interface MessageMetadata {
  originalFormat?: string;
  mediaUrl?: string;
  mediaType?: string;
  fileSize?: number;
  duration?: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  contact?: {
    name: string;
    phone: string;
    email?: string;
  };
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>; // Her tool farklı argümanlar alır // eslint-disable-line @typescript-eslint/no-explicit-any
  result?: any; // Tool sonuçları tamamen dynamic // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: string;
  latency?: number;
}

export interface LLMResponse {
  reply: string;
  ui?: UIComponent[];
  actions?: Action[];
  nextState?: string;
  handoff?: HandoffRequest;
  usedContext: string[];
  meta: {
    model: string;
    temperature: number;
    maxTokens: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

export interface MessageFeedback {
  helpful: boolean;
  rating?: number;
  comment?: string;
  timestamp: string;
}

// UI Component Types
export interface UIComponent {
  type: 'card' | 'carousel' | 'button' | 'list' | 'form' | 'chart';
  id: string;
  props: Record<string, any>; // Her component farklı props alır // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Action {
  type: 'url' | 'phone' | 'email' | 'postback' | 'share' | 'location';
  label: string;
  value: string;
  metadata?: Record<string, any>; // Farklı action tipleri farklı metadata taşır // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface HandoffRequest {
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  context: string;
  suggestedAgent?: string;
  metadata?: Record<string, any>; // Farklı handoff senaryoları farklı metadata taşır // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Customer Types
export interface Customer {
  id: string;
  tenantId: string;
  channels: CustomerChannel[];
  profile: CustomerProfile;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: CustomerNote[];
  orders?: Order[];
  appointments?: Appointment[];
  leads?: any[]; // Lead structure henüz tanımlanmadı, esnek bırakalım // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface CustomerChannel {
  channel: Channel;
  userId: string;
  username?: string;
  isVerified: boolean;
  addedAt: string;
}

export interface CustomerProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  language: string;
  timezone: string;
  location?: {
    country: string;
    city: string;
    address?: string;
  };
  preferences: {
    communication: Channel[];
    notifications: boolean;
    marketing: boolean;
  };
}

export interface CustomerNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  isPrivate: boolean;
}

// Product Types
export interface Product {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategory;
  images: string[];
  attributes: ProductAttribute[];
  status: 'active' | 'inactive' | 'out_of_stock';
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'select';
}

// Order Types
export interface Order {
  id: string;
  tenantId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentInfo?: PaymentInfo;
  shippingInfo?: ShippingInfo;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku: string;
}

export interface PaymentInfo {
  method: 'card' | 'bank_transfer' | 'crypto' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: string;
}

export interface ShippingInfo {
  address: Address;
  method: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  tenantId: string;
  customerId: string;
  serviceId: string;
  slotId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  metadata: AppointmentMetadata;
  createdAt: string;
  updatedAt: string;
  service?: Service;
  customer?: Customer;
  notes?: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface AppointmentMetadata {
  reminderSent: boolean;
  confirmationSent: boolean;
  location?: string;
  meetingLink?: string;
  specialRequests?: string;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  metadata: ServiceMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceMetadata {
  category: string;
  location?: string;
  staff?: string[];
  requirements?: string[];
  cancellationPolicy?: string;
}

export interface TimeSlot {
  id: string;
  tenantId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  metadata: SlotMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface SlotMetadata {
  staff?: string;
  location?: string;
  maxBookings: number;
  currentBookings: number;
}

// Analytics Types
export interface AnalyticsData {
  overview: OverviewMetrics;
  conversations: ConversationAnalytics;
  performance: PerformanceMetrics;
  revenue: RevenueMetrics;
  channels: ChannelMetrics;
  agents: AgentMetrics;
  timeRange: {
    start: string;
    end: string;
    period: 'hour' | 'day' | 'week' | 'month' | 'year';
  };
}

export interface OverviewMetrics {
  totalConversations: number;
  activeConversations: number;
  resolvedConversations: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  handoffRate: number;
}

export interface ConversationAnalytics {
  byChannel: Record<Channel, number>;
  byStatus: Record<ConversationStatus, number>;
  byHour: Array<{ hour: number; count: number }>;
  byDay: Array<{ date: string; count: number }>;
  averageDuration: number;
  resolutionRate: number;
}

export interface PerformanceMetrics {
  avgResponseTime: number;
  avgResolutionTime: number;
  firstContactResolution: number;
  ragHitRate: number;
  schemaMismatchRate: number;
  errorRate: number;
  uptime: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  revenueByChannel: Record<Channel, number>;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    revenue: number;
    quantity: number;
  }>;
}

export interface ChannelMetrics {
  [key: string]: {
    conversations: number;
    responseTime: number;
    satisfaction: number;
    revenue: number;
  };
}

export interface AgentMetrics {
  [key: string]: {
    conversations: number;
    avgResponseTime: number;
    satisfaction: number;
    resolutionRate: number;
    onlineTime: number;
  };
}

// SMM (Social Media Management) Types
export interface SMMTask {
  id: string;
  tenantId: string;
  platform: SocialPlatform;
  taskType: SMMTaskType;
  content: SMMContent;
  scheduledAt: string;
  status: SMMTaskStatus;
  result?: SMMResult;
  createdAt: string;
  updatedAt: string;
}

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
export type SMMTaskType = 'post' | 'story' | 'comment' | 'message' | 'engagement';
export type SMMTaskStatus = 'pending' | 'scheduled' | 'published' | 'failed' | 'cancelled';

export interface SMMContent {
  text?: string;
  media?: SMMMedia[];
  hashtags?: string[];
  mentions?: string[];
  location?: string;
}

export interface SMMMedia {
  type: 'image' | 'video' | 'carousel';
  url: string;
  alt?: string;
  caption?: string;
}

export interface SMMResult {
  postId?: string;
  url?: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  error?: string;
}

// Recommendation Types
export interface Recommendation {
  id: string;
  tenantId: string;
  customerId: string;
  type: RecommendationType;
  itemId: string;
  score: number;
  metadata: RecommendationMetadata;
  createdAt: string;
  updatedAt: string;
}

export type RecommendationType = 'product' | 'service' | 'content' | 'action';

export interface RecommendationMetadata {
  reason: string;
  context: Record<string, any>; // Farklı öneri tipleri farklı context bilgisi taşır
  expiresAt?: string;
  priority: number;
}

// Integration Types
export interface Integration {
  id: string;
  tenantId: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  config: IntegrationConfig;
  createdAt: string;
  updatedAt: string;
  lastSync?: string;
}

export type IntegrationType = 'crm' | 'payment' | 'calendar' | 'email' | 'sms' | 'analytics' | 'custom';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export interface IntegrationConfig {
  apiKey?: string;
  webhookUrl?: string;
  settings: Record<string, any>; // Her entegrasyon farklı ayarlar gerektirir // eslint-disable-line @typescript-eslint/no-explicit-any
  mapping?: Record<string, string>;
}

// Form Types
export interface FormData {
  [key: string]: any; // Form alanları dinamik tipte olabilir (string, number, boolean, File, etc.)
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'date' | 'datetime';
  placeholder?: string;
  required?: boolean;
  validation?: FormValidation;
  options?: FormOption[];
  dependency?: FormDependency;
}

export interface FormValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormDependency {
  field: string;
  value: any; // Dependency değeri herhangi bir tip olabilir // eslint-disable-line @typescript-eslint/no-explicit-any
  condition: 'equals' | 'not_equals' | 'contains' | 'not_contains';
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: NavigationItem[];
  badge?: string | number;
  permissions?: UserRole[];
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>; // Farklı bildirim tipleri farklı metadata taşır
}

export interface NotificationAction {
  label: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger';
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  data: any; // WebSocket mesajları çeşitli veri tipleri taşıyabilir // eslint-disable-line @typescript-eslint/no-explicit-any
  timestamp: string;
}

// Filter and Search Types
export interface Filter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  value: any; // Filtre değeri her tip olabilir (string, number, date, etc.) // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}

export interface SearchConfig {
  query: string;
  fields: string[];
  filters: Filter[];
  sort: SortConfig;
  pagination: PaginationConfig;
}

// Team Chat Types (Internal Communication - Slack-like)
export interface TeamChannel {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: TeamChannelMember[];
  lastMessage?: TeamChatMessage;
  unreadCount: number;
  isPinned: boolean;
  metadata: {
    topic?: string;
    purpose?: string;
    avatar?: string;
  };
}

export interface TeamChannelMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  lastReadAt?: string;
  isMuted: boolean;
  notificationPreference: 'all' | 'mentions' | 'none';
}

export interface TeamChatMessage {
  id: string;
  channelId: string;
  tenantId: string;
  userId: string;
  content: string;
  timestamp: string;
  editedAt?: string;
  deletedAt?: string;
  type: 'text' | 'file' | 'image' | 'video' | 'audio' | 'note' | 'system';
  mentions: string[]; // User IDs
  reactions: TeamReaction[];
  attachments: TeamAttachment[];
  threadId?: string; // If part of a thread
  threadRepliesCount?: number;
  isPinned: boolean;
  metadata: {
    isEdited: boolean;
    isForwarded: boolean;
    forwardedFrom?: string;
  };
}

export interface TeamReaction {
  emoji: string;
  userId: string;
  timestamp: string;
}

export interface TeamAttachment {
  id: string;
  type: 'file' | 'image' | 'video' | 'audio' | 'document';
  name: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
  };
}

export interface TeamThread {
  id: string;
  channelId: string;
  parentMessageId: string;
  tenantId: string;
  messages: TeamChatMessage[];
  participants: string[]; // User IDs
  lastActivityAt: string;
  isActive: boolean;
}

export interface TeamNote {
  id: string;
  tenantId: string;
  channelId?: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPrivate: boolean;
  sharedWith: string[]; // User IDs
  attachments: TeamAttachment[];
}

export interface TeamChatNotification {
  id: string;
  userId: string;
  channelId: string;
  messageId: string;
  type: 'mention' | 'reply' | 'channel_message' | 'direct_message';
  isRead: boolean;
  timestamp: string;
}

export interface TeamPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  statusMessage?: string;
  lastSeenAt: string;
  isTyping: boolean;
  typingIn?: string; // Channel ID
}

// Voice Call Types (WebRTC-based calls through server)
export interface VoiceCall {
  id: string;
  tenantId: string;
  conversationId?: string; // Optional conversation link
  callType: 'inbound' | 'outbound' | 'internal';
  status: CallStatus;
  caller: CallParticipant;
  callee: CallParticipant;
  startedAt?: string;
  endedAt?: string;
  duration?: number; // seconds
  recording?: CallRecording;
  transferHistory?: CallTransfer[];
  aiHandling?: AICallHandling; // AI konuşma durumu
  metadata: {
    queue?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    tags?: string[];
    notes?: string;
  };
}

export interface AICallHandling {
  isHandledByAI: boolean; // AI mi yönetiyor
  aiStartedAt?: string; // AI ne zaman başladı
  aiEndedAt?: string; // AI ne zaman bıraktı
  aiDuration?: number; // AI kaç saniye konuştu
  aiStuckReason?: string; // AI neden tıkandı
  aiTranscript?: AITranscript[]; // AI konuşma metni
  aiSummary?: AICallSummary; // Asistan özeti (agent'a gösterilecek)
  escalationTrigger?: 'customer_request' | 'ai_stuck' | 'complex_query' | 'emotional' | 'technical' | 'manual';
  escalatedAt?: string;
  confidenceScore?: number; // Asistan'ın başarma güveni (0-100)
}

export type CallStatus = 
  | 'ringing'         // Arama çalıyor
  | 'connecting'      // Bağlanıyor
  | 'connected'       // Görüşme devam ediyor
  | 'on_hold'         // Beklemede
  | 'transferring'    // Transfer ediliyor
  | 'ended'           // Sonlandı
  | 'missed'          // Cevapsız
  | 'rejected'        // Reddedildi
  | 'failed';         // Başarısız

export interface CallParticipant {
  id: string;
  name: string;
  phoneNumber?: string;
  avatar?: string;
  role: 'customer' | 'agent' | 'owner';
  userId?: string;
  tenantId?: string;
}

export interface CallRecording {
  id: string;
  url: string;
  duration: number;
  size: number;
  format: 'mp3' | 'wav' | 'ogg';
  transcription?: string;
  startedAt: string;
  endedAt: string;
}

export interface CallTransfer {
  id: string;
  fromUser: string;
  toUser: string;
  reason?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

export interface CallMediaState {
  audio: {
    muted: boolean;
    volume: number;
    inputDevice?: string;
    outputDevice?: string;
  };
  recording: {
    isRecording: boolean;
    startTime?: string;
    duration?: number;
  };
  connection: {
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    latency: number; // ms
    packetLoss: number; // percentage
  };
}

export interface CallNotification {
  id: string;
  call: VoiceCall;
  timestamp: string;
  isVisible: boolean;
  autoReject?: NodeJS.Timeout;
}

export interface AITranscript {
  id: string;
  speaker: 'ai' | 'customer';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  intent?: string;
}

export interface AICallSummary {
  customerIntent: string; // Müşteri ne istiyor
  sentiment: 'positive' | 'neutral' | 'negative'; // Duygu durumu
  previousInteractions: number; // Daha önce kaç kez konuşuldu
  lastInteractionDate?: string;
  quickNotes: string[]; // Hızlı notlar (VIP, önceki sorunlar vs)
  suggestedResponse?: string; // Agent'a önerilen ilk cümle
  conversationContext: string; // AI ile ne konuşuldu
  keyTopics: string[]; // Ana konular
  customerIssues: string[]; // Müşteri sorunları
  aiAttempts: number; // AI kaç kez cevap denedi
  stuckReason: string; // Neden agent'a yönlendirildi
}

// ==================== ADMIN PANEL TYPES ====================

export interface Dashboard {
  stats: {
    totalConversations: number;
    activeConversations: number;
    resolvedConversations: number;
    avgResponseTime: number;
    avgResolutionTime: number;
    customerSatisfaction: number;
    aiSuccessRate: number;
  };
  trends: {
    conversationsGrowth: number;
    satisfactionTrend: number;
    responseTimeTrend: number;
  };
}

export interface Report {
  id: string;
  type: 'ai' | 'channels' | 'satisfaction' | 'time' | 'team' | 'conversion' | 'financial' | 'trends' | 'sla';
  title: string;
  description: string;
  dateRange: {
    start: string;
    end: string;
  };
  data: Record<string, unknown>;
  createdAt: string;
  generatedBy: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'busy' | 'away';
  avatar?: string;
  performance: {
    totalConversations: number;
    avgResponseTime: number;
    satisfactionScore: number;
    resolvedConversations: number;
  };
  createdAt: string;
  lastActiveAt: string;
}

export interface Settings {
  general: {
    tenantName: string;
    timezone: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    webhookUrl?: string;
  };
  integrations: {
    whatsapp: {
      enabled: boolean;
      apiKey?: string;
      phoneNumber?: string;
    };
    instagram: {
      enabled: boolean;
      accessToken?: string;
      pageId?: string;
    };
    customApi: {
      enabled: boolean;
      endpoint?: string;
      apiKey?: string;
    };
  };
  ai: {
    enabled: boolean;
    provider: 'openai' | 'anthropic' | 'custom';
    model: string;
    temperature: number;
    maxTokens: number;
    fallbackToHuman: boolean;
  };
}

// ==================== AGENT PANEL TYPES ====================

export interface AgentStats {
  totalConversations: number;
  activeConversations: number;
  resolvedToday: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  satisfactionScore: number;
  aiHandoffRate: number;
  performanceRank: number;
}

// ==================== SUPER ADMIN TYPES ====================

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  tenantId?: string;
}

export interface FinancialReport {
  id: string;
  tenantId?: string;
  period: {
    start: string;
    end: string;
  };
  revenue: {
    total: number;
    byPlan: Record<string, number>;
    byTenant?: Record<string, number>;
  };
  costs: {
    total: number;
    infrastructure: number;
    api: number;
    storage: number;
    other: number;
  };
  profit: {
    total: number;
    margin: number;
  };
  growth: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
  };
  createdAt: string;
}
