/**
 * Modal Component Tests
 * Coverage Target: 84% → 95%
 * Golden Rules: AAA Pattern, beforeEach/afterEach, User Interactions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ConfirmModal, FormModal } from '../Modal';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Modal', () => {
  // Arrange
  let onCloseMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onCloseMock = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Rule 1: Component Rendering
  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock}>
          <p>Test Content</p>
        </Modal>
      );

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      // Arrange & Act
      render(
        <Modal isOpen={false} onClose={onCloseMock}>
          <p>Test Content</p>
        </Modal>
      );

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render with title', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      // Assert
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should render without title', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock}>
          <p>Content</p>
        </Modal>
      );

      // Assert
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
    });

    it('should render with footer', () => {
      // Arrange
      const footer = (
        <button data-testid="footer-button">Footer Button</button>
      );

      // Act
      render(
        <Modal isOpen={true} onClose={onCloseMock} footer={footer}>
          <p>Content</p>
        </Modal>
      );

      // Assert
      expect(screen.getByTestId('footer-button')).toBeInTheDocument();
    });
  });

  // Rule 2: Size Variants
  describe('Size Variants', () => {
    it('should apply sm size class', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock} size="sm">
          <p>Content</p>
        </Modal>
      );

      // Assert - size class is on the inner container (first child of dialog)
      const innerContainer = screen.getByRole('dialog').querySelector('.relative');
      expect(innerContainer).toHaveClass('max-w-md');
    });

    it('should apply md size class by default', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock}>
          <p>Content</p>
        </Modal>
      );

      // Assert - size class is on the inner container (first child of dialog)
      const innerContainer = screen.getByRole('dialog').querySelector('.relative');
      expect(innerContainer).toHaveClass('max-w-lg');
    });

    it('should apply lg size class', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock} size="lg">
          <p>Content</p>
        </Modal>
      );

      // Assert - size class is on the inner container
      const innerContainer = screen.getByRole('dialog').querySelector('.relative');
      expect(innerContainer).toHaveClass('max-w-2xl');
    });

    it('should apply xl size class', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock} size="xl">
          <p>Content</p>
        </Modal>
      );

      // Assert - size class is on the inner container
      const innerContainer = screen.getByRole('dialog').querySelector('.relative');
      expect(innerContainer).toHaveClass('max-w-4xl');
    });

    it('should apply full size class', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock} size="full">
          <p>Content</p>
        </Modal>
      );

      // Assert - size class is on the inner container
      const innerContainer = screen.getByRole('dialog').querySelector('.relative');
      expect(innerContainer).toHaveClass('max-w-7xl');
    });
  });

  // Rule 2: User Interactions
  describe('Close Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test">
          <p>Content</p>
        </Modal>
      );

      // Act
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock}>
          <p>Content</p>
        </Modal>
      );

      // Act - the dialog element itself is the overlay
      const overlay = screen.getByRole('dialog');
      await user.click(overlay);

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should not close when overlay is clicked if closeOnOverlayClick is false', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock} closeOnOverlayClick={false}>
          <p>Content</p>
        </Modal>
      );

      // Act - the dialog element itself is the overlay
      const overlay = screen.getByRole('dialog');
      await user.click(overlay);

      // Assert
      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('should not close when modal content is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock}>
          <p>Content</p>
        </Modal>
      );

      // Act
      const content = screen.getByText('Content');
      await user.click(content);

      // Assert
      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('should call onClose when Escape key is pressed', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock}>
          <p>Content</p>
        </Modal>
      );

      // Act
      await user.keyboard('{Escape}');

      // Assert
      await waitFor(() => {
        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
    });

    it('should not close on Escape if closeOnEscape is false', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock} closeOnEscape={false}>
          <p>Content</p>
        </Modal>
      );

      // Act
      await user.keyboard('{Escape}');

      // Assert
      await waitFor(() => {
        expect(onCloseMock).not.toHaveBeenCalled();
      });
    });
  });

  // Rule 9: Edge Cases
  describe('Edge Cases', () => {
    it('should hide close button when showCloseButton is false', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test" showCloseButton={false}>
          <p>Content</p>
        </Modal>
      );

      // Assert
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    it('should lock body scroll when open', () => {
      // Arrange
      const { unmount } = render(
        <Modal isOpen={true} onClose={onCloseMock}>
          <p>Content</p>
        </Modal>
      );

      // Assert
      expect(document.body.style.overflow).toBe('hidden');

      // Cleanup
      unmount();
      expect(document.body.style.overflow).toBe('');
    });

    it('should restore body scroll when closed', () => {
      // Arrange
      const { rerender } = render(
        <Modal isOpen={true} onClose={onCloseMock}>
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      // Act
      rerender(
        <Modal isOpen={false} onClose={onCloseMock}>
          <p>Content</p>
        </Modal>
      );

      // Assert
      expect(document.body.style.overflow).toBe('');
    });

    it('should apply custom header className', () => {
      // Arrange & Act
      render(
        <Modal
          isOpen={true}
          onClose={onCloseMock}
          title="Test"
          headerClassName="custom-header"
        >
          <p>Content</p>
        </Modal>
      );

      // Assert
      const header = screen.getByText('Test').parentElement;
      expect(header).toHaveClass('custom-header');
    });

    it('should apply custom body className', () => {
      // Arrange & Act
      render(
        <Modal isOpen={true} onClose={onCloseMock} bodyClassName="custom-body">
          <p>Content</p>
        </Modal>
      );

      // Assert
      const body = screen.getByText('Content').parentElement;
      expect(body).toHaveClass('custom-body');
    });

    it('should apply custom footer className', () => {
      // Arrange & Act
      const footer = <button>Submit</button>;
      render(
        <Modal
          isOpen={true}
          onClose={onCloseMock}
          footer={footer}
          footerClassName="custom-footer"
        >
          <p>Content</p>
        </Modal>
      );

      // Assert - footer is direct parent of the button
      const footerElement = screen.getByText('Submit').parentElement;
      expect(footerElement).toHaveClass('custom-footer');
    });
  });

  // Rule 6: Cleanup
  describe('Cleanup', () => {
    it('should cleanup event listeners on unmount', () => {
      // Arrange
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      const { unmount } = render(
        <Modal isOpen={true} onClose={onCloseMock}>
          <p>Content</p>
        </Modal>
      );

      // Act
      unmount();

      // Assert
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});

describe('ConfirmModal', () => {
  let onCloseMock: ReturnType<typeof vi.fn>;
  let onConfirmMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onCloseMock = vi.fn();
    onConfirmMock = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render with title and message', () => {
    // Arrange & Act
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    // Assert
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Confirm"
        message="Confirm action?"
      />
    );

    // Act
    const confirmButton = screen.getByText('confirm');
    await user.click(confirmButton);

    // Assert
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Confirm"
        message="Confirm action?"
      />
    );

    // Act
    const cancelButton = screen.getByText('cancel');
    await user.click(cancelButton);

    // Assert
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when loading', () => {
    // Arrange & Act
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Confirm"
        message="Loading..."
        isLoading={true}
      />
    );

    // Assert
    expect(screen.getByText('cancel')).toBeDisabled();
    expect(screen.getByText('processing')).toBeDisabled();
  });

  it('should apply danger variant styling', () => {
    // Arrange & Act
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Delete"
        message="Delete item?"
        variant="danger"
      />
    );

    // Assert
    const confirmButton = screen.getByText('confirm');
    expect(confirmButton).toHaveClass('bg-red-600');
  });

  it('should apply warning variant styling', () => {
    // Arrange & Act
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Warning"
        message="Are you sure?"
        variant="warning"
      />
    );

    // Assert
    const confirmButton = screen.getByText('confirm');
    expect(confirmButton).toHaveClass('bg-orange-600');
  });

  it('should apply info variant styling', () => {
    // Arrange & Act
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Info"
        message="Continue?"
        variant="info"
      />
    );

    // Assert
    const confirmButton = screen.getByText('confirm');
    expect(confirmButton).toHaveClass('bg-blue-600');
  });

  it('should use custom button text', () => {
    // Arrange & Act
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        title="Delete"
        message="Delete?"
        confirmText="Delete Now"
        cancelText="Keep It"
      />
    );

    // Assert
    expect(screen.getByText('Delete Now')).toBeInTheDocument();
    expect(screen.getByText('Keep It')).toBeInTheDocument();
  });
});

describe('FormModal', () => {
  let onCloseMock: ReturnType<typeof vi.fn>;
  let onSubmitMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onCloseMock = vi.fn();
    onSubmitMock = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render with form content', () => {
    // Arrange & Act
    render(
      <FormModal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Edit Form"
      >
        <input type="text" placeholder="Name" />
      </FormModal>
    );

    // Assert
    expect(screen.getByText('Edit Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  });

  it('should call onSubmit when submit button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <FormModal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Form"
      >
        <input type="text" />
      </FormModal>
    );

    // Act
    const submitButton = screen.getByText('save');
    await user.click(submitButton);

    // Assert
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    render(
      <FormModal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Form"
      >
        <input type="text" />
      </FormModal>
    );

    // Act
    const cancelButton = screen.getByText('cancel');
    await user.click(cancelButton);

    // Assert
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should disable submit button when submitDisabled is true', () => {
    // Arrange & Act
    render(
      <FormModal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Form"
        submitDisabled={true}
      >
        <input type="text" />
      </FormModal>
    );

    // Assert
    expect(screen.getByText('save')).toBeDisabled();
  });

  it('should show loading state', () => {
    // Arrange & Act
    render(
      <FormModal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Form"
        isLoading={true}
      >
        <input type="text" />
      </FormModal>
    );

    // Assert
    expect(screen.getByText('saving')).toBeInTheDocument();
    expect(screen.getByText('saving')).toBeDisabled();
  });

  it('should use custom button text', () => {
    // Arrange & Act
    render(
      <FormModal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Form"
        submitText="Update"
        cancelText="Discard"
      >
        <input type="text" />
      </FormModal>
    );

    // Assert
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Discard')).toBeInTheDocument();
  });

  it('should apply size prop', () => {
    // Arrange & Act
    const { container } = render(
      <FormModal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Form"
        size="xl"
      >
        <input type="text" />
      </FormModal>
    );

    // Assert - Find the modal container with the size class
    const modalContainer = container.querySelector('.max-w-4xl');
    expect(modalContainer).toBeInTheDocument();
  });
});

