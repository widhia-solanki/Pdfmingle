// src/components/tools/RotateOptions.tsx

import { Button } from '@/components/ui/button';
import { RotateCw, RotateCcw, FlipHorizontal } from 'lucide-react';

export type RotationAngle = 90 | 180 | 270;

interface RotateOptionsProps {
  onRotate: (angle: RotationAngle) => void;
}

export const RotateOptions = ({ onRotate }: RotateOptionsProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-center text-gray-800">Choose Rotation Angle</h3>
      <div className="grid grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="flex flex-col h-24"
          onClick={() => onRotate(270)} // 270 degrees is 90 counter-clockwise
        >
          <RotateCcw className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">90° Left</span>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col h-24"
          onClick={() => onRotate(180)}
        >
          <FlipHorizontal className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">180°</span>
        </Button>

        <Button 
          variant="outline" 
          className="flex flex-col h-24"
          onClick={() => onRotate(90)}
        >
          <RotateCw className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">90° Right</span>
        </Button>
      </div>
    </div>
  );
};
