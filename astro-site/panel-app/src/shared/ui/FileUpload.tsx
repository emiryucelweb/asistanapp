/**
 * Drag & Drop File Upload Component
 */
import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, File, X, Image, FileText, Video, Music, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

interface UploadedFile {
  file: File;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelect,
  accept,
  maxSize = 10, // 10MB default
  maxFiles = 5,
  multiple = true,
  disabled = false,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return t('fileUpload.fileSizeError', { maxSize });
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith('/*')) {
          return mimeType.startsWith(type.replace('/*', ''));
        }
        return mimeType === type;
      });

      if (!isAccepted) {
        return t('fileUpload.unsupportedFormat');
      }
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || disabled) return;

    const fileArray = Array.from(files);
    
    // Check max files
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      alert(`Maksimum ${maxFiles} dosya yükleyebilirsiniz`);
      return;
    }

    const validFiles: File[] = [];
    const newUploadedFiles: UploadedFile[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      
      if (error) {
        newUploadedFiles.push({
          file,
          status: 'error',
          progress: 0,
          error,
        });
      } else {
        validFiles.push(file);
        
        // Create preview for images
        let preview: string | undefined;
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file);
        }

        newUploadedFiles.push({
          file,
          preview,
          status: 'uploading',
          progress: 0,
        });
      }
    });

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    // Simulate upload progress
    newUploadedFiles.forEach((uploadedFile, index) => {
      if (uploadedFile.status === 'uploading') {
        simulateUpload(uploadedFiles.length + index);
      }
    });

    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    }
  };

  const simulateUpload = (index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setUploadedFiles(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            progress,
            status: progress >= 100 ? 'success' : 'uploading',
          };
        }
        return updated;
      });

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const updated = [...prev];
      // Revoke object URL if it exists
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview!);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('audio/')) return Music;
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`
          relative border-2 border-dashed rounded-xl p-8
          transition-all duration-200 cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <div className={`
            p-4 rounded-full mb-4
            ${isDragging
              ? 'bg-blue-100 dark:bg-blue-900/30'
              : 'bg-gray-100 dark:bg-slate-800'
            }
          `}>
            <Upload className={`
              w-8 h-8
              ${isDragging
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-400 dark:text-gray-500'
              }
            `} />
          </div>

          <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
            {isDragging ? t('fileUpload.dropFiles') : t('fileUpload.clickOrDrag')}
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {accept ? t('fileUpload.supportedFormats', { formats: accept }) : t('fileUpload.allFormatsSupported')}
            {' • '}
            {t('fileUpload.maxSize', { maxSize })}
            {multiple && ` • ${t('fileUpload.maxFiles', { maxFiles })}`}
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((uploadedFile, index) => {
            const FileIcon = getFileIcon(uploadedFile.file);
            
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
              >
                {/* Preview or Icon */}
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>

                  {/* Progress Bar */}
                  {uploadedFile.status === 'uploading' && (
                    <div className="mt-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadedFile.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {uploadedFile.error}
                    </p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Simple File Upload Button
interface FileUploadButtonProps {
  onFilesSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFilesSelect,
  accept,
  multiple = false,
  children,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(Array.from(e.target.files));
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={className}
      >
        {children || (
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            <span>Dosya Yükle</span>
          </div>
        )}
      </button>
    </>
  );
};

