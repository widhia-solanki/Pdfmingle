// src/components/tools/FileArranger.tsx

import { Button } from '@/components/ui/button';
import { File as FileIcon, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface FileArrangerProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

export const FileArranger = ({ files, onFilesChange, onRemoveFile }: FileArrangerProps) => {
  const moveFile = (index: number, direction: 'left' | 'right') => {
    const newFiles = [...files];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      onFilesChange(newFiles);
    }
  };

  return (
    <div className="w-full space-y-3">
      {files.map((file, index) => (
        <div key={index} className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileIcon className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <span className="font-medium truncate">{file.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'left')} disabled={index === 0} className="h-8 w-8">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'right')} disabled={index === files.length - 1} className="h-8 w-8">
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onRemoveFile(index)} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
