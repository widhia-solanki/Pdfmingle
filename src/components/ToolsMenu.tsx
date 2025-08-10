import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  FilePlus, FileImage, RotateCw, Archive, FileType, FileOutput, Grip,
} from "lucide-react";
import { Link } from "react-router-dom";

// This list should match the one in ToolSelector.tsx
const tools = [
  { value: "merge", label: "Merge PDF", icon: FilePlus, color: "text-red-500" },
  { value: "split", label: "Split PDF", icon: FileImage, color: "text-orange-500" },
  { value: "rotate", label: "Rotate PDF", icon: RotateCw, color: "text-blue-500" },
  { value: "compress", label: "Compress PDF", icon: Archive, color: "text-green-500" },
  { value: "word-to-pdf", label: "Word to PDF", icon: FileType, color: "text-indigo-500" },
  { value: "pdf-to-word", label: "PDF to Word", icon: FileOutput, color: "text-purple-500" },
];

export function ToolsMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
          <Grip className="h-6 w-6" />
          <span className="sr-only">Open Tools Menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <div className="grid grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link to={`/${tool.value}`} key={tool.value} className="flex flex-col items-center justify-center text-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                <Icon className={`h-8 w-8 ${tool.color}`} />
                <span className="text-xs font-medium">{tool.label}</span>
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
