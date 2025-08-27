// src/components/tools/BottomControls.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoomIn, ZoomOut, ChevronUp, ChevronDown } from 'lucide-react';

interface BottomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const BottomControls = ({ zoom, onZoomChange, currentPage, pageCount, onPageChange }: BottomControlsProps) => {
  const zoomPercentage = Math.round(zoom * 100);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= pageCount) {
      onPageChange(value - 1);
    }
  };

  return (
    <div className="flex items-center gap-4 p-2 bg-gray-800 text-white rounded-lg shadow-lg">
      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={() => onPageChange(Math.max(0, currentPage - 1))}>
        <ChevronUp className="h-5 w-5" />
      </Button>
      <div className="flex items-center">
        <Input
          type="number"
          value={currentPage + 1}
          onChange={handlePageInputChange}
          className="w-12 h-8 text-center bg-gray-700 border-gray-600 text-white"
        />
        <span className="mx-2">/</span>
        <span>{pageCount}</span>
      </div>
      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={() => onPageChange(Math.min(pageCount - 1, currentPage + 1))}>
        <ChevronDown className="h-5 w-5" />
      </Button>
      
      <div className="w-px h-6 bg-gray-600 mx-2"></div>

      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}>
        <ZoomOut className="h-5 w-5" />
      </Button>
      <span className="w-16 text-center font-semibold text-sm">{zoomPercentage}%</span>
      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={() => onZoomChange(Math.min(2.5, zoom + 0.1))}>
        <ZoomIn className="h-5 w-5" />
      </Button>
    </div>
  );
};
