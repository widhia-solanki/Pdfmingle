import {
  FilePlus, Scissors, Archive, FileOutput, FileType, 
  FileText, Unlock, Lock
} from "lucide-react";

export type ToolCategory = "Organize" | "Optimize" | "Convert" | "Edit" | "Security";

// --- START OF THE FIX ---
// The 'Tool' interface has been updated to include all the new properties for SEO.
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
}
// --- END OF THE FIX ---

export const tools: Tool[] = [
  {
    value: "merge-pdf",
    label: "Merge PDF",
    h1: "Merge PDF files",
    description: "Combine PDFs in the order you want with the easiest PDF merger available.",
    category: "Organize",
    icon: FilePlus,
    color: "text-ilovepdf-red",
    metaTitle: "Merge PDF Files Online - Free PDF Combiner | PDFMingle",
    metaDescription: "Easily combine multiple PDF files into one single document online. Free, fast, and secure PDF merger tool from PDFMingle.",
    metaKeywords: "merge pdf, combine pdf, pdf merger, join pdf, pdf combiner",
    steps: [
      "Select multiple PDF files from your device.",
      "Drag and drop the files to reorder them if needed.",
      "Click the 'Merge PDF' button to combine your files.",
      "Download your new, merged PDF document."
    ]
  },
  {
    value: "split-pdf",
    label: "Split PDF",
    h1: "Split PDF file",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    category: "Organize",
    icon: Scissors,
    color: "text-orange-500",
    metaTitle: "Split PDF Files Online - Free PDF Splitter | PDFMingle",
    metaDescription: "Separate PDF pages or extract specific pages into a new document. Our free online PDF splitter is fast and easy to use.",
    metaKeywords: "split pdf, pdf splitter, extract pdf pages, separate pdf",
    steps: [
      "Select the PDF file you want to split.",
      "Choose the pages or page ranges to extract.",
      "Click the 'Split PDF' button.",
      "Download your new PDF files, either individually or as a ZIP archive."
    ]
  },
  // You can add all your other tools here, following the same object structure
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
