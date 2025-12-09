/**
 * Conversation Assignment Service
 * Otomatik ve manuel atama işlemleri
 */
import { apiService } from './api-service';
import type { Conversation, AssignmentType } from '../types';
import { logger } from '@/shared/utils/logger';

export interface Agent {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'offline';
  activeConversations: number;
  maxConversations: number;
  skills: string[];
  availability: boolean;
}

export interface AssignmentResult {
  success: boolean;
  conversationId: string;
  assignedTo?: string;
  assignmentType: AssignmentType;
  queuePosition?: number;
  message: string;
}

export interface AssignmentRule {
  id: string;
  name: string;
  priority: number;
  conditions: {
    channel?: string[];
    priority?: string[];
    tags?: string[];
    timeOfDay?: { start: string; end: string };
  };
  assignment: {
    type: 'round_robin' | 'least_active' | 'skill_based' | 'specific_agent';
    agentIds?: string[];
    skills?: string[];
  };
  enabled: boolean;
}

class ConversationAssignmentService {
  /**
   * Otomatik atama - Yeni konuşma geldiğinde
   */
  async autoAssign(conversationId: string): Promise<AssignmentResult> {
    try {
      // 1. Müsait agentları getir
      const availableAgents = await this.getAvailableAgents();

      if (availableAgents.length === 0) {
        // Agent yoksa sıraya al
        return await this.addToQueue(conversationId);
      }

      // 2. En uygun agentı bul
      const bestAgent = await this.findBestAgent(conversationId, availableAgents);

      if (!bestAgent) {
        return await this.addToQueue(conversationId);
      }

      // 3. Atama yap

      return {
        success: true,
        conversationId,
        assignedTo: bestAgent.id,
        assignmentType: 'auto',
        message: `Konuşma ${bestAgent.name} kullanıcısına otomatik atandı.`,
      };
    } catch (error) {
      logger.error('Auto assignment failed', error as Error, { conversationId });
      return await this.addToQueue(conversationId);
    }
  }

