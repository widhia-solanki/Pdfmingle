// src/components/tools/FileArranger.tsx

import { Button } from '@/components/ui/button';
import { File as FileIcon, ArrowUp, ArrowDown, X } from 'lucide-react';

interface FileArrangerProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const FileArranger = ({ files, onFilesChange }: FileArrangerProps) => {
  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      onFilesChange(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  return (
    <div className="w-full space-y-3">
      {files.map((file, index) => (
        <div key={file.name + index} className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="font-bold text-gray-500">{index + 1}.</span>
            <FileIcon className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <span className="font-medium truncate">{file.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'up')} disabled={index === 0}><ArrowUp className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1}><ArrowDown className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700"><X className="h-5 w-5" /></Button>
          </div>
        </div>
      ))}
    </div>
  );
};
