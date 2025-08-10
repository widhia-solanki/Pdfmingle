import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  FilePlus,
  FileImage,
  RotateCw,
  Archive,
  FileType,
  FileOutput,
} from "lucide-react";

// This list should match the one in ToolSelector.tsx
const tools = [
  { value: "merge", label: "Merge PDF", icon: FilePlus },
  { value: "split", label: "Split PDF", icon: FileImage },
  { value: "rotate", label: "Rotate PDF", icon: RotateCw },
  { value: "compress", label: "Compress PDF", icon: Archive },
  { value: "word-to-pdf", label: "Word to PDF", icon: FileType },
  { value: "pdf-to-word", label: "PDF to Word", icon: FileOutput },
];

export default function ThreeDotsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
          <MoreVertical className="h-6 w-6" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>PDF Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            // In a real multi-page app, you would use <Link> here
            <DropdownMenuItem key={tool.value} className="cursor-pointer">
              <Icon className="mr-2 h-4 w-4" />
              <span>{tool.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
