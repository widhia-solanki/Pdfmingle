// src/components/tools/EditorToolbar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MousePointer, Type, Trash2, Pen, Square, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditableObject } from '@/lib/pdf/edit';

export type EditMode = 'select' | 'text' | 'draw' | 'shape' | 'image';

interface EditorToolbarProps {
  // ... (interface props remain the same)
}

export const EditorToolbar = ({ 
  mode, 
  onModeChange, 
  selectedObject, 
  onObjectChange,
  onObjectDelete,
  onImageAdd
}: EditorToolbarProps) => {
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageAdd(e.target.files[0]);
    }
    e.target.value = '';
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
        <Button variant="ghost" size="icon" onClick={() => onModeChange('select')} className={cn(mode === 'select' && 'bg-blue-200')} aria-label="Select Tool">
          <MousePointer className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onModeChange('text')} className={cn(mode === 'text' && 'bg-blue-200')} aria-label="Add Text Tool">
          <Type className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()} aria-label="Add Image Tool">
          <ImageIcon className="h-5 w-5" />
        </Button>
        <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg" className="hidden" />
        
        <Button variant="ghost" size="icon" onClick={() => onModeChange('draw')} className={cn(mode === 'draw' && 'bg-blue-200')} aria-label="Draw Tool">
          <Pen className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onModeChange('shape')} className={cn(mode === 'shape' && 'bg-blue-200')} aria-label="Add Shape Tool" disabled>
          <Square className="h-5 w-5" />
        </Button>
      </div>

      {/* ... (rest of the component is the same as before) ... */}
    </div>
  );
};
