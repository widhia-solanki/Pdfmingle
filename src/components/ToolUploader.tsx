// src/components/tools/ToolUploader.tsx

import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { UploadCloud, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onProcess: () => void;
  acceptedFileTypes: { [key: string]: string[] };
  actionButtonText: string;
  selectedFile: File | null;
  error: string | null;
}

export const ToolUploader = ({ onFilesSelected, onProcess, acceptedFileTypes, actionButtonText, selectedFile, error }: ToolUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      // For simplicity, we just take the first file, as requested
      onFilesSelected([]);
    } else if (acceptedFiles.length > 0) {
      onFilesSelected([acceptedFiles[0]]);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false, // For simplicity, we process one file at a time
  });

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div
        {...getRootProps()}
        className={cn(
          'w-full border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          error ? 'border-red-500' : ''
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <UploadCloud className="w-16 h-16" />
          <p className="text-lg font-semibold">Drag & drop your file here, or click to browse</p>
          <p className="text-sm">
            Supported file types: {Object.values(acceptedFileTypes).flat().join(', ')}
          </p>
        </div>
      </div>

      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {selectedFile && (
        <div className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-3">
            <FileIcon className="w-6 h-6 text-gray-600" />
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-sm text-gray-500">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
          </div>
        </div>
      )}

      <Button
        size="lg"
        onClick={onProcess}
        disabled={!selectedFile}
        className="w-full md:w-auto px-12 py-6 text-lg font-bold bg-red-500 hover:bg-red-600"
      >
        {actionButtonText}
      </Button>
    </div>
  );
};
