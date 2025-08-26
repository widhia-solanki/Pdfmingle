// src/components/tools/EditorToolbar.tsx

import { Button } from '@/components/ui/button';
import { MousePointer, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EditMode = 'select' | 'text';

interface EditorToolbarProps {
  mode: EditMode;
  onModeChange: (mode: EditMode) => void;
}

export const EditorToolbar = ({ mode, onModeChange }: EditorToolbarProps) => {
  return (
    <div className="flex items-center justify-center p-2 bg-gray-100 border rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onModeChange('select')}
          className={cn(mode === 'select' && 'bg-gray-300')}
          aria-label="Select Tool"
        >
          <MousePointer className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onModeChange('text')}
          className={cn(mode === 'text' && 'bg-gray-300')}
          aria-label="Add Text Tool"
        >
          <Type className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
