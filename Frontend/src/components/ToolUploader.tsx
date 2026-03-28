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
      <div 
        {...getRootProps()} 
        className={cn(
          'w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors flex flex-col items-center justify-center min-h-[250px]', 
          // THE FIX: Use theme variables for border and background colors
          isDragActive ? 'border-primary bg-primary/10' : 'border-border bg-card', 
          error && 'border-destructive bg-destructive/10'
        )}
      >
        <input {...getInputProps()} />
        
        {error ? (
          <div className="flex flex-col items-center gap-4 text-destructive-foreground">
            <AlertTriangle className="w-16 h-16" />
            <p className="text-lg font-semibold">Upload Failed</p>
            <p className="text-base">{error}</p>
          </div>
        ) : (
          // THE FIX: Use `text-muted-foreground` for better contrast
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <UploadCloud className="w-16 h-16" />
            <p className="text-lg font-semibold">Drag & drop files here</p>
            <p className="text-sm">- or -</p>
            <Button type="button" onClick={open} className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3 px-6 rounded-lg">Select Files</Button>
          </div>
        )}
      </div>

      {selectedFiles.length > 0 && !error && (
        <div className="w-full space-y-2">
          <h3 className="font-semibold text-lg text-left text-foreground">Selected Files:</h3>
          {selectedFiles.map((file, index) => (
            // THE FIX: Use `bg-secondary` and `text-foreground` for the file list items
            <div key={file.name + index} className="w-full flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                <span className="font-medium truncate text-foreground">{file.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></Button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && !error && actionButtonText && (
          <Button size="lg" onClick={onProcess} className="w-full md:w-auto px-12 py-6 text-lg font-bold bg-red-500 hover:bg-red-600 mt-4">
            {actionButtonText}
          </Button>
      )}
    </div>
  );
};
