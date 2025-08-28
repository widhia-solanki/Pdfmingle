// src/components/tools/WatermarkPositionSelector.tsx

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface WatermarkPositionSelectorProps {
  position: Position;
  onPositionChange: (position: Position) => void;
}

const positions: { id: Position; label: string; cornerClass: string }[] = [
  { id: 'top-left', label: 'Top Left', cornerClass: 'top-1 left-1' },
  { id: 'top-right', label: 'Top Right', cornerClass: 'top-1 right-1' },
  { id: 'bottom-left', label: 'Bottom Left', cornerClass: 'bottom-1 left-1' },
  { id: 'bottom-right', label: 'Bottom Right', cornerClass: 'bottom-1 right-1' },
];

export const WatermarkPositionSelector = ({ position, onPositionChange }: WatermarkPositionSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label className="font-medium">Position:</Label>
      <div className="relative w-48 h-32 mx-auto bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm">PDF Preview</span>
        {positions.map(p => (
          <button
            key={p.id}
            onClick={() => onPositionChange(p.id)}
            className={cn(
              "absolute w-6 h-6 rounded-full border-2 border-gray-400 bg-white transition-all",
              p.cornerClass,
              position === p.id && "bg-blue-600 border-blue-800 ring-2 ring-offset-1 ring-blue-600"
            )}
            aria-label={p.label}
          />
        ))}
      </div>
      <RadioGroup value={position} onValueChange={(v: Position) => onPositionChange(v)} className="grid grid-cols-2 gap-2">
        {positions.map(p => (
          <div key={p.id} className="flex items-center space-x-2">
            <RadioGroupItem value={p.id} id={p.id} />
            <Label htmlFor={p.id} className="cursor-pointer">{p.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
