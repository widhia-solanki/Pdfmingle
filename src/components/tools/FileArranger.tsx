// src/components/tools/FileArranger.tsx

import { Button } from '@/components/ui/button';
import { File as FileIcon, ArrowUp, ArrowDown, X } from 'lucide-react';

interface FileArrangerProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

export const FileArranger = ({ files, onFilesChange, onRemoveFile }: FileArrangerProps) => {
  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      // Simple swap
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      onFilesChange(newFiles);
    }
  };

  return (
    // --- THIS IS THE NEW DESIGN ---
    // A flex container to display cards horizontally, with wrapping for smaller screens
    <div className="flex flex-wrap items-center justify-center gap-4 p-4 border rounded-lg bg-gray-50 min-h-[12rem]">
      {files.map((file, index) => (
        <div key={index} className="w-40 h-48 flex flex-col items-center justify-between p-3 bg-white rounded-lg shadow-md border">
          {/* File Icon and Name */}
          <div className="flex flex-col items-center gap-2 text-center">
            <FileIcon className="w-10 h-10 text-gray-500" />
            <span className="font-medium text-sm break-all w-full">{file.name}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center w-full gap-1">
            <Button variant="outline" size="icon" onClick={() => moveFile(index, 'up')} disabled={index === 0} className="h-8 w-8">
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="h-8 w-8">
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onRemoveFile(index)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
