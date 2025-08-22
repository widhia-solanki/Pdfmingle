// src/components/tools/CompressOptions.tsx

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CompressionLevel = 'low' | 'medium' | 'high';

interface CompressOptionsProps {
  level: CompressionLevel;
  onLevelChange: (level: CompressionLevel) => void;
}

const levels: CompressionLevel[] = ['low', 'medium', 'high'];
const levelLabels = {
  low: 'Basic Compress',
  medium: 'Medium Compress',
  high: 'High Compress',
};

export const CompressOptions = ({ level, onLevelChange }: CompressOptionsProps) => {
  const currentIndex = levels.indexOf(level);

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border rounded-xl shadow-lg space-y-6">
      <h3 className="text-xl font-bold text-center text-gray-800">
        Level of Compression
      </h3>
      
      <div className="px-2 pt-4">
        <input
          type="range"
          min="0"
          max="2"
          step="1"
          value={currentIndex}
          onChange={(e) => onLevelChange(levels[parseInt(e.target.value, 10)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-3 px-1">
          {levels.map((lvl) => (
            <Label key={lvl} className={cn("cursor-pointer", level === lvl ? 'font-bold text-gray-800' : '')}>
              {levelLabels[lvl]}
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
};
