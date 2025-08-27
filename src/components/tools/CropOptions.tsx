// src/components/tools/CropOptions.tsx

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type CropMode = 'current' | 'all';

interface CropOptionsProps {
  mode: CropMode;
  onModeChange: (mode: CropMode) => void;
  onReset: () => void;
}

export const CropOptions = ({ mode, onModeChange, onReset }: CropOptionsProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Pages:</h3>
        <Button variant="link" className="text-blue-600 p-0 h-auto" onClick={onReset}>
          Reset all
        </Button>
      </div>
      <RadioGroup value={mode} onValueChange={onModeChange} className="space-y-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all-pages" />
          <Label htmlFor="all-pages" className="cursor-pointer">All pages</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="current" id="current-page" />
          <Label htmlFor="current-page" className="cursor-pointer">Current page</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
