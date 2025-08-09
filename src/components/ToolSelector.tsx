import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileImage, FilePlus, RotateCw, Archive, FileType, FileOutput } from "lucide-react";

interface ToolSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const tools = [
  { value: "merge", label: "Merge PDF", icon: FilePlus },
  { value: "split", label: "Split PDF", icon: FileImage },
  { value: "rotate", label: "Rotate PDF", icon: RotateCw },
  { value: "compress", label: "Compress PDF", icon: Archive },
  { value: "word-to-pdf", label: "Word to PDF", icon: FileType },
  { value: "pdf-to-word", label: "PDF to Word", icon: FileOutput },
];

export const ToolSelector = ({ value, onValueChange }: ToolSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Select a PDF tool</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full h-12 text-left shadow-sm border-primary/20 focus:border-primary focus:ring-primary transition-smooth">
          <SelectValue placeholder="Choose a PDF operation" />
        </SelectTrigger>
        <SelectContent>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <SelectItem key={tool.value} value={tool.value} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {tool.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};