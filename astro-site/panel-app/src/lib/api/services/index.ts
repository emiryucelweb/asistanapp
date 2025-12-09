/**
 * API Services Index
 * Central export for all API services
 */
export { conversationsService } from './conversations.service';
export { dashboardService } from './dashboard.service';
export { agentService } from './agent.service';
export { assignmentService } from './assignment.service';
export { authService } from './auth.service';

// Export types - Conversations
export type { Conversation, Message, CreateMessageDto } from './conversations.service';

// Export types - Dashboard
export type { DashboardKPI, ChartData, ChannelDistribution, TeamPerformance } from './dashboard.service';

// Export types - Agent
export type {
  AgentProfile,
  AgentWorkload,
  AgentMetrics,
  UpdateAgentProfileDto,
  UpdateAgentStatusDto,
} from './agent.service';

// Export types - Assignment
export type {
  AssignmentRequest,
  AssignmentResult,
  AssignmentMetrics,
  AssignmentRule,
  WorkloadDistribution,
  CreateAssignmentRuleDto,
  UpdateAssignmentRuleDto,
} from './assignment.service';

