// src/components/tools/AdvancedEditorToolbar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { MousePointer, Type, Trash2, Pen, Square, Image as ImageIcon, Highlighter, Hand } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditableObject } from '@/lib/pdf/edit';

export type ToolMode = 'select' | 'text' | 'image' | 'draw' | 'shape' | 'highlight';

interface AdvancedEditorToolbarProps {
  toolMode: ToolMode;
  onToolModeChange: (mode: ToolMode) => void;
  selectedObject: EditableObject | null;
  onObjectChange: (updatedObject: EditableObject) => void;
  onObjectDelete: () => void;
  onImageAdd: (file: File) => void;
}

export const AdvancedEditorToolbar = ({ 
  toolMode, onToolModeChange,
  selectedObject, onObjectChange, onObjectDelete, onImageAdd
}: AdvancedEditorToolbarProps) => {
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageAdd(e.target.files[0]);
    }
    e.target.value = '';
  };

  const toolButtonClass = (mode: ToolMode) => cn(
    "h-10 w-10 text-gray-600 hover:bg-gray-100",
    toolMode === mode && 'bg-gray-800 text-white hover:bg-gray-700'
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="flex items-center gap-1 p-1 border bg-white rounded-lg shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => onToolModeChange('select')} className={toolButtonClass('select')} aria-label="Select Tool"><Hand className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon" onClick={() => onToolModeChange('text')} className={toolButtonClass('text')} aria-label="Add Text"><Type className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()} aria-label="Add Image"><ImageIcon className="h-5 w-5" /></Button>
        <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg" className="hidden" />
        <Button variant="ghost" size="icon" onClick={() => onToolModeChange('draw')} className={toolButtonClass('draw')} aria-label="Draw"><Pen className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon" onClick={() => onToolModeChange('shape')} className={toolButtonClass('shape')} aria-label="Add Shape"><Square className="h-5 w-5" /></Button>
      </div>
    </div>
  );
};
