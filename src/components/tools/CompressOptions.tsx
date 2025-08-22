// src/components/tools/CompressOptions.tsx

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CompressionLevel = 'low' | 'medium' | 'high';

interface CompressOptionsProps {
  level: CompressionLevel;
  onLevelChange: (level: CompressionLevel) => void;
}

const levelToValue = (level: CompressionLevel): number => {
  if (level === 'low') return 0;
  if (level === 'medium') return 1;
  return 2;
};

const valueToLevel = (value: number): CompressionLevel => {
  if (value === 0) return 'low';
  if (value === 2) return 'high';
  return 'medium';
};

export const CompressOptions = ({ level, onLevelChange }: CompressOptionsProps) => {
  const sliderValue = levelToValue(level);

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border rounded-xl shadow-lg space-y-6">
      <h3 className="text-xl font-bold text-center text-gray-800">
        Level of Compression
      </h3>
      
      <div className="px-2 pt-4">
        {/* The Slider component from shadcn/ui */}
        <Slider
          defaultValue={[1]} // Start at Medium
          value={[sliderValue]}
          onValueChange={(value) => onLevelChange(valueToLevel(value[0]))}
          min={0}
          max={2}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-3 px-1">
          <Label className={cn("cursor-pointer", level === 'low' ? 'font-bold text-gray-800' : '')}>
            Basic Compress
          </Label>
          <Label className={cn("cursor-pointer", level === 'medium' ? 'font-bold text-gray-800' : '')}>
            Medium Compress
          </Label>
          <Label className={cn("cursor-pointer", level === 'high' ? 'font-bold text-gray-800' : '')}>
            High Compress
          </Label>
        </div>
      </div>
    </div>
  );
};
