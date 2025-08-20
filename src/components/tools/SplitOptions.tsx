// src/components/tools/SplitOptions.tsx

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';

export interface SplitRange {
  from: number;
  to: number;
}

interface SplitOptionsProps {
  totalPages: number;
  ranges: SplitRange[];
  onRangesChange: (ranges: SplitRange[]) => void;
}

export const SplitOptions = ({ totalPages, ranges, onRangesChange }: SplitOptionsProps) => {
  const addRange = () => {
    onRangesChange([...ranges, { from: 1, to: totalPages }]);
  };

  const updateRange = (index: number, field: 'from' | 'to', value: string) => {
    const newRanges = [...ranges];
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= totalPages) {
      newRanges[index][field] = numValue;
      onRangesChange(newRanges);
    } else {
        // Handle case where input is cleared
        if(value === '') {
            newRanges[index][field] = 1; // Or some default
            onRangesChange(newRanges);
        }
    }
  };

  const removeRange = (index: number) => {
    const newRanges = [...ranges];
    newRanges.splice(index, 1);
    onRangesChange(newRanges);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-center text-gray-800">Define Split Ranges</h3>
      
      {ranges.map((range, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
          <p className="font-medium">Range {index + 1}:</p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max={totalPages}
              value={range.from}
              onChange={(e) => updateRange(index, 'from', e.target.value)}
              className="w-20 text-center"
              aria-label={`Range ${index + 1} from page`}
            />
            <span>to</span>
            <Input
              type="number"
              min="1"
              max={totalPages}
              value={range.to}
              onChange={(e) => updateRange(index, 'to', e.target.value)}
              className="w-20 text-center"
              aria-label={`Range ${index + 1} to page`}
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeRange(index)} className="h-8 w-8 text-red-500 hover:text-red-700">
            <X className="h-5 w-5" />
          </Button>
        </div>
      ))}
      
      <Button variant="outline" onClick={addRange} className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add another range
      </Button>
    </div>
  );
};
