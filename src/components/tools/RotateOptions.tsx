// src/components/tools/RotateOptions.tsx

import { Button } from '@/components/ui/button';
import { RotateCw, RotateCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';

// --- THIS IS THE FIX: Add the 'export' keyword ---
export type RotationDirection = 'right' | 'left';

interface RotateOptionsProps {
  onRotateDirectionSelect: (direction: RotationDirection) => void;
  selectedDirection: RotationDirection;
}

export const RotateOptions = ({ onRotateDirectionSelect, selectedDirection }: RotateOptionsProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-center text-gray-800">Choose Rotation Direction</h3>
      <div className="space-y-3">
        <div 
          className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border-2 ${selectedDirection === 'right' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          onClick={() => onRotateDirectionSelect('right')}
        >
          <RotateCw className="w-8 h-8 text-blue-600" />
          <Label htmlFor="right" className="text-lg font-medium">Rotate Right (Clockwise)</Label>
        </div>
        <div 
          className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border-2 ${selectedDirection === 'left' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          onClick={() => onRotateDirectionSelect('left')}
        >
          <RotateCcw className="w-8 h-8 text-blue-600" />
          <Label htmlFor="left" className="text-lg font-medium">Rotate Left (Counter-clockwise)</Label>
        </div>
      </div>
    </div>
  );
};
