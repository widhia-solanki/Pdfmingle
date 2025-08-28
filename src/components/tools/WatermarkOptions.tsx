// src/components/tools/WatermarkOptions.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ImagePlus, Type } from "lucide-react";

export type WatermarkType = "text" | "image";

export interface WatermarkState {
  type: WatermarkType;
  text: string;
  image: File | null;
  opacity: number;
  rotation: number;
  isTiled: boolean;
  color: string;
  fontSize: number;
}

interface WatermarkOptionsProps {
  options: WatermarkState;
  onOptionChange: (newOptions: WatermarkState) => void;
}

export const WatermarkOptions = ({ options, onOptionChange }: WatermarkOptionsProps) => {

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onOptionChange({ ...options, image: e.target.files[0] });
    }
  };

  return (
    <div className="w-full space-y-6">
      <Tabs value={options.type} onValueChange={(v) => onOptionChange({ ...options, type: v as WatermarkType })}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text"><Type className="mr-2 h-4 w-4" /> Text</TabsTrigger>
          <TabsTrigger value="image"><ImagePlus className="mr-2 h-4 w-4" /> Image</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="space-y-4 pt-4">
            <div>
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Input id="watermark-text" value={options.text} onChange={(e) => onOptionChange({ ...options, text: e.target.value })}/>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Input id="font-size" type="number" value={options.fontSize} onChange={(e) => onOptionChange({ ...options, fontSize: parseInt(e.target.value) || 48 })}/>
                </div>
                 <div>
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" type="color" value={options.color} onChange={(e) => onOptionChange({ ...options, color: e.target.value })} className="p-1 h-10"/>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="image" className="pt-4">
             <div>
                <Label htmlFor="watermark-image">Watermark Image</Label>
                <Input id="watermark-image" type="file" accept="image/png, image/jpeg" onChange={handleImageSelect} />
                {options.image && <p className="text-sm text-gray-500 mt-2 truncate">Selected: {options.image.name}</p>}
             </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4">
        <div>
          <Label>Opacity: {Math.round(options.opacity * 100)}%</Label>
          <Slider value={[options.opacity]} onValueChange={(v) => onOptionChange({ ...options, opacity: v[0] })} min={0} max={1} step={0.1}/>
        </div>
         <div>
          <Label>Rotation: {options.rotation}°</Label>
          <Slider value={[options.rotation]} onValueChange={(v) => onOptionChange({ ...options, rotation: v[0] })} min={-180} max={180} step={5}/>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="tiled-watermark" checked={options.isTiled} onCheckedChange={(checked) => onOptionChange({ ...options, isTiled: !!checked })} />
        <Label htmlFor="tiled-watermark" className="cursor-pointer">Tiled Watermark</Label>
      </div>
    </div>
  );
};
