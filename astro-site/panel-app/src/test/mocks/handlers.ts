 

import { http, HttpResponse } from 'msw';
import { logger } from '@/shared/utils/logger';

const API_BASE = 'http://localhost:3001';

export const handlers = [
  // Auth handlers
  http.post(`${API_BASE}/v1/auth/login`, async ({ request }) => {
    const body = await request.json() as any;
    
    if (body.email === 'admin@test.com' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 'user-1',
            email: 'admin@test.com',
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            permissions: ['all'],
            tenant_id: 'tenant-1'
          }
        }
      });
    }
    
    return HttpResponse.json(
      {
        success: false,
        error: { message: 'Invalid credentials' }
      },
      { status: 401 }
    );
  }),

  http.get(`${API_BASE}/v1/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader?.includes('mock-jwt-token')) {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: 'user-1',
            email: 'admin@test.com',
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            permissions: ['all'],
            tenant_id: 'tenant-1'
          }
        }
      });
    }
    
    return HttpResponse.json(
      { success: false, error: { message: 'Unauthorized' } },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE}/v1/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      data: { message: 'Logged out successfully' }
    });
  }),

  // Conversations handlers
  http.get(`${API_BASE}/v1/conversations`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';
    
    return HttpResponse.json({
      success: true,
      data: {
        conversations: [
          {
            id: 'conv-1',
            customer_id: 'customer-1',
            channel: 'whatsapp',
            status: 'active',
            assigned_agent_id: 'user-1',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:30:00Z',
            metadata: {
              customer_name: 'Test Customer',
              customer_phone: '+905551234567'
            },
            last_message: {
              content: 'Merhaba, yardıma ihtiyacım var',
              timestamp: '2024-01-15T10:30:00Z'
            }
          },
          {
            id: 'conv-2',
            customer_id: 'customer-2',
            channel: 'telegram',
            status: 'resolved',
            assigned_agent_id: 'user-2',
            created_at: '2024-01-14T15:00:00Z',
            updated_at: '2024-01-14T16:00:00Z',
            metadata: {
              customer_name: 'Another Customer',
              telegram_username: '@anothercustomer'
            },
            last_message: {
              content: 'Teşekkürler, sorunum çözüldü',
              timestamp: '2024-01-14T16:00:00Z'
            }
          }
        ],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 2,
          totalPages: 1
        }
      }
    });
  }),

  http.get(`${API_BASE}/v1/conversations/:id`, ({ params }) => {
    const { id } = params;
    
    return HttpResponse.json({
      success: true,
      data: {
        conversation: {
          id,
          customer_id: 'customer-1',
          channel: 'whatsapp',
          status: 'active',
          assigned_agent_id: 'user-1',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          metadata: {
            customer_name: 'Test Customer',
            customer_phone: '+905551234567'
          }
        }
      }
    });
  }),

  http.get(`${API_BASE}/v1/conversations/:id/messages`, ({ params }) => {
    const { id } = params;
    
    return HttpResponse.json({
      success: true,
      data: {
        messages: [
          {
            id: 'msg-1',
            conversation_id: id,
            sender_id: 'customer-1',
            sender_type: 'customer',
            content: 'Merhaba, yardıma ihtiyacım var',
            content_type: 'text',
            timestamp: '2024-01-15T10:00:00Z',
            channel: 'whatsapp'
          },
          {
            id: 'msg-2',
            conversation_id: id,
            sender_id: 'user-1',
            sender_type: 'agent',
            content: 'Merhaba! Size nasıl yardımcı olabilirim?',
            content_type: 'text',
            timestamp: '2024-01-15T10:05:00Z',
            channel: 'whatsapp'
          }
        ]
      }
    });
  }),

  // Analytics handlers
  http.get(`${API_BASE}/v1/analytics/dashboard`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalConversations: 156,
        activeConversations: 23,
        averageResponseTime: 2.5,
        customerSatisfaction: 4.6,
        conversionRate: 12.8,
        revenueToday: 15420,
        sentimentBreakdown: {
          positive: 65,
          neutral: 25,
          negative: 10
        },
        channelBreakdown: {
          whatsapp: 45,
          telegram: 30,
          web: 25
        }
      }
    });
  }),

  // Products handlers
  http.get(`${API_BASE}/v1/products`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        products: [
          {
            id: 'prod-1',
            name: 'Test Laptop',
            description: 'High-performance laptop',
            price: 15000,
            currency: 'TRY',
            category: 'electronics',
            status: 'active',
            stock_quantity: 50
          },
          {
            id: 'prod-2',
            name: 'Test Mouse',
            description: 'Wireless mouse',
            price: 150,
            currency: 'TRY',
            category: 'accessories',
            status: 'active',
            stock_quantity: 100
          }
        ]
      }
    });
  }),

  // AI Chatbot handlers
  http.get(`${API_BASE}/v1/ai-chatbot/config`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        enabled: true,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 500,
        personality: 'helpful and professional',
        auto_response_enabled: true,
        escalation_threshold: 0.3
      }
    });
  }),

  http.post(`${API_BASE}/v1/ai-chatbot/generate`, async ({ request }) => {
    const body = await request.json() as any;
    
    return HttpResponse.json({
      success: true,
      data: {
        response: `AI Generated response for: ${body.message}`,
        confidence: 0.85,
        intent: 'general_inquiry',
        sentiment: 'neutral'
      }
    });
  }),

  // Customer Journey handlers
  http.get(`${API_BASE}/v1/customer-journey/:customerId/timeline`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        touchpoints: [
          {
            id: 'tp-1',
            type: 'conversation_start',
            channel: 'whatsapp',
            timestamp: '2024-01-15T10:00:00Z',
            metadata: {
              message: 'First contact'
            }
          },
          {
            id: 'tp-2',
            type: 'product_inquiry',
            channel: 'whatsapp',
            timestamp: '2024-01-15T10:15:00Z',
            metadata: {
              product: 'laptop'
            }
          }
        ]
      }
    });
  }),

  // Team Chat handlers
  http.get(`${API_BASE}/v1/team-chat/channels`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        channels: [
          {
            id: 'channel-1',
            name: 'General',
            type: 'public',
            member_count: 5,
            unread_count: 3
          },
          {
            id: 'channel-2',
            name: 'Support Team',
            type: 'private',
            member_count: 3,
            unread_count: 0
          }
        ]
      }
    });
  }),

  // Smart Assignment handlers
  http.get(`${API_BASE}/v1/smart-assignment/suggestions/:conversationId`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        suggestions: [
          {
            agent_id: 'user-1',
            score: 0.95,
            reason: 'Best match for technical queries'
          },
          {
            agent_id: 'user-2',
            score: 0.78,
            reason: 'Available and experienced'
          }
        ]
      }
    });
  }),

  // Catch-all handler for unmatched requests
  http.all('*', ({ request }) => {
    logger.warn(`Unmatched request: ${request.method} ${request.url}`);
    return HttpResponse.json(
      { success: false, error: { message: 'Not found' } },
      { status: 404 }
    );
  })
];
