// src/components/tools/CompressOptions.tsx

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type CompressionLevel = 'low' | 'medium' | 'high';

interface CompressOptionsProps {
  level: CompressionLevel;
  onLevelChange: (level: CompressionLevel) => void;
}

export const CompressOptions = ({ level, onLevelChange }: CompressOptionsProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-center text-gray-800">Choose Compression Level</h3>
      <RadioGroup value={level} onValueChange={(value) => onLevelChange(value as CompressionLevel)}>
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
          <RadioGroupItem value="low" id="low" />
          <Label htmlFor="low" className="flex flex-col cursor-pointer">
            <span className="font-semibold">Low Compression</span>
            <span className="text-sm text-gray-500">Larger file size, best image quality.</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
          <RadioGroupItem value="medium" id="medium" />
          <Label htmlFor="medium" className="flex flex-col cursor-pointer">
            <span className="font-semibold">Recommended Compression</span>
            <span className="text-sm text-gray-500">Good balance between file size and quality.</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
          <RadioGroupItem value="high" id="high" />
          <Label htmlFor="high" className="flex flex-col cursor-pointer">
            <span className="font-semibold">High Compression</span>
            <span className="text-sm text-gray-500">Smallest file size, reduced image quality.</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
