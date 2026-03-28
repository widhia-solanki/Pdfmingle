// src/components/tools/WatermarkPositionSelector.tsx

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface WatermarkPositionSelectorProps {
  position: Position;
  onPositionChange: (position: Position) => void;
}

const positions: { id: Position; label: string; class: string }[] = [
  { id: 'top-left', label: 'Top Left', class: 'top-1 left-1' },
  { id: 'top-right', label: 'Top Right', class: 'top-1 right-1' },
  { id: 'center', label: 'Center', class: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },
  { id: 'bottom-left', label: 'Bottom Left', class: 'bottom-1 left-1' },
  { id: 'bottom-right', label: 'Bottom Right', class: 'bottom-1 right-1' },
];

export const WatermarkPositionSelector = ({ position, onPositionChange }: WatermarkPositionSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="font-medium">Position</Label>
      <div className="relative w-full h-32 mx-auto bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        {positions.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPositionChange(p.id)}
            className={cn(
              "absolute w-5 h-5 rounded-full border-2 border-primary/50 bg-background transition-all hover:bg-primary/20",
              p.class,
              position === p.id && "bg-primary border-primary-foreground ring-2 ring-offset-2 ring-primary"
            )}
            aria-label={p.label}
          />
        ))}
      </div>
    </div>
  );
};
