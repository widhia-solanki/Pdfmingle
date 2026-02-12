// src/components/tools/FileArranger.tsx

import { Button } from '@/components/ui/button';
import { File as FileIcon, ArrowUp, ArrowDown, X, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(result.source.index, 1);
    newFiles.splice(result.destination.index, 0, moved);
    onFilesChange(newFiles);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="file-list">
        {(provided) => (
          <div
            className="w-full space-y-3"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {files.map((file, index) => {
              const id = `${file.name}-${file.lastModified}-${index}`;
              return (
                <Draggable key={id} draggableId={id} index={index}>
                  {(dragProvided, snapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className={[
                        "w-full flex items-center justify-between p-3 bg-card border border-border rounded-lg shadow-sm",
                        "transition-shadow",
                        snapshot.isDragging ? "shadow-md ring-2 ring-ring" : ""
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <span className="font-bold text-muted-foreground">{index + 1}.</span>
                        <span
                          className="text-muted-foreground flex-shrink-0 cursor-grab active:cursor-grabbing"
                          aria-label="Drag to reorder"
                          {...dragProvided.dragHandleProps}
                        >
                          <GripVertical className="h-5 w-5" />
                        </span>
                        <FileIcon className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium text-foreground truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'up')} disabled={index === 0}><ArrowUp className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1}><ArrowDown className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700"><X className="h-5 w-5" /></Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
