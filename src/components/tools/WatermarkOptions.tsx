// src/components/tools/WatermarkOptions.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WatermarkPositionSelector, Position } from "./WatermarkPositionSelector";
import { ImagePlus, Type } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type WatermarkType = "text" | "image";
export type Positioning = "single" | "tiled";

export interface WatermarkState {
  type: WatermarkType;
  text: string;
  image: File | null;
  opacity: number;
  rotation: number;
  positioning: Positioning;
  position: Position;
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
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="font-size">Font Size</Label>
                    <Input id="font-size" type="number" value={options.fontSize} onChange={(e) => onOptionChange({ ...options, fontSize: parseInt(e.target.value) || 48 })}/>
                </div>
                 <div className="flex flex-col items-start">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" type="color" value={options.color} onChange={(e) => onOptionChange({ ...options, color: e.target.value })} className="p-1 h-10 w-full"/>
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
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Opacity: {Math.round(options.opacity * 100)}%</Label>
          <Input type="range" value={options.opacity} onChange={(e) => onOptionChange({ ...options, opacity: parseFloat(e.target.value) })} min={0} max={1} step={0.1}/>
        </div>
         <div>
          <Label>Rotation: {options.rotation}°</Label>
          <Input type="range" value={options.rotation} onChange={(e) => onOptionChange({ ...options, rotation: parseInt(e.target.value) })} min={-180} max={180} step={5}/>
        </div>
      </div>
      
      <div>
        <Label className="font-medium">Positioning</Label>
        <ToggleGroup type="single" value={options.positioning} onValueChange={(v: Positioning) => v && onOptionChange({ ...options, positioning: v })} className="grid grid-cols-2 mt-2">
          <ToggleGroupItem value="single">Single</ToggleGroupItem>
          <ToggleGroupItem value="tiled">Tiled</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {options.positioning === 'single' && (
        <WatermarkPositionSelector 
          position={options.position} 
          onPositionChange={(pos) => onOptionChange({ ...options, position: pos })} 
        />
      )}
    </div>
  );
};
