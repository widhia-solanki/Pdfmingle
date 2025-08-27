// src/components/tools/MarginCropControls.tsx

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MarginInput } from "./MarginInput";
import { MarginState } from "@/lib/pdf/crop";

export type CropMode = 'current' | 'all';

interface MarginCropControlsProps {
  margins: MarginState;
  onMarginsChange: (newMargins: MarginState) => void;
  mode: CropMode;
  onModeChange: (mode: CropMode) => void;
  onReset: () => void;
  pageDimensions: { width: number; height: number };
}

export const MarginCropControls = ({ margins, onMarginsChange, mode, onModeChange, onReset, pageDimensions }: MarginCropControlsProps) => {
  
  const handleMarginChange = (field: keyof Omit<MarginState, 'unit'>, value: number) => {
    onMarginsChange({ ...margins, [field]: value });
  };

  const handleUnitChange = (unit: 'px' | '%') => {
    if (unit) {
      onMarginsChange({ ...margins, unit });
    }
  };

  const getMax = (direction: 'horizontal' | 'vertical') => {
    if (margins.unit === '%') return 50;
    return direction === 'horizontal' ? Math.floor(pageDimensions.width / 2) : Math.floor(pageDimensions.height / 2);
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-700">Pages:</h3>
          <Button variant="link" className="text-blue-600 p-0 h-auto" onClick={onReset}>
            Reset
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Margins:</h3>
            <ToggleGroup type="single" value={margins.unit} onValueChange={handleUnitChange}>
                <ToggleGroupItem value="px">px</ToggleGroupItem>
                <ToggleGroupItem value="%">%</ToggleGroupItem>
            </ToggleGroup>
        </div>
        <MarginInput label="Top" value={margins.top} onChange={(v) => handleMarginChange('top', v)} max={getMax('vertical')} unit={margins.unit} />
        <MarginInput label="Bottom" value={margins.bottom} onChange={(v) => handleMarginChange('bottom', v)} max={getMax('vertical')} unit={margins.unit} />
        <MarginInput label="Left" value={margins.left} onChange={(v) => handleMarginChange('left', v)} max={getMax('horizontal')} unit={margins.unit} />
        <MarginInput label="Right" value={margins.right} onChange={(v) => handleMarginChange('right', v)} max={getMax('horizontal')} unit={margins.unit} />
      </div>
    </div>
  );
};
