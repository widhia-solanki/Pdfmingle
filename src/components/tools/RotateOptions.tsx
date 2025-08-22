// src/components/tools/RotateOptions.tsx

import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

interface RotateOptionsProps {
  onRotate: () => void; // A simple function to trigger a rotation
}

export const RotateOptions = ({ onRotate }: RotateOptionsProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-center text-gray-800">Rotation</h3>
      <div className="flex justify-center">
        <Button 
          onClick={onRotate}
          className="flex items-center gap-2 px-6 py-4 text-lg bg-blue-600 hover:bg-blue-700"
        >
          <RotateCw className="w-6 h-6" />
          <span>Rotate 90° Right</span>
        </Button>
      </div>
       <p className="text-sm text-center text-gray-500 pt-2">
        Click the button to rotate the entire document. The preview will update instantly.
      </p>
    </div>
  );
};
