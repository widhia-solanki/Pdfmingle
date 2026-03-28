// src/components/tools/HistoryPanel.tsx

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EditableObject } from "@/lib/pdf/edit";
import { Type, Image, Pen, Square, Trash2 } from "lucide-react";

interface HistoryPanelProps {
  objects: EditableObject[];
  onObjectSelect: (object: EditableObject) => void;
  onObjectDelete: (id: string) => void;
}

const getIcon = (type: EditableObject['type']) => {
  switch(type) {
    case 'text': return <Type className="h-4 w-4" />;
    case 'image': return <Image className="h-4 w-4" />;
    case 'drawing': return <Pen className="h-4 w-4" />;
    case 'highlight': return <Pen className="h-4 w-4" />;
    case 'shape': return <Square className="h-4 w-4" />;
  }
}

export const HistoryPanel = ({ objects, onObjectSelect, onObjectDelete }: HistoryPanelProps) => {
  return (
    <div className="w-72 flex-shrink-0 bg-white p-4 border-l flex flex-col">
      <h2 className="text-xl font-bold mb-4">Edit History</h2>
      <ScrollArea className="flex-grow">
        <div className="space-y-2">
          {objects.map((obj) => (
            <div 
              key={obj.id} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => onObjectSelect(obj)}
            >
              <div className="flex items-center gap-2">
                {getIcon(obj.type)}
                <span className="text-sm font-medium">
                  {obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onObjectDelete(obj.id); }}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          {objects.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">Your edits will appear here.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
