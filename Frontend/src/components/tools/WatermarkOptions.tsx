// src/components/tools/WatermarkOptions.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WatermarkPositionSelector, Position } from "./WatermarkPositionSelector";
import { ImagePlus, Type } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";

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
      {/* SECTION 1: CONTENT TYPE (TEXT OR IMAGE) */}
      <Tabs value={options.type} onValueChange={(v) => onOptionChange({ ...options, type: v as WatermarkType })}>
        <TabsList className="grid w-full grid-cols-2 h-12">
          {/* IMPROVEMENT: Clearer visual feedback on active tab */}
          <TabsTrigger value="text" className="h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
            <Type className="mr-2 h-5 w-5" /> Text
          </TabsTrigger>
          <TabsTrigger value="image" className="h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
            <ImagePlus className="mr-2 h-5 w-5" /> Image
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="space-y-4 pt-4">
            <div>
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Input id="watermark-text" value={options.text} onChange={(e) => onOptionChange({ ...options, text: e.target.value })}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="font-size">Font Size</Label>
                    <Input id="font-size" type="number" value={options.fontSize} onChange={(e) => onOptionChange({ ...options, fontSize: parseInt(e.target.value, 10) || 48 })}/>
                </div>
                 <div className="flex flex-col items-start">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" type="color" value={options.color} onChange={(e) => onOptionChange({ ...options, color: e.target.value })} className="p-1 h-10 w-full cursor-pointer"/>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="image" className="pt-4">
             <div>
                <Label htmlFor="watermark-image">Watermark Image</Label>
                <Input id="watermark-image" type="file" accept="image/png, image/jpeg" onChange={handleImageSelect} />
                {options.image && <p className="text-sm text-muted-foreground mt-2 truncate">Selected: {options.image.name}</p>}
             </div>
        </TabsContent>
      </Tabs>
      
      <Separator />

      {/* SECTION 2: STYLING (OPACITY AND ROTATION) */}
      <div className="space-y-4">
        <div>
          {/* IMPROVEMENT: Interactive value display for slider */}
          <div className="flex justify-between items-center mb-2">
            <Label>Opacity</Label>
            <span className="text-sm font-medium text-muted-foreground">{Math.round(options.opacity * 100)}%</span>
          </div>
          <Input type="range" value={options.opacity} onChange={(e) => onOptionChange({ ...options, opacity: parseFloat(e.target.value) })} min={0} max={1} step={0.05}/>
        </div>
         <div>
          {/* IMPROVEMENT: Interactive value display for slider */}
          <div className="flex justify-between items-center mb-2">
            <Label>Rotation</Label>
            <span className="text-sm font-medium text-muted-foreground">{options.rotation}°</span>
          </div>
          <Input type="range" value={options.rotation} onChange={(e) => onOptionChange({ ...options, rotation: parseInt(e.target.value, 10) })} min={-180} max={180} step={5}/>
        </div>
      </div>
      
      <Separator />

      {/* SECTION 3: POSITIONING */}
      <div className="space-y-4">
        <div>
          <Label className="font-medium">Tiling</Label>
          <ToggleGroup type="single" value={options.positioning} onValueChange={(v: Positioning) => v && onOptionChange({ ...options, positioning: v })} className="grid grid-cols-2 mt-2">
            <ToggleGroupItem value="single" aria-label="Single position">Single</ToggleGroupItem>
            <ToggleGroupItem value="tiled" aria-label="Tiled across page">Tiled</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* IMPROVEMENT: Uses the simplified, more intuitive position selector */}
        {options.positioning === 'single' && (
          <WatermarkPositionSelector 
            position={options.position} 
            onPositionChange={(pos) => onOptionChange({ ...options, position: pos })} 
          />
        )}
      </div>
    </div>
  );
};
