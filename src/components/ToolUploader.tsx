// src/components/ToolUploader.tsx

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { UploadCloud, File as FileIcon, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onProcess: () => void;
  acceptedFileTypes: { [key: string]: string[] };
  actionButtonText: string;
  selectedFiles: File[];
  isMultiFile: boolean;
  error: string | null;
}

export const ToolUploader = ({ onFilesSelected, onProcess, acceptedFileTypes, actionButtonText, selectedFiles, isMultiFile, error }: ToolUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(isMultiFile ? [...selectedFiles, ...acceptedFiles] : acceptedFiles);
  }, [isMultiFile, selectedFiles, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: isMultiFile,
    noClick: true,
    noKeyboard: true,
  });

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    onFilesSelected(newFiles);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <div {...getRootProps()} className={cn('w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors', isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300', error && 'border-red-500 bg-red-50')}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <UploadCloud className="w-16 h-16" />
          <p className="text-lg font-semibold">Drag & drop files here</p>
          <p className="text-gray-400">- or -</p>
          <Button type="button" onClick={open} className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-6 rounded-lg">Select Files</Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="w-full space-y-2">
          <h3 className="font-semibold text-lg text-left">Selected Files:</h3>
          {selectedFiles.map((file, index) => (
            <div key={file.name + index} className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon className="w-6 h-6 text-gray-600 flex-shrink-0" />
                <span className="font-medium truncate">{file.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8"><X className="h-5 w-5" /></Button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && !error && (
          <Button size="lg" onClick={onProcess} className="w-full md:w-auto px-12 py-6 text-lg font-bold bg-red-500 hover:bg-red-600 mt-4">
            {actionButtonText}
          </Button>
      )}
    </div>
  );
};
