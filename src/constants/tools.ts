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
  color: string; // This is the property we are changing
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  steps: string[];
}

export const tools: Tool[] = [
  // --- THIS IS THE UPDATED SECTION ---
  {
    value: "merge-pdf",
    label: "Merge PDF",
    h1: "Merge PDF files",
    description: "Combine multiple PDFs into a single, unified document.",
    category: "Organize",
    icon: FilePlus,
    color: "text-red-500", // Red for adding/merging
    // ... meta info
  },
  {
    value: "split-pdf",
    label: "Split PDF",
    h1: "Split a PDF file",
    description: "Extract specific pages or save each page as a separate PDF.",
    category: "Organize",
    icon: Scissors,
    color: "text-orange-500", // Orange for cutting/splitting
    // ... meta info
  },
  {
    value: "organize-pdf",
    label: "Organize PDF",
    h1: "Organize PDF Pages",
    description: "Sort, add, and remove pages from your PDF document.",
    category: "Organize",
    icon: Files,
    color: "text-amber-600", // Amber for sorting
    // ... meta info
  },
  {
    value: "compress-pdf",
    label: "Compress PDF",
    h1: "Compress a PDF file",
    description: "Reduce the file size of your PDF while maintaining quality.",
    category: "Optimize",
    icon: Archive,
    color: "text-green-500", // Green for optimizing/efficiency
    // ... meta info
  },
  {
    value: "repair-pdf",
    label: "Repair PDF",
    h1: "Repair a Damaged PDF",
    description: "Attempt to recover data from a corrupted or damaged PDF file.",
    category: "Optimize",
    icon: FileHeart,
    color: "text-emerald-500", // Emerald/Teal for healing/repairing
    // ... meta info
  },
  {
    value: "pdf-to-word",
    label: "PDF to Word",
    h1: "Convert PDF to Word",
    description: "Turn your PDF into an editable Microsoft Word document.",
    category: "Convert",
    icon: FileOutput,
    color: "text-blue-500", // Blue for Word
    // ... meta info
  },
  {
    value: "word-to-pdf",
    label: "Word to PDF",
    h1: "Convert Word to PDF",
    description: "Convert Microsoft Word documents to professional PDFs.",
    category: "Convert",
    icon: FileType,
    color: "text-blue-600", // A different blue for distinction
    // ... meta info
  },
  {
    value: "pdf-to-jpg",
    label: "PDF to JPG",
    h1: "Convert PDF to JPG",
    description: "Extract every page from your PDF into high-quality JPG images.",
    category: "Convert",
    icon: FileImage,
    color: "text-yellow-500", // Yellow for images/JPG
    // ... meta info
  },
  {
    value: "jpg-to-pdf",
    label: "JPG to PDF",
    h1: "Convert JPG to PDF",
    description: "Combine one or more JPG images into a single PDF document.",
    category: "Convert",
    icon: Image,
    color: "text-yellow-600", // A different yellow
    // ... meta info
  },
  {
    value: "html-to-pdf",
    label: "HTML to PDF",
    h1: "Convert HTML to PDF",
    description: "Turn any public webpage into a high-quality PDF document.",
    category: "Convert",
    icon: LinkIcon,
    color: "text-cyan-500", // Cyan for web/links
    // ... meta info
  },
  {
    value: "rotate-pdf",
    label: "Rotate PDF",
    h1: "Rotate PDF files",
    description: "Rotate pages in your PDF document permanently.",
    category: "Edit",
    icon: RotateCw,
    color: "text-sky-500", // Sky blue for movement/rotation
    // ... meta info
  },
  {
    value: "add-page-numbers",
    label: "Page Numbers",
    h1: "Add Page Numbers to PDF",
    description: "Insert page numbers into your PDF file with custom positions.",
    category: "Edit",
    icon: FileDigit,
    color: "text-indigo-500", // Indigo for precision/editing
    // ... meta info
  },
  {
    value: "edit-pdf",
    label: "Edit PDF",
    h1: "Edit a PDF file",
    description: "Add text, shapes, images, and freehand annotations to your PDF.",
    category: "Edit",
    icon: FileText,
    color: "text-purple-500", // Purple for creative editing
    // ... meta info
  },
  {
    value: "unlock-pdf",
    label: "Unlock PDF",
    h1: "Unlock a PDF file",
    description: "Remove a password from your PDF to open and edit it freely.",
    category: "Security",
    icon: Unlock,
    color: "text-lime-600", // Lime green for unlocking
    // ... meta info
  },
  {
    value: "protect-pdf",
    label: "Protect PDF",
    h1: "Protect a PDF file",
    description: "Add a strong password to your PDF to prevent unauthorized access.",
    category: "Security",
    icon: Lock,
    color: "text-slate-600", // Slate for seriousness/security
    // ... meta info
  },
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
