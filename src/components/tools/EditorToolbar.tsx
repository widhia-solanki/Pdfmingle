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

// --- THIS IS THE FIX ---
// The full, correct interface is now defined.
interface EditorToolbarProps {
  mode: EditMode;
  onModeChange: (mode: EditMode) => void;
  selectedObject: EditableObject | null;
  onObjectChange: (updatedObject: EditableObject) => void;
  onObjectDelete: () => void;
  onImageAdd: (file: File) => void;
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

      {selectedObject?.type === 'text' && (
        <div className="flex flex-wrap items-center gap-4">
          <Select 
            value={selectedObject.font}
            onValueChange={(font) => onObjectChange({ ...selectedObject, font })}
          >
            <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="TimesRoman">Times New Roman</SelectItem>
              <SelectItem value="Courier">Courier</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="font-size" className="text-sm">Size:</Label>
            <Input
              id="font-size"
              type="number"
              className="w-20 h-9"
              value={selectedObject.size}
              onChange={(e) => onObjectChange({ ...selectedObject, size: parseInt(e.target.value) || 12 })}
            />
          </div>
          
          <Button variant="destructive" size="icon" onClick={onObjectDelete} aria-label="Delete selected object">
             <Trash2 className="h-5 w-5"/>
           </Button>
        </div>
      )}
      
      {selectedObject?.type === 'image' && (
         <div className="flex items-center gap-4">
            <p className="text-sm font-medium">Image Selected</p>
            <Button variant="destructive" size="icon" onClick={onObjectDelete} aria-label="Delete selected object">
             <Trash2 className="h-5 w-5"/>
           </Button>
         </div>
      )}
    </div>
  );
};
