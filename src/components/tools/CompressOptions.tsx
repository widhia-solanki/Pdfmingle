// src/components/tools/CompressOptions.tsx

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Feather, Scale, Rocket } from "lucide-react"; // Import icons

export type CompressionLevel = 'low' | 'medium' | 'high';

interface CompressOptionsProps {
  level: CompressionLevel;
  onLevelChange: (level: CompressionLevel) => void;
}

// Data structure for our levels to keep everything organized
const levels = [
  { id: 'low', label: 'Basic Compress', Icon: Feather, color: 'text-green-500', value: 0 },
  { id: 'medium', label: 'Medium Compress', Icon: Scale, color: 'text-yellow-500', value: 1 },
  { id: 'high', label: 'High Compress', Icon: Rocket, color: 'text-red-500', value: 2 },
] as const;

const levelToValue = (level: CompressionLevel): number => levels.find(l => l.id === level)?.value ?? 1;
const valueToLevel = (value: number): CompressionLevel => levels.find(l => l.value === value)?.id ?? 'medium';

export const CompressOptions = ({ level, onLevelChange }: CompressOptionsProps) => {
  const sliderValue = levelToValue(level);
  const activeLevel = levels[sliderValue];

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800">
          Level of Compression
        </h3>
        {/* Tooltip-like indicator for the current level */}
        <p className={cn("mt-2 text-lg font-semibold transition-colors", activeLevel.color)}>
            {activeLevel.label}
        </p>
      </div>
      
      <div className="px-2 pt-4">
        {/* The Slider component from shadcn/ui */}
        <Slider
          value={[sliderValue]}
          onValueChange={(value) => onLevelChange(valueToLevel(value[0]))}
          min={0}
          max={2}
          step={1}
          className="w-full"
        />
        {/* Labels with icons */}
        <div className="flex justify-between text-sm text-gray-500 mt-4 px-1">
          {levels.map((lvl) => (
            <div 
              key={lvl.id} 
              className={cn(
                "flex flex-col items-center gap-2 cursor-pointer transition-all", 
                level === lvl.id ? "font-bold text-gray-800 scale-105" : "hover:text-gray-700"
              )}
              onClick={() => onLevelChange(lvl.id)}
            >
              <lvl.Icon className={cn("h-6 w-6", level === lvl.id ? lvl.color : 'text-gray-400')} />
              <span>{lvl.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
