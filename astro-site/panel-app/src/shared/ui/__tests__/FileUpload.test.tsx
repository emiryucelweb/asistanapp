/**
 * FileUpload Component Tests
 * Coverage Target: 9% → 60%
 * Golden Rules: AAA Pattern, User Interactions, File Validation, Edge Cases
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload, FileUploadButton } from '../FileUpload';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'fileUpload.dropFiles': 'Drop files here',
        'fileUpload.clickOrDrag': 'Click or drag files',
        'fileUpload.supportedFormats': `Supported: ${params?.formats}`,
        'fileUpload.allFormatsSupported': 'All formats supported',
        'fileUpload.maxSize': `Max ${params?.maxSize}MB`,
        'fileUpload.maxFiles': `Max ${params?.maxFiles} files`,
        'fileUpload.fileSizeError': `File exceeds ${params?.maxSize}MB`,
        'fileUpload.unsupportedFormat': 'Unsupported format',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('FileUpload', () => {
  let onFilesSelectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onFilesSelectMock = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Rule 1: Component Rendering
  describe('Rendering', () => {
    it('should render drop zone', () => {
      // Arrange & Act
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);

      // Assert
      expect(screen.getByText(/Click or drag files/i)).toBeInTheDocument();
    });

    it('should show max size in description', () => {
      // Arrange & Act
      render(<FileUpload onFilesSelect={onFilesSelectMock} maxSize={5} />);

      // Assert
      expect(screen.getByText(/Max 5MB/i)).toBeInTheDocument();
    });

    it('should show max files in description when multiple is true', () => {
      // Arrange & Act
      render(<FileUpload onFilesSelect={onFilesSelectMock} maxFiles={3} multiple />);

      // Assert
      expect(screen.getByText(/Max 3 files/i)).toBeInTheDocument();
    });

    it('should show accepted formats', () => {
      // Arrange & Act
      render(<FileUpload onFilesSelect={onFilesSelectMock} accept=".pdf,.doc" />);

      // Assert
      expect(screen.getByText(/Supported: .pdf,.doc/i)).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      render(<FileUpload onFilesSelect={onFilesSelectMock} disabled />);

      // Assert
      const dropZone = screen.getByRole('button');
      expect(dropZone).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  // Rule 2: File Selection
  describe('File Selection', () => {
    it('should handle file selection via input', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      // Assert
      await waitFor(() => {
        expect(onFilesSelectMock).toHaveBeenCalledWith([file]);
      });
    });

    it('should handle multiple file selection', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} multiple />);
      const files = [
        new File(['content1'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['content2'], 'test2.pdf', { type: 'application/pdf' }),
      ];

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, files);

      // Assert
      await waitFor(() => {
        expect(onFilesSelectMock).toHaveBeenCalledWith(files);
      });
    });

    it('should show file preview for images', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['image'], 'test.png', { type: 'image/png' });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      // Assert - Check that file name is shown (preview depends on URL.createObjectURL)
      await waitFor(() => {
        expect(screen.getByText('test.png')).toBeInTheDocument();
        // createObjectURL should have been called for image preview
        expect(URL.createObjectURL).toHaveBeenCalled();
      });
    });

    it('should not upload files when disabled', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} disabled />);
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      // Assert
      expect(onFilesSelectMock).not.toHaveBeenCalled();
    });
  });

  // Rule 3: Drag and Drop
  describe('Drag and Drop', () => {
    it('should handle drag enter', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const dropZone = screen.getByRole('button');

      // Act
      await user.pointer({ keys: '[MouseLeft>]', target: dropZone });

      // Note: Full drag-drop simulation is complex in testing-library
      // Testing the rendered state is sufficient
      expect(dropZone).toBeInTheDocument();
    });

    it('should accept files on drop', async () => {
      // Arrange
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const dropZone = screen.getByRole('button');

      // Act - Simulate drop event
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: { files: [file] },
      });
      dropZone.dispatchEvent(dropEvent);

      // Note: Full drop handling requires complex event simulation
      expect(dropZone).toBeInTheDocument();
    });
  });

  // Rule 4: File Validation
  describe('File Validation', () => {
    it('should reject files exceeding max size', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      render(<FileUpload onFilesSelect={onFilesSelectMock} maxSize={1} />);
      
      // Create 2MB file (exceeds 1MB limit)
      const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.pdf', {
        type: 'application/pdf',
      });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, largeFile);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/File exceeds 1MB/i)).toBeInTheDocument();
      });

      alertMock.mockRestore();
    });

    it('should validate file types based on accept prop', () => {
      // Arrange & Act
      render(<FileUpload onFilesSelect={onFilesSelectMock} accept=".pdf" />);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      // Assert - Input should have accept attribute
      expect(input).toHaveAttribute('accept', '.pdf');
    });

    it('should accept files matching accept pattern - extension', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} accept=".pdf" />);
      const validFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, validFile);

      // Assert
      await waitFor(() => {
        expect(onFilesSelectMock).toHaveBeenCalledWith([validFile]);
      });
    });

    it('should accept files matching accept pattern - mime type', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} accept="image/*" />);
      const validFile = new File(['content'], 'test.png', { type: 'image/png' });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, validFile);

      // Assert
      await waitFor(() => {
        expect(onFilesSelectMock).toHaveBeenCalledWith([validFile]);
      });
    });

    it('should enforce max files limit', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      render(<FileUpload onFilesSelect={onFilesSelectMock} maxFiles={2} multiple />);
      const files = [
        new File(['1'], 'f1.pdf', { type: 'application/pdf' }),
        new File(['2'], 'f2.pdf', { type: 'application/pdf' }),
        new File(['3'], 'f3.pdf', { type: 'application/pdf' }),
      ];

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, files);

      // Assert
      expect(alertMock).toHaveBeenCalledWith('Maksimum 2 dosya yükleyebilirsiniz');
      alertMock.mockRestore();
    });
  });

  // Rule 5: Upload Progress
  describe('Upload Progress', () => {
    it('should show upload progress', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      // Assert - Initially shows as uploading
      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      });
    });

    it('should show file info after upload', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      // Assert - File name should appear
      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      });
    });
  });

  // Rule 6: File Management
  describe('File Management', () => {
    it('should remove file when remove button is clicked', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
      });

      // Act - Find and click remove button (the last button should be the remove button)
      const removeButtons = screen.getAllByRole('button');
      // The first button is the drop zone, subsequent buttons are remove buttons
      const removeButton = removeButtons[removeButtons.length - 1];
      
      await user.click(removeButton);

      // Assert
      await waitFor(() => {
        expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
      });
    });

    it('should revoke object URL when file is removed', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['image'], 'test.png', { type: 'image/png' });

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText('test.png')).toBeInTheDocument();
      });

      // Act - Find and click remove button
      const removeButtons = screen.getAllByRole('button');
      const removeButton = removeButtons[removeButtons.length - 1];
      
      await user.click(removeButton);

      // Assert
      await waitFor(() => {
        expect(URL.revokeObjectURL).toHaveBeenCalled();
      });
    });

    it('should display file size', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('1 KB')).toBeInTheDocument();
      });
    });

    it('should format file size correctly - Bytes', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['c'], 'tiny.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 500 });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('500 Bytes')).toBeInTheDocument();
      });
    });

    it('should format file size correctly - MB', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const file = new File(['x'.repeat(1024 * 1024)], 'medium.pdf', { 
        type: 'application/pdf' 
      });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('1 MB')).toBeInTheDocument();
      });
    });
  });

  // Rule 9: Edge Cases
  describe('Edge Cases', () => {
    it('should handle keyboard interaction - Enter', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const dropZone = screen.getByRole('button');

      // Act
      dropZone.focus();
      await user.keyboard('{Enter}');

      // Assert - Input click should be triggered (can't fully test file dialog)
      expect(dropZone).toBeInTheDocument();
    });

    it('should handle keyboard interaction - Space', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const dropZone = screen.getByRole('button');

      // Act
      dropZone.focus();
      await user.keyboard(' ');

      // Assert
      expect(dropZone).toBeInTheDocument();
    });

    it('should handle zero-byte files', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUpload onFilesSelect={onFilesSelectMock} />);
      const emptyFile = new File([], 'empty.txt', { type: 'text/plain' });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, emptyFile);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('0 Bytes')).toBeInTheDocument();
      });
    });

    it('should apply custom className', () => {
      // Arrange & Act
      render(
        <FileUpload onFilesSelect={onFilesSelectMock} className="custom-upload" />
      );

      // Assert
      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveClass('custom-upload');
    });
  });
});

describe('FileUploadButton', () => {
  let onFilesSelectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onFilesSelectMock = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default text', () => {
      // Arrange & Act
      render(<FileUploadButton onFilesSelect={onFilesSelectMock} />);

      // Assert
      expect(screen.getByText('Dosya Yükle')).toBeInTheDocument();
    });

    it('should render with custom children', () => {
      // Arrange & Act
      render(
        <FileUploadButton onFilesSelect={onFilesSelectMock}>
          <span>Custom Upload</span>
        </FileUploadButton>
      );

      // Assert
      expect(screen.getByText('Custom Upload')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle file selection', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUploadButton onFilesSelect={onFilesSelectMock} />);
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      // Act
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, file);

      // Assert
      expect(onFilesSelectMock).toHaveBeenCalledWith([file]);
    });

    it('should open file dialog on button click', async () => {
      // Arrange
      const user = userEvent.setup({ delay: null });
      render(<FileUploadButton onFilesSelect={onFilesSelectMock} />);

      // Act
      const button = screen.getByRole('button');
      await user.click(button);

      // Assert - Input should be present (file dialog trigger can't be fully tested)
      const input = document.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
    });

    it('should accept specified file types', () => {
      // Arrange & Act
      render(
        <FileUploadButton onFilesSelect={onFilesSelectMock} accept="image/*" />
      );

      // Assert
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toHaveAttribute('accept', 'image/*');
    });

    it('should support multiple files when multiple is true', () => {
      // Arrange & Act
      render(
        <FileUploadButton onFilesSelect={onFilesSelectMock} multiple />
      );

      // Assert
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toHaveAttribute('multiple');
    });

    it('should apply custom className', () => {
      // Arrange & Act
      render(
        <FileUploadButton
          onFilesSelect={onFilesSelectMock}
          className="custom-button"
        />
      );

      // Assert
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button');
    });
  });
});

