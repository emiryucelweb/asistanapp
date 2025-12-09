/**
 * MessageInput Component Stories
 * 
 * @storybook
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import MessageInput from './MessageInput';

const meta = {
  title: 'Agent/Conversations/MessageInput',
  component: MessageInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Message input component for agent conversations with emoji picker, file attachments, and send functionality.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    messageInput: '',
    attachedFiles: [],
    showEmojiPicker: null,
    canSendMessage: true,
    isLocked: false,
    onMessageChange: fn(),
    onSendMessage: fn(),
    onAddFiles: fn(),
    onRemoveFile: fn(),
    onToggleEmojiPicker: fn(),
    onEmojiSelect: fn(),
    onToggleQuickReplies: fn(),
    onToggleNotes: fn(),
  },
} satisfies Meta<typeof MessageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ==================== DEFAULT STATES ====================

export const Default: Story = {
  args: {
    messageInput: '',
    showEmojiPicker: null,
  },
};

export const WithText: Story = {
  args: {
    messageInput: 'Hello, how can I help you today?',
  },
};

export const WithEmojiPicker: Story = {
  args: {
    messageInput: 'Message with emoji',
    showEmojiPicker: true,
  },
};

export const WithAttachedFiles: Story = {
  args: {
    messageInput: 'Check out these files',
    attachedFiles: [
      new File(['content'], 'document.pdf', { type: 'application/pdf' }),
      new File(['image'], 'screenshot.png', { type: 'image/png' }),
    ],
  },
};

export const Locked: Story = {
  args: {
    messageInput: '',
    isLocked: true,
    lockedBy: 'Agent John',
    canSendMessage: false,
  },
};

export const Disabled: Story = {
  args: {
    messageInput: '',
    canSendMessage: false,
  },
};

export const Uploading: Story = {
  args: {
    messageInput: 'Uploading files...',
    isUploading: true,
    canSendMessage: false,
  },
};
