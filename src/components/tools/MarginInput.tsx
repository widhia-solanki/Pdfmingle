// src/components/tools/MarginInput.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface MarginInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  unit: 'px' | '%';
}

export const MarginInput = ({ label, value, onChange, max, unit }: MarginInputProps) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= max) {
      onChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="font-medium text-gray-600">{label}</Label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            className="w-20 h-8 text-center"
            min="0"
            max={max}
          />
          <span className="text-sm font-semibold text-gray-500">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        max={max}
        step={1}
      />
    </div>
  );
};
