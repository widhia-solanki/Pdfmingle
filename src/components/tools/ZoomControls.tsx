// src/components/tools/ZoomControls.tsx

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const ZoomControls = ({ zoom, onZoomChange }: ZoomControlsProps) => {
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 text-white rounded-lg shadow-lg">
      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}>
        <ZoomOut className="h-5 w-5" />
      </Button>
      <Slider
        value={[zoomPercentage]}
        onValueChange={(value) => onZoomChange(value[0] / 100)}
        min={25}
        max={200}
        step={25}
        className="w-32"
      />
      <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700" onClick={() => onZoomChange(Math.min(2, zoom + 0.25))}>
        <ZoomIn className="h-5 w-5" />
      </Button>
      <div className="w-16 text-center font-semibold text-sm">{zoomPercentage}%</div>
    </div>
  );
};
