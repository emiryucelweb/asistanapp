/**
 * File Upload Manager Component
 * Multi-file upload with progress tracking and preview
 */
import React, { useState, useCallback } from 'react';
import { Upload, X, File, Image as ImageIcon, Video, FileText, Check, AlertCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadManagerProps {
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  onUploadComplete?: (files: File[]) => void;
}

const FileUploadManager: React.FC<FileUploadManagerProps> = ({
  accept = '*/*',
  maxSize = 10, // 10MB default
  maxFiles = 5,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const simulateUpload = async (fileId: string) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ));
    }
    
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'completed' as const } : f
    ));
  };

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file, index) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        const errorFile: UploadedFile = {
          id: `${Date.now()}-${index}`,
          file,
          progress: 0,
          status: 'error',
          error: `Dosya boyutu ${maxSize}MB'dan büyük olamaz`,
        };
        newFiles.push(errorFile);
        return;
      }

      // Check max files limit
      if (files.length + newFiles.length >= maxFiles) {
        return;
      }

      const uploadFile: UploadedFile = {
        id: `${Date.now()}-${index}`,
        file,
        progress: 0,
        status: 'uploading',
      };

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id ? { ...f, preview: reader.result as string } : f
          ));
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadFile);
      
      // Start upload simulation
      simulateUpload(uploadFile.id);
    });

    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, maxFiles, maxSize]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      processFiles(fileList);
    }
    e.target.value = ''; // Reset input
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const fileList = e.dataTransfer.files;
    if (fileList) {
      processFiles(fileList);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
    if (file.type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const completedFiles = files.filter(f => f.status === 'completed').map(f => f.file);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={files.length >= maxFiles}
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
          </div>
          
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {isDragging ? 'Dosyaları buraya bırakın' : 'Dosya yüklemek için tıklayın veya sürükleyin'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Maksimum {maxFiles} dosya, dosya başına {maxSize}MB
            </p>
          </div>

          <label
            htmlFor="file-upload"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Dosya Seç
          </label>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Yüklenen Dosyalar ({files.length}/{maxFiles})
          </h3>
          
          <div className="space-y-2">
            {files.map(uploadedFile => (
              <div
                key={uploadedFile.id}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
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
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                      {getFileIcon(uploadedFile.file)}
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
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {uploadedFile.progress}%
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadedFile.status === 'error' && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      {uploadedFile.error}
                    </div>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.status === 'completed' && (
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                  {uploadedFile.status === 'error' && (
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(uploadedFile.id)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Upload All Button */}
          {completedFiles.length > 0 && (
            <button
              onClick={() => onUploadComplete?.(completedFiles)}
              className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {completedFiles.length} Dosyayı Onayla
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadManager;

