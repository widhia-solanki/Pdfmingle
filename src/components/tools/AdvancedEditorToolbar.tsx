// src/components/tools/AdvancedEditorToolbar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MousePointer, Type, Trash2, Pen, Square, Image as ImageIcon, Highlighter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditableObject } from '@/lib/pdf/edit';

export type MainMode = 'annotate' | 'edit';
export type ToolMode = 'select' | 'text' | 'image' | 'draw' | 'shape' | 'highlight';

interface AdvancedEditorToolbarProps {
  mainMode: MainMode;
  onMainModeChange: (mode: MainMode) => void;
  toolMode: ToolMode;
  onToolModeChange: (mode: ToolMode) => void;
  selectedObject: EditableObject | null;
  onObjectChange: (updatedObject: EditableObject) => void;
  onObjectDelete: () => void;
  onImageAdd: (file: File) => void;
}

export const AdvancedEditorToolbar = ({ 
  mainMode, onMainModeChange, 
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

  const textObject = selectedObject?.type === 'text' ? selectedObject : null;
  const shapeObject = selectedObject?.type === 'shape' ? selectedObject : null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-1">
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
        <Button onClick={() => onMainModeChange('annotate')} className={cn("font-semibold", mainMode === 'annotate' ? 'bg-white shadow-sm' : 'bg-transparent text-gray-600')}><Pen className="mr-2 h-4 w-4" /> Annotate</Button>
        <Button onClick={() => onMainModeChange('edit')} className={cn("font-semibold", mainMode === 'edit' ? 'bg-white shadow-sm' : 'bg-transparent text-gray-600')}><Type className="mr-2 h-4 w-4" /> Edit</Button>
      </div>

      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
        {mainMode === 'edit' && (
          <>
            <Button variant="ghost" size="icon" onClick={() => onToolModeChange('select')} className={cn(toolMode === 'select' && 'bg-blue-200')} aria-label="Select"><MousePointer className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onToolModeChange('text')} className={cn(toolMode === 'text' && 'bg-blue-200')} aria-label="Add Text"><Type className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()} aria-label="Add Image"><ImageIcon className="h-5 w-5" /></Button>
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg" className="hidden" />
          </>
        )}
        {mainMode === 'annotate' && (
          <>
            <Button variant="ghost" size="icon" onClick={() => onToolModeChange('draw')} className={cn(toolMode === 'draw' && 'bg-blue-200')} aria-label="Draw"><Pen className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onToolModeChange('highlight')} className={cn(toolMode === 'highlight' && 'bg-blue-200')} aria-label="Highlight"><Highlighter className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onToolModeChange('shape')} className={cn(toolMode === 'shape' && 'bg-blue-200')} aria-label="Add Shape"><Square className="h-5 w-5" /></Button>
          </>
        )}
      </div>
      
      {selectedObject && (
        <div className="flex items-center gap-4">
          {shapeObject && (
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
              <Label className="text-sm px-1">Fill:</Label>
              <input type="color" value={`#${shapeObject.fillColor.r.toString(16).padStart(2, '0')}${shapeObject.fillColor.g.toString(16).padStart(2, '0')}${shapeObject.fillColor.b.toString(16).padStart(2, '0')}`}
                onChange={(e) => {
                    const r = parseInt(e.target.value.slice(1, 3), 16);
                    const g = parseInt(e.target.value.slice(3, 5), 16);
                    const b = parseInt(e.target.value.slice(5, 7), 16);
                    onObjectChange({ ...shapeObject, fillColor: { ...shapeObject.fillColor, r, g, b } });
                }}
                className="w-8 h-8 p-0 border-none cursor-pointer bg-transparent"
              />
              <Label className="text-sm px-1">Border:</Label>
              <input type="color" value={`#${shapeObject.borderColor.r.toString(16).padStart(2, '0')}${shapeObject.borderColor.g.toString(16).padStart(2, '0')}${shapeObject.borderColor.b.toString(16).padStart(2, '0')}`}
                onChange={(e) => {
                    const r = parseInt(e.target.value.slice(1, 3), 16);
                    const g = parseInt(e.target.value.slice(3, 5), 16);
                    const b = parseInt(e.target.value.slice(5, 7), 16);
                    onObjectChange({ ...shapeObject, borderColor: { r, g, b } });
                }}
                className="w-8 h-8 p-0 border-none cursor-pointer bg-transparent"
              />
            </div>
          )}
          <Button variant="destructive" size="icon" onClick={onObjectDelete} aria-label="Delete selected object">
            <Trash2 className="h-5 w-5"/>
          </Button>
        </div>
      )}
    </div>
  );
};
