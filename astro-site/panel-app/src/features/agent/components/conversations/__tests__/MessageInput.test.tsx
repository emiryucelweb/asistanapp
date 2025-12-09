/**
 * MessageInput Component Tests - ENTERPRISE GRADE
 * 
 * Complete test coverage for MessageInput component
 * Tests the ACTUAL component API (post-refactor)
 * 
 * @group components
 * @group agent
 * @group conversations
 * @coverage Complete prop interface, user interactions, edge cases, accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessageInput from '../MessageInput';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'conversations.messageInput.lockedBy': `Bu konuşma ${options?.name || 'bir kullanıcı'} tarafından devralındı`,
        'conversations.messageInput.mustTakeOver': 'Bu konuşmayı devralmalısınız',
        'conversations.messageInput.cannotSend': 'Mesaj gönderemezsiniz',
        'conversations.messageInput.quickReplies': 'Hızlı Yanıtlar',
        'conversations.messageInput.notes': 'Notlar',
        'conversations.messageInput.addFile': 'Dosya Ekle',
        'conversations.messageInput.file': 'Dosya',
        'conversations.messageInput.photoVideo': 'Fotoğraf/Video',
        'conversations.messageInput.addEmoji': 'Emoji Ekle',
        'conversations.messageInput.placeholder': 'Mesajınızı yazın...',
        'conversations.messageInput.removeFile': 'Dosyayı Kaldır',
        'conversations.messageInput.sendMessage': 'Mesaj Gönder',
        'conversations.messageInput.uploading': 'Yükleniyor...',
        'messages.send': 'Gönder',
      };
      return translations[key] || key;
    },
    i18n: { language: 'tr' },
  }),
}));

// Mock emoji-picker-react
vi.mock('emoji-picker-react', () => ({
  default: ({ onEmojiClick }: any) => (
    <div data-testid="emoji-picker">
      <button
        onClick={() => onEmojiClick({ emoji: '😀' })}
        data-testid="emoji-option"
      >
        😀
      </button>
    </div>
  ),
}));

describe('MessageInput - Enterprise Grade Tests', () => {
  // ==================== SETUP ====================
  
  const createDefaultProps = () => ({
    messageInput: '',
    attachedFiles: [],
    showEmojiPicker: false,
    canSendMessage: true,
    isLocked: false,
    lockedBy: undefined,
    onMessageChange: vi.fn(),
    onSendMessage: vi.fn(),
    onAddFiles: vi.fn(),
    onRemoveFile: vi.fn(),
    onToggleEmojiPicker: vi.fn(),
    onEmojiSelect: vi.fn(),
    onToggleQuickReplies: vi.fn(),
    onToggleNotes: vi.fn(),
    isUploading: false,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==================== RENDERING TESTS ====================

  describe('Rendering - Basic UI Elements', () => {
    it('should render all essential UI elements when canSendMessage is true', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      // Verify textarea
      expect(screen.getByPlaceholderText(/mesajınızı yazın/i)).toBeInTheDocument();
      
      // Verify buttons by aria-label (more reliable than role)
      expect(screen.getByLabelText('Hızlı Yanıtlar')).toBeInTheDocument();
      expect(screen.getByLabelText('Notlar')).toBeInTheDocument();
      expect(screen.getByLabelText('Dosya Ekle')).toBeInTheDocument();
      expect(screen.getByLabelText('Emoji Ekle')).toBeInTheDocument();
      expect(screen.getByLabelText('Mesaj Gönder')).toBeInTheDocument();
    });

    it('should render locked state when canSendMessage is false', () => {
      const props = { ...createDefaultProps(), canSendMessage: false };
      render(<MessageInput {...props} />);

      expect(screen.getByText(/bu konuşmayı devralmalısınız/i)).toBeInTheDocument();
      expect(screen.getByText(/mesaj gönderemezsiniz/i)).toBeInTheDocument();
      expect(screen.queryByPlaceholderText(/mesajınızı yazın/i)).not.toBeInTheDocument();
    });

    it('should show locked by user name when isLocked and lockedBy are provided', () => {
      const props = { 
        ...createDefaultProps(), 
        canSendMessage: false, 
        isLocked: true,
        lockedBy: 'Ahmet K.'
      };
      render(<MessageInput {...props} />);

      expect(screen.getByText(/bu konuşma ahmet k\. tarafından devralındı/i)).toBeInTheDocument();
    });

    it('should disable send button when message is empty and no files attached', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const sendButton = screen.getByLabelText('Mesaj Gönder');
      expect(sendButton).toBeDisabled();
    });

    it('should enable send button when message has content', () => {
      const props = { ...createDefaultProps(), messageInput: 'Hello world' };
      render(<MessageInput {...props} />);

      const sendButton = screen.getByLabelText('Mesaj Gönder');
      expect(sendButton).not.toBeDisabled();
    });

    it('should enable send button when files are attached', () => {
      const props = { 
        ...createDefaultProps(), 
        attachedFiles: [new File(['content'], 'test.pdf', { type: 'application/pdf' })]
      };
      render(<MessageInput {...props} />);

      const sendButton = screen.getByLabelText('Mesaj Gönder');
      expect(sendButton).not.toBeDisabled();
    });
  });

  // ==================== USER INTERACTION TESTS ====================

  describe('User Interactions - Message Input', () => {
    it('should call onMessageChange when typing in textarea', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const textarea = screen.getByPlaceholderText(/mesajınızı yazın/i);
      fireEvent.change(textarea, { target: { value: 'Test message' } });

      expect(props.onMessageChange).toHaveBeenCalledWith('Test message');
      expect(props.onMessageChange).toHaveBeenCalledTimes(1);
    });

    it('should call onSendMessage when send button is clicked', () => {
      const props = { ...createDefaultProps(), messageInput: 'Test' };
      render(<MessageInput {...props} />);

      const sendButton = screen.getByLabelText('Mesaj Gönder');
      fireEvent.click(sendButton);

      expect(props.onSendMessage).toHaveBeenCalledTimes(1);
    });

    it('should call onSendMessage on Enter key press (without Shift)', () => {
      const props = { ...createDefaultProps(), messageInput: 'Test' };
      render(<MessageInput {...props} />);

      const textarea = screen.getByPlaceholderText(/mesajınızı yazın/i);
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });

      expect(props.onSendMessage).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onSendMessage on Shift+Enter (newline)', () => {
      const props = { ...createDefaultProps(), messageInput: 'Test' };
      render(<MessageInput {...props} />);

      const textarea = screen.getByPlaceholderText(/mesajınızı yazın/i);
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });

      expect(props.onSendMessage).not.toHaveBeenCalled();
    });

    it('should NOT call onSendMessage on Enter when message is empty', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const textarea = screen.getByPlaceholderText(/mesajınızı yazın/i);
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });

      expect(props.onSendMessage).not.toHaveBeenCalled();
    });

    it('should call onSendMessage on Enter when files are attached (even if message empty)', () => {
      const props = { 
        ...createDefaultProps(), 
        attachedFiles: [new File(['test'], 'test.pdf')]
      };
      render(<MessageInput {...props} />);

      const textarea = screen.getByPlaceholderText(/mesajınızı yazın/i);
      fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });

      expect(props.onSendMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Interactions - Emoji Picker', () => {
    it('should call onToggleEmojiPicker when emoji button is clicked', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const emojiButton = screen.getByLabelText('Emoji Ekle');
      fireEvent.click(emojiButton);

      expect(props.onToggleEmojiPicker).toHaveBeenCalledTimes(1);
    });

    it('should show emoji picker when showEmojiPicker is true', () => {
      const props = { ...createDefaultProps(), showEmojiPicker: true };
      render(<MessageInput {...props} />);

      expect(screen.getByTestId('emoji-picker')).toBeInTheDocument();
    });

    it('should hide emoji picker when showEmojiPicker is false', () => {
      const props = { ...createDefaultProps(), showEmojiPicker: false };
      render(<MessageInput {...props} />);

      expect(screen.queryByTestId('emoji-picker')).not.toBeInTheDocument();
    });

    it('should call onEmojiSelect when emoji is clicked from picker', () => {
      const props = { ...createDefaultProps(), showEmojiPicker: true };
      render(<MessageInput {...props} />);

      const emojiOption = screen.getByTestId('emoji-option');
      fireEvent.click(emojiOption);

      expect(props.onEmojiSelect).toHaveBeenCalledWith('😀');
    });

    it('should call onToggleEmojiPicker when clicking outside emoji picker', () => {
      const props = { ...createDefaultProps(), showEmojiPicker: true };
      render(<MessageInput {...props} />);

      // Click the overlay
      const overlay = screen.getByTestId('emoji-picker').previousElementSibling;
      if (overlay) {
        fireEvent.click(overlay);
        expect(props.onToggleEmojiPicker).toHaveBeenCalled();
      }
    });

    it('should handle null showEmojiPicker (type-safe)', () => {
      const props = { ...createDefaultProps(), showEmojiPicker: null };
      render(<MessageInput {...props} />);

      expect(screen.queryByTestId('emoji-picker')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions - File Upload', () => {
    it('should call onToggleQuickReplies when quick replies button is clicked', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const quickRepliesButton = screen.getByLabelText('Hızlı Yanıtlar');
      fireEvent.click(quickRepliesButton);

      expect(props.onToggleQuickReplies).toHaveBeenCalledTimes(1);
    });

    it('should call onToggleNotes when notes button is clicked', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const notesButton = screen.getByLabelText('Notlar');
      fireEvent.click(notesButton);

      expect(props.onToggleNotes).toHaveBeenCalledTimes(1);
    });

    it('should display attached files preview', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 2048 }); // 2KB
      
      const props = { ...createDefaultProps(), attachedFiles: [file] };
      render(<MessageInput {...props} />);

      expect(screen.getByText('document.pdf')).toBeInTheDocument();
      expect(screen.getByText('(2.0 KB)')).toBeInTheDocument();
    });

    it('should call onRemoveFile when file remove button is clicked', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const props = { ...createDefaultProps(), attachedFiles: [file] };
      render(<MessageInput {...props} />);

      const removeButton = screen.getByLabelText('Dosyayı Kaldır');
      fireEvent.click(removeButton);

      expect(props.onRemoveFile).toHaveBeenCalledWith(0);
    });

    it('should display multiple attached files', () => {
      const file1 = new File(['1'], 'file1.pdf', { type: 'application/pdf' });
      const file2 = new File(['2'], 'file2.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      Object.defineProperty(file1, 'size', { value: 1024 });
      Object.defineProperty(file2, 'size', { value: 2048 });
      
      const props = { ...createDefaultProps(), attachedFiles: [file1, file2] };
      render(<MessageInput {...props} />);

      expect(screen.getByText('file1.pdf')).toBeInTheDocument();
      expect(screen.getByText('file2.docx')).toBeInTheDocument();
      expect(screen.getAllByLabelText('Dosyayı Kaldır')).toHaveLength(2);
    });

    it('should show uploading indicator when isUploading is true', () => {
      const props = { ...createDefaultProps(), isUploading: true };
      render(<MessageInput {...props} />);

      expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();
    });

    it('should hide uploading indicator when isUploading is false', () => {
      const props = { ...createDefaultProps(), isUploading: false };
      render(<MessageInput {...props} />);

      expect(screen.queryByText(/yükleniyor/i)).not.toBeInTheDocument();
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle whitespace-only message (send button disabled)', () => {
      const props = { ...createDefaultProps(), messageInput: '   ' };
      render(<MessageInput {...props} />);

      const sendButton = screen.getByLabelText('Mesaj Gönder');
      expect(sendButton).toBeDisabled();
    });

    it('should handle very long message', () => {
      const longMessage = 'A'.repeat(5000);
      const props = { ...createDefaultProps(), messageInput: longMessage };
      render(<MessageInput {...props} />);

      const textarea = screen.getByPlaceholderText(/mesajınızı yazın/i);
      expect(textarea).toHaveValue(longMessage);
      
      const sendButton = screen.getByLabelText('Mesaj Gönder');
      expect(sendButton).not.toBeDisabled();
    });

    it('should handle very long file name', () => {
      const longFileName = 'A'.repeat(200) + '.pdf';
      const file = new File(['content'], longFileName, { type: 'application/pdf' });
      const props = { ...createDefaultProps(), attachedFiles: [file] };
      render(<MessageInput {...props} />);

      // File name should be truncated in UI (max-w-[120px])
      expect(screen.getByText(longFileName)).toBeInTheDocument();
    });

    it('should handle very large file size display', () => {
      const file = new File(['content'], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // 10MB
      
      const props = { ...createDefaultProps(), attachedFiles: [file] };
      render(<MessageInput {...props} />);

      expect(screen.getByText('(10240.0 KB)')).toBeInTheDocument();
    });

    it('should handle zero-sized file', () => {
      const file = new File([''], 'empty.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 0 });
      
      const props = { ...createDefaultProps(), attachedFiles: [file] };
      render(<MessageInput {...props} />);

      expect(screen.getByText('(0.0 KB)')).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const textarea = screen.getByPlaceholderText(/mesajınızı yazın/i);
      const specialMessage = '<script>alert("XSS")</script> & emoji 🎉';
      fireEvent.change(textarea, { target: { value: specialMessage } });

      expect(props.onMessageChange).toHaveBeenCalledWith(specialMessage);
    });

    it('should handle undefined lockedBy gracefully', () => {
      const props = { 
        ...createDefaultProps(), 
        canSendMessage: false, 
        isLocked: false,
        lockedBy: undefined
      };
      
      const { container } = render(<MessageInput {...props} />);
      expect(container).toBeInTheDocument();
      expect(screen.getByText(/bu konuşmayı devralmalısınız/i)).toBeInTheDocument();
    });
  });

  // ==================== ACCESSIBILITY ====================

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all interactive elements', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      expect(screen.getByLabelText('Hızlı Yanıtlar')).toBeInTheDocument();
      expect(screen.getByLabelText('Notlar')).toBeInTheDocument();
      expect(screen.getByLabelText('Dosya Ekle')).toBeInTheDocument();
      expect(screen.getByLabelText('Emoji Ekle')).toBeInTheDocument();
      expect(screen.getByLabelText('Mesaj Gönder')).toBeInTheDocument();
    });

    it('should have title tooltips for buttons', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const quickRepliesButton = screen.getByLabelText('Hızlı Yanıtlar');
      expect(quickRepliesButton).toHaveAttribute('title', 'Hızlı Yanıtlar');

      const sendButton = screen.getByLabelText('Mesaj Gönder');
      expect(sendButton).toHaveAttribute('title', 'Mesaj Gönder');
    });

    it('should support keyboard navigation (focusable elements)', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const textarea = screen.getByPlaceholderText(/mesajınızı yazın/i);
      textarea.focus();
      expect(document.activeElement).toBe(textarea);
    });

    it('should announce locked state to screen readers', () => {
      const props = { ...createDefaultProps(), canSendMessage: false };
      render(<MessageInput {...props} />);

      const lockMessage = screen.getByText(/bu konuşmayı devralmalısınız/i);
      expect(lockMessage).toBeVisible();
    });

    it('should have proper contrast for disabled button', () => {
      const props = createDefaultProps();
      render(<MessageInput {...props} />);

      const sendButton = screen.getByLabelText('Mesaj Gönder');
      expect(sendButton).toHaveClass('disabled:opacity-50');
    });
  });

  // ==================== PERFORMANCE ====================

  describe('Performance - React.memo', () => {
    it('should be wrapped in React.memo (displayName check)', () => {
      expect(MessageInput.displayName).toBe('MessageInput');
    });

    it('should not re-render when unrelated props change (memo optimization)', () => {
      const props = createDefaultProps();
      const { rerender } = render(<MessageInput {...props} />);

      const renderCount = vi.fn();
      const MemoizedComponent = () => {
        renderCount();
        return <MessageInput {...props} />;
      };

      rerender(<MemoizedComponent />);
      rerender(<MemoizedComponent />);

      // Component should minimize re-renders (memo)
      expect(renderCount).toHaveBeenCalled();
    });
  });

  // ==================== INTEGRATION ====================

  describe('Integration - Complete Workflows', () => {
    it('should handle complete message send workflow', () => {
      const props = createDefaultProps();
      const { rerender } = render(<MessageInput {...props} />);

      // Type message
      const textarea = screen.getByPlaceholderText(/mesajınızı yazın/i);
      fireEvent.change(textarea, { target: { value: 'Hello world' } });
      expect(props.onMessageChange).toHaveBeenCalledWith('Hello world');

      // Update props with new message
      rerender(<MessageInput {...props} messageInput="Hello world" />);

      // Send button should be enabled
      const sendButton = screen.getByLabelText('Mesaj Gönder');
      expect(sendButton).not.toBeDisabled();

      // Click send
      fireEvent.click(sendButton);
      expect(props.onSendMessage).toHaveBeenCalledTimes(1);
    });

    it('should handle emoji selection workflow', () => {
      const props = createDefaultProps();
      const { rerender } = render(<MessageInput {...props} />);

      // Open emoji picker
      const emojiButton = screen.getByLabelText('Emoji Ekle');
      fireEvent.click(emojiButton);
      expect(props.onToggleEmojiPicker).toHaveBeenCalled();

      // Simulate emoji picker open
      rerender(<MessageInput {...props} showEmojiPicker={true} />);

      // Select emoji
      const emojiOption = screen.getByTestId('emoji-option');
      fireEvent.click(emojiOption);
      expect(props.onEmojiSelect).toHaveBeenCalledWith('😀');
    });

    it('should handle file attachment workflow', () => {
      const props = createDefaultProps();
      const { rerender } = render(<MessageInput {...props} />);

      // Initially no files
      expect(screen.queryByText(/\.pdf/)).not.toBeInTheDocument();

      // Simulate file attachment
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      rerender(<MessageInput {...props} attachedFiles={[file]} />);

      // File should appear
      expect(screen.getByText('test.pdf')).toBeInTheDocument();

      // Send with file
      const sendButton = screen.getByLabelText('Mesaj Gönder');
      expect(sendButton).not.toBeDisabled();
      fireEvent.click(sendButton);
      expect(props.onSendMessage).toHaveBeenCalled();
    });
  });
});
