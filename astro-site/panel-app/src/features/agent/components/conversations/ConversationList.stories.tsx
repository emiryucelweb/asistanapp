/**
 * ConversationList Stories
 * Storybook documentation and visual regression testing
 */

import type { Meta, StoryObj } from '@storybook/react';
import ConversationList from './ConversationList';
import type { Conversation } from '@/features/agent/types';

const meta = {
  title: 'Agent/Components/ConversationList',
  component: ConversationList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Displays a list of customer conversations with real-time updates, filtering, and interaction capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    conversations: {
      description: 'Array of conversation objects',
      control: 'object',
    },
    selectedConversation: {
      description: 'Currently selected conversation',
      control: 'object',
    },
    onSelect: {
      description: 'Callback when a conversation is selected',
      action: 'onSelect',
    },
    onTakeOver: {
      description: 'Callback when agent takes over from AI',
      action: 'onTakeOver',
    },
    onAssign: {
      description: 'Callback when conversation is assigned',
      action: 'onAssign',
    },
  },
} satisfies Meta<typeof ConversationList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data - Type assertions for branded types (Storybook compatibility)
const mockConversations: Conversation[] = [
  {
    id: '1' as any,
    customerId: 'cust-1' as any,
    customerName: 'Ahmet Yılmaz',
    channel: 'whatsapp',
    status: 'waiting',
    priority: 'high',
    lastMessage: 'Ürün hakkında bilgi alabilir miyim?',
    lastMessageTime: new Date().toISOString() as any,
    unreadCount: 3,
    isLocked: false,
    aiStuck: true,
    sentiment: 'neutral',
    tags: [],
    createdAt: new Date().toISOString() as any,
    updatedAt: new Date().toISOString() as any,
  },
  {
    id: '2' as any,
    customerId: 'cust-2' as any,
    customerName: 'Ayşe Demir',
    channel: 'instagram',
    status: 'assigned',
    priority: 'medium',
    lastMessage: 'Teşekkür ederim',
    lastMessageTime: new Date(Date.now() - 300000).toISOString() as any,
    unreadCount: 0,
    assignedTo: 'current-user' as any,
    assignedToName: 'Agent 1',
    isLocked: true,
    lockedBy: 'current-user' as any,
    lockedByName: 'Agent 1',
    aiStuck: false,
    sentiment: 'happy',
    tags: [],
    createdAt: new Date().toISOString() as any,
    updatedAt: new Date().toISOString() as any,
  },
  {
    id: '3' as any,
    customerId: 'cust-3' as any,
    customerName: 'Mehmet Kaya',
    channel: 'web',
    status: 'waiting',
    priority: 'low',
    lastMessage: 'Siparişim nerede?',
    lastMessageTime: new Date(Date.now() - 600000).toISOString() as any,
    unreadCount: 1,
    isLocked: false,
    aiStuck: false,
    sentiment: 'angry',
    tags: [],
    createdAt: new Date().toISOString() as any,
    updatedAt: new Date().toISOString() as any,
  },
];

// Stories

export const Default: Story = {
  args: {
    conversations: mockConversations,
    selectedConversation: null,
    currentUserId: 'current-user',
    onSelect: async () => {},
    onTakeOver: async () => {},
    onAssign: () => {},
  },
};

export const WithSelection: Story = {
  args: {
    conversations: mockConversations,
    selectedConversation: mockConversations[0],
    currentUserId: 'current-user',
    onSelect: async () => {},
    onTakeOver: async () => {},
    onAssign: () => {},
  },
};

export const Empty: Story = {
  args: {
    conversations: [],
    selectedConversation: null,
    currentUserId: 'current-user',
    onSelect: async () => {},
    onTakeOver: async () => {},
    onAssign: () => {},
  },
};

export const Loading: Story = {
  args: {
    conversations: mockConversations,
    selectedConversation: null,
    currentUserId: 'current-user',
    isLoading: true,
    onSelect: async () => {},
    onTakeOver: async () => {},
    onAssign: () => {},
  },
};

export const HighPriorityOnly: Story = {
  args: {
    conversations: mockConversations.filter(c => c.priority === 'high'),
    selectedConversation: null,
    currentUserId: 'current-user',
    onSelect: async () => {},
    onTakeOver: async () => {},
    onAssign: () => {},
  },
};

export const AIStuckConversations: Story = {
  args: {
    conversations: mockConversations.filter(c => c.aiStuck),
    selectedConversation: null,
    currentUserId: 'current-user',
    onSelect: async () => {},
    onTakeOver: async () => {},
    onAssign: () => {},
  },
};

export const DarkMode: Story = {
  args: {
    conversations: mockConversations,
    selectedConversation: null,
    currentUserId: 'current-user',
    onSelect: async () => {},
    onTakeOver: async () => {},
    onAssign: () => {},
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

