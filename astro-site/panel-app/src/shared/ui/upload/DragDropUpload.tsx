/**
 * Drag & Drop File Upload Component
 * Modern file upload with preview and progress
 */
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image as _ImageIcon, X, CheckCircle, AlertCircle } from 'lucide-react';

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface DragDropUploadProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[];
  onFilesAdded?: (files: File[]) => void;
  onUploadComplete?: (files: UploadedFile[]) => void;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedFileTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx'],
  onFilesAdded,
  onUploadComplete,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    if (onFilesAdded) {
      onFilesAdded(acceptedFiles);
    }

    // Simulate upload progress
    newFiles.forEach(uploadedFile => {
      simulateUpload(uploadedFile.id);
    });
   
  // TODO: Callback with unknown dependencies
  }, [onFilesAdded]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
  });

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === fileId
            ? {
                ...f,
                progress,
                status: progress >= 100 ? 'completed' : 'uploading',
              }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        
        if (onUploadComplete) {
          setUploadedFiles(prev => {
            const completed = prev.filter(f => f.status === 'completed');
            onUploadComplete(completed);
            return prev;
          });
        }
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : isDragReject
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${
            isDragActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-slate-800'
          }`}>
            <Upload className={`w-8 h-8 ${
              isDragActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
            }`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              {isDragActive ? 'Dosyaları buraya bırakın' : 'Dosya yüklemek için tıklayın veya sürükleyin'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Maksimum {maxFiles} dosya, her biri {formatFileSize(maxSize)} boyutunda
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Yüklenen Dosyalar ({uploadedFiles.length})
          </h3>
          
          {uploadedFiles.map(uploadedFile => (
            <div
              key={uploadedFile.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
            >
              {/* File Icon/Preview */}
              <div className="flex-shrink-0">
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded flex items-center justify-center">
                    <File className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
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
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                {uploadedFile.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {uploadedFile.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(uploadedFile.id)}
                className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;


