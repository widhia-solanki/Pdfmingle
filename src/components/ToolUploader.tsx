import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolUploaderProps {
  onFilesSelected: (files: File[]) => void;
  isMultiFile: boolean;
}

export const ToolUploader = ({ onFilesSelected, isMultiFile }: ToolUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: isMultiFile,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div {...getRootProps()} className={cn('w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors', isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300')}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-gray-500">
        <UploadCloud className="w-16 h-16" />
        <p className="text-lg font-semibold">Drag & drop files here</p>
        <p className="text-gray-400">- or -</p>
        <Button type="button" onClick={open} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
          Select Files
        </Button>
      </div>
    </div>
  );
};
