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
  {
    value: "merge",
    label: "Merge PDF",
    description: "Combine PDFs in the order you want.",
    icon: FilePlus,
    color: "text-ilovepdf-red",
    category: "Organize",
  },
  {
    value: "split",
    label: "Split PDF",
    description: "Separate pages into new PDF files.",
    icon: Scissors,
    color: "text-orange-500",
    category: "Organize",
  },
  {
    value: "compress",
    label: "Compress PDF",
    description: "Reduce file size for easier sharing.",
    icon: Archive,
    color: "text-green-500",
    category: "Optimize",
  },
  {
    value: "pdf-to-word",
    label: "PDF to Word",
    description: "Convert PDFs to editable Word documents.",
    icon: FileOutput,
    color: "text-blue-500",
    category: "Convert",
  },
  {
    value: "word-to-pdf",
    label: "Word to PDF",
    description: "Convert Word documents to PDF.",
    icon: FileType,
    color: "text-blue-600",
    category: "Convert",
  },
  {
    value: "edit",
    label: "Edit PDF",
    description: "Add text, images, and annotations.",
    icon: FileText,
    color: "text-purple-500",
    category: "Edit",
  },
  {
    value: "unlock",
    label: "Unlock PDF",
    description: "Remove passwords from your PDFs.",
    icon: Unlock,
    color: "text-teal-500",
    category: "Security",
  },
  {
    value: "protect",
    label: "Protect PDF",
    description: "Add a password and encrypt your PDF.",
    icon: Lock,
    color: "text-gray-600",
    category: "Security",
  },
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
