// src/components/tools/AdvancedEditorToolbar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { MousePointer, Type, Pen, Square, Image as ImageIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditableObject } from '@/lib/pdf/edit';

export type MainMode = 'annotate' | 'edit';
export type ToolMode = 'select' | 'text' | 'image' | 'draw' | 'shape';

interface AdvancedEditorToolbarProps {
  mainMode: MainMode;
  onMainModeChange: (mode: MainMode) => void;
  toolMode: ToolMode;
  onToolModeChange: (mode: ToolMode) => void;
  selectedObject: EditableObject | null;
  onObjectDelete: () => void;
  onImageAdd: (file: File) => void;
}

export const AdvancedEditorToolbar = ({ 
  mainMode, onMainModeChange, 
  toolMode, onToolModeChange,
  selectedObject, onObjectDelete, onImageAdd
}: AdvancedEditorToolbarProps) => {
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageAdd(e.target.files[0]);
    }
    e.target.value = '';
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white border-b">
      {/* Left Side: Main Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
        <Button 
          onClick={() => onMainModeChange('annotate')}
          className={cn("font-semibold", mainMode === 'annotate' ? 'bg-white shadow-sm' : 'bg-transparent text-gray-600')}
        >
          <Pen className="mr-2 h-4 w-4" /> Annotate
        </Button>
        <Button 
          onClick={() => onMainModeChange('edit')}
          className={cn("font-semibold", mainMode === 'edit' ? 'bg-white shadow-sm' : 'bg-transparent text-gray-600')}
        >
          <Type className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      {/* Center: Tool Selection */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
        {mainMode === 'edit' && (
          <>
            <Button variant="ghost" size="icon" onClick={() => onToolModeChange('select')} className={cn(toolMode === 'select' && 'bg-blue-200')} aria-label="Select Tool"><MousePointer className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onToolModeChange('text')} className={cn(toolMode === 'text' && 'bg-blue-200')} aria-label="Add Text"><Type className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()} aria-label="Add Image"><ImageIcon className="h-5 w-5" /></Button>
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg" className="hidden" />
          </>
        )}
        {mainMode === 'annotate' && (
          <>
            <Button variant="ghost" size="icon" onClick={() => onToolModeChange('draw')} className={cn(toolMode === 'draw' && 'bg-blue-200')} aria-label="Draw"><Pen className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onToolModeChange('shape')} className={cn(toolMode === 'shape' && 'bg-blue-200')} aria-label="Add Shape" disabled><Square className="h-5 w-5" /></Button>
          </>
        )}
      </div>
      
      {/* Right Side: Contextual Actions */}
      <div className="flex items-center gap-4">
        {selectedObject && (
          <Button variant="destructive" size="icon" onClick={onObjectDelete} aria-label="Delete selected object">
            <Trash2 className="h-5 w-5"/>
          </Button>
        )}
      </div>
    </div>
  );
};
