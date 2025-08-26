// src/components/tools/EditorToolbar.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MousePointer, Type, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextObject } from '@/lib/pdf/edit';

export type EditMode = 'select' | 'text';

interface EditorToolbarProps {
  mode: EditMode;
  onModeChange: (mode: EditMode) => void;
  selectedObject: TextObject | null;
  onObjectChange: (updatedObject: TextObject) => void;
  onObjectDelete: () => void;
}

export const EditorToolbar = ({ 
  mode, 
  onModeChange, 
  selectedObject, 
  onObjectChange,
  onObjectDelete
}: EditorToolbarProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 border rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onModeChange('select')}
          className={cn(mode === 'select' && 'bg-blue-200')}
          aria-label="Select Tool"
        >
          <MousePointer className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onModeChange('text')}
          className={cn(mode === 'text' && 'bg-blue-200')}
          aria-label="Add Text Tool"
        >
          <Type className="h-5 w-5" />
        </Button>
      </div>

      {/* Show text editing options only when a text object is selected */}
      {selectedObject && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="font-size">Size:</Label>
            <Input
              id="font-size"
              type="number"
              className="w-20"
              value={selectedObject.size}
              onChange={(e) => onObjectChange({ ...selectedObject, size: parseInt(e.target.value) || 12 })}
            />
          </div>
           <Button variant="destructive" size="icon" onClick={onObjectDelete} aria-label="Delete selected object">
             <Trash2 className="h-5 w-5"/>
           </Button>
        </div>
      )}
    </div>
  );
};