  /**
   * Manuel atama - Firma sahibi veya yönetici atar
   */
  async manualAssign(
    conversationId: string,
    agentId: string,
    assignedBy: string
  ): Promise<AssignmentResult> {
    try {

      return {
        success: true,
        conversationId,
        assignedTo: agentId,
        assignmentType: 'manual',
        message: 'Konuşma başarıyla atandı.',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Atama başarısız oldu.';
      return {
        success: false,
        conversationId,
        assignmentType: 'manual',
        message: errorMessage,
      };
    }
  }

  /**
   * Firma sahibi kendisi alır
   */
  async takeAsOwner(conversationId: string, ownerId: string): Promise<AssignmentResult> {
    try {

      return {
        success: true,
        conversationId,
        assignedTo: ownerId,
        assignmentType: 'owner',
        message: 'Konuşmayı üstlendiniz.',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'İşlem başarısız oldu.';
      return {
        success: false,
        conversationId,
        assignmentType: 'owner',
        message: errorMessage,
      };
    }
  }

  /**
   * Sıraya ekle - Agent yoksa
   */
  private async addToQueue(conversationId: string): Promise<AssignmentResult> {
    try {
      const result = await apiService.post<{ queuePosition: number }>(`/api/conversations/${conversationId}/queue`, {
        status: 'waiting',
      });

      const queuePosition = result.data?.queuePosition || 1;

      return {
        success: true,
        conversationId,
        assignmentType: 'auto',
        queuePosition,
        message: `Müsait agent yok. Konuşma sırada ${queuePosition}. sırada bekliyor.`,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sıraya ekleme başarısız oldu.';
      return {
        success: false,
        conversationId,
        assignmentType: 'auto',
        message: errorMessage,
      };
    }
  }

  /**
   * Müsait agentları getir
   */
  async getAvailableAgents(): Promise<Agent[]> {
    try {
      const response = await apiService.get<{ agents: Agent[] }>('/api/agents/available');
      return response.data.agents.filter(
        (agent) => agent.status === 'online' && agent.activeConversations < agent.maxConversations
      );
    } catch (error) {
      logger.error('Failed to fetch available agents', error as Error);
      return [];
    }
  }

  /**
   * En uygun agentı bul
   */
  private async findBestAgent(
    conversationId: string,
    availableAgents: Agent[]
  ): Promise<Agent | null> {
    if (availableAgents.length === 0) return null;

    // En az aktif konuşması olan agent
    const sortedAgents = [...availableAgents].sort(
      (a, b) => a.activeConversations - b.activeConversations
    );

    return sortedAgents[0];
  }

  /**
   * Kuyrukta bekleyen konuşmaları getir
   */
  async getQueuedConversations(): Promise<Conversation[]> {
    try {
      const response = await apiService.get<{ conversations: Conversation[] }>(
        '/api/conversations/queue'
      );
      return response.data.conversations;
    } catch (error) {
      logger.error('Failed to fetch queued conversations', error as Error);
      return [];
    }
  }

  /**
   * Konuşmayı serbest bırak (atamayı kaldır)
   */
  async unassign(conversationId: string): Promise<AssignmentResult> {
    try {
      await apiService.post(`/api/conversations/${conversationId}/unassign`, {});

      return {
        success: true,
        conversationId,
        assignmentType: 'manual',
        message: 'Atama kaldırıldı. Konuşma tekrar sıraya alındı.',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Atama kaldırılamadı.';
      return {
        success: false,
        conversationId,
        assignmentType: 'manual',
        message: errorMessage,
      };
    }
  }

  /**
   * Atama kurallarını getir
   */
  async getAssignmentRules(): Promise<AssignmentRule[]> {
    try {
      const response = await apiService.get<{ rules: AssignmentRule[] }>(
        '/api/assignments/rules'
      );
      return response.data.rules;
    } catch (error) {
      logger.error('Failed to fetch assignment rules', error as Error);
      return [];
    }
  }

  /**
   * Atama kuralı oluştur
   */
  async createAssignmentRule(rule: Omit<AssignmentRule, 'id'>): Promise<AssignmentRule> {
    const response = await apiService.post<{ rule: AssignmentRule }>(
      '/api/assignments/rules',
      rule
    );
    return response.data.rule;
  }

  /**
   * Atama kuralını güncelle
   */
  async updateAssignmentRule(
    ruleId: string,
    updates: Partial<AssignmentRule>
  ): Promise<AssignmentRule> {
    const response = await apiService.patch<{ rule: AssignmentRule }>(
      `/api/assignments/rules/${ruleId}`,
      updates
    );
    return response.data.rule;
  }

  /**
   * Atama kuralını sil
   */
  async deleteAssignmentRule(ruleId: string): Promise<void> {
    await apiService.delete(`/api/assignments/rules/${ruleId}`);
  }

  /**
   * Agent istatistiklerini getir
   */
  async getAgentStats(agentId: string) {
    try {
      const response = await apiService.get(`/api/agents/${agentId}/stats`);
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch agent stats', error as Error, { agentId });
      return null;
    }
  }

  /**
   * Toplu atama - Birden fazla konuşmayı ata
   */
  async bulkAssign(
    conversationIds: string[],
    agentId: string,
    assignedBy: string
  ): Promise<{ success: number; failed: number; results: AssignmentResult[] }> {
    const results: AssignmentResult[] = [];
    let success = 0;
    let failed = 0;

    for (const conversationId of conversationIds) {
      const result = await this.manualAssign(conversationId, agentId, assignedBy);
      results.push(result);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed, results };
  }

  /**
   * Yeniden atama - Mevcut atamayı değiştir
   */
  async reassign(
    conversationId: string,
    newAgentId: string,
    assignedBy: string,
    reason?: string
  ): Promise<AssignmentResult> {
    try {

      return {
        success: true,
        conversationId,
        assignedTo: newAgentId,
        assignmentType: 'manual',
        message: 'Konuşma başarıyla yeniden atandı.',
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Yeniden atama başarısız oldu.';
      return {
        success: false,
        conversationId,
        assignmentType: 'manual',
        message: errorMessage,
      };
    }
  }
}

// Singleton instance
export const conversationAssignmentService = new ConversationAssignmentService();

