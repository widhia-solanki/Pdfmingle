import {
  FilePlus, Scissors, Archive, FileOutput, FileType, FileText, 
  Unlock, Lock, RotateCw, FileImage, Image, FileHeart, Files, Link as LinkIcon
} from "lucide-react";

export type ToolCategory = "Organize" | "Optimize" | "Convert" | "Edit" | "Security";

export interface Tool {
  value: string;
  label: string;
  h1: string;
  description: string;
  category: ToolCategory;
  icon: React.ElementType;
  color: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  steps: string[];
  isBrowserOnly: boolean; // This new property is our switch
}

export const tools: Tool[] = [
  // --- BROWSER-ONLY TOOLS (These will work) ---
  {
    value: "merge-pdf",
    label: "Merge PDF",
    isBrowserOnly: true,
    // ... other properties
  },
  {
    value: "split-pdf",
    label: "Split PDF",
    isBrowserOnly: true,
    // ... other properties
  },
  {
    value: "rotate-pdf",
    label: "Rotate PDF",
    isBrowserOnly: true,
    // ... other properties
  },
  {
    value: "jpg-to-pdf",
    label: "JPG to PDF",
    isBrowserOnly: true,
    // ... other properties
  },
  {
    value: "add-page-numbers",
    label: "Page Numbers",
    isBrowserOnly: true,
    // ... other properties
  },
  
  // --- BACKEND-REQUIRED TOOLS (These will be dummy pages) ---
  {
    value: "compress-pdf",
    label: "Compress PDF",
    isBrowserOnly: false,
    // ... other properties
  },
  {
    value: "organize-pdf",
    label: "Organize PDF",
    isBrowserOnly: false, // This is too complex for the browser
    // ... other properties
  },
  {
    value: "repair-pdf",
    label: "Repair PDF",
    isBrowserOnly: false,
    // ... other properties
  },
  {
    value: "pdf-to-word",
    label: "PDF to Word",
    isBrowserOnly: false,
    // ... other properties
  },
  {
    value: "word-to-pdf",
    label: "Word to PDF",
    isBrowserOnly: false,
    // ... other properties
  },
  {
    value: "pdf-to-jpg",
    label: "PDF to JPG",
    isBrowserOnly: false,
    // ... other properties
  },
  {
    value: "html-to-pdf",
    label: "HTML to PDF",
    isBrowserOnly: false,
    // ... other properties
  },
  {
    value: "edit-pdf",
    label: "Edit PDF",
    isBrowserOnly: false,
    // ... other properties
  },
  {
    value: "unlock-pdf",
    label: "Unlock PDF",
    isBrowserOnly: false,
    // ... other properties
  },
  {
    value: "protect-pdf",
    label: "Protect PDF",
    isBrowserOnly: false,
    // ... other properties
  },
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
