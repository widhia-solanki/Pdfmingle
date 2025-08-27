// src/components/tools/MarginCropControls.tsx

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarginState } from "@/lib/pdf/crop";
import { cn } from "@/lib/utils";

export type CropMode = 'current' | 'all';

interface MarginCropControlsProps {
  margins: MarginState;
  onMarginsChange: (newMargins: MarginState) => void;
  mode: CropMode;
  onModeChange: (mode: CropMode) => void;
  onReset: () => void;
}

export const MarginCropControls = ({ margins, onMarginsChange, mode, onModeChange, onReset }: MarginCropControlsProps) => {
  
  const handleMarginChange = (field: keyof Omit<MarginState, 'unit'>, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      onMarginsChange({ ...margins, [field]: numValue });
    }
  };

  const handleUnitChange = (unit: 'px' | '%') => {
    if (unit) {
      onMarginsChange({ ...margins, unit });
    }
  };

  const InputField = ({ label, field }: { label: string, field: keyof Omit<MarginState, 'unit'> }) => (
    <>
      <Label htmlFor={field} className="text-gray-600">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={field}
          type="number"
          value={margins[field]}
          onChange={(e) => handleMarginChange(field, e.target.value)}
          className="w-24 h-10 text-center"
          min="0"
        />
        <span className="text-sm font-semibold text-gray-500">{margins.unit}</span>
      </div>
    </>
  );

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
            <div className="flex items-center gap-1">
                <button onClick={() => handleUnitChange('px')} className={cn("px-3 py-1 text-sm rounded-md", margins.unit === 'px' ? 'bg-gray-200 font-semibold' : 'text-gray-500')}>px</button>
                <button onClick={() => handleUnitChange('%')} className={cn("px-3 py-1 text-sm rounded-md", margins.unit === '%' ? 'bg-gray-200 font-semibold' : 'text-gray-500')}>%</button>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 items-center">
            <InputField label="Top" field="top" />
            <InputField label="Bottom" field="bottom" />
            <InputField label="Left" field="left" />
            <InputField label="Right" field="right" />
        </div>
      </div>
    </div>
  );
};
