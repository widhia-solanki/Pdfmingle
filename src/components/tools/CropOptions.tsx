// src/components/tools/CropOptions.tsx

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileSearch, Layers } from 'lucide-react';
import { cn } from "@/lib/utils";

export type CropMode = 'current' | 'all';

interface CropOptionsProps {
  mode: CropMode;
  onModeChange: (mode: CropMode) => void;
  currentPage: number;
}

export const CropOptions = ({ mode, onModeChange, currentPage }: CropOptionsProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
       <h3 className="text-lg font-semibold text-gray-700">Apply Crop To:</h3>
      <ToggleGroup 
        type="single" 
        value={mode} 
        onValueChange={(value: CropMode) => value && onModeChange(value)}
        className="bg-white p-1 rounded-lg border shadow-sm"
      >
        <ToggleGroupItem value="current" aria-label="Crop current page" className={cn("px-4 py-2 text-sm rounded-md data-[state=on]:bg-red-500 data-[state=on]:text-white")}>
          <FileSearch className="h-4 w-4 mr-2"/>
          Current Page ({currentPage + 1})
        </ToggleGroupItem>
        <ToggleGroupItem value="all" aria-label="Crop all pages" className={cn("px-4 py-2 text-sm rounded-md data-[state=on]:bg-red-500 data-[state=on]:text-white")}>
          <Layers className="h-4 w-4 mr-2"/>
          All Pages
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
