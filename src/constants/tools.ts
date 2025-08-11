import {
  FilePlus, Scissors, Archive, FileOutput, FileType, 
  FileText, Unlock, Lock
} from "lucide-react";

export type ToolCategory = "Organize" | "Optimize" | "Convert" | "Edit" | "Security";

export interface Tool {
  value: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: ToolCategory;
}

export const tools: Tool[] = [
  // ... (all your tool objects are here)
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
