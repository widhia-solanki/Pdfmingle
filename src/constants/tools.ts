import {
  FilePlus, Scissors, Archive, FileOutput, FileType, 
  FileText, Unlock, Lock, RotateCw
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
}

// THIS IS THE FULL LIST OF YOUR TOOLS
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
  {
    value: "compress-pdf",
    label: "Compress PDF",
    h1: "Compress PDF file",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    category: "Optimize",
    icon: Archive,
    color: "text-green-500",
    metaTitle: "Compress PDF Files Online - Free PDF Reducer | PDFMingle",
    metaDescription: "Reduce the file size of your PDF files online for free. Our PDF compressor is easy to use and preserves document quality.",
    metaKeywords: "compress pdf, pdf compressor, reduce pdf size, pdf optimizer",
    steps: [
      "Select the PDF file you want to compress.",
      "Choose your desired compression level (if available).",
      "Click the 'Compress PDF' button.",
      "Download your new, smaller PDF file."
    ]
  },
  {
    value: "rotate-pdf",
    label: "Rotate PDF",
    h1: "Rotate PDF files",
    description: "Rotate one or multiple PDFs at once, in any direction you need.",
    category: "Edit",
    icon: RotateCw,
    color: "text-sky-500",
    metaTitle: "Rotate PDF Files Online - Free PDF Rotator | PDFMingle",
    metaDescription: "Rotate your PDF files permanently. Rotate all pages or just a single page, clockwise or counter-clockwise.",
    metaKeywords: "rotate pdf, pdf rotator, flip pdf",
    steps: [
      "Select the PDF file you wish to rotate.",
      "Choose the rotation angle (90°, 180°, 270°).",
      "Click the 'Rotate PDF' button to apply the changes.",
      "Download your newly rotated PDF."
    ]
  },
  {
    value: "pdf-to-word",
    label: "PDF to Word",
    h1: "Convert PDF to Word",
    description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.",
    category: "Convert",
    icon: FileOutput,
    color: "text-blue-500",
    metaTitle: "Convert PDF to Word Online - Free | PDFMingle",
    metaDescription: "Convert your PDFs to editable Microsoft Word documents for free. Accurate conversion with preserved formatting.",
    metaKeywords: "pdf to word, convert pdf to word, pdf to docx",
    steps: [
      "Upload your PDF file.",
      "Click the 'Convert to Word' button.",
      "The conversion will start immediately.",
      "Download your editable Word document."
    ]
  },
  {
    value: "word-to-pdf",
    label: "Word to PDF",
    h1: "Convert Word to PDF",
    description: "Make DOC and DOCX files easy to read by converting them to PDF.",
    category: "Convert",
    icon: FileType,
    color: "text-blue-600",
    metaTitle: "Convert Word to PDF Online - Free | PDFMingle",
    metaDescription: "Convert Microsoft Word documents (DOC, DOCX) to PDF format for easy sharing and printing. Free and secure.",
    metaKeywords: "word to pdf, convert word to pdf, docx to pdf",
    steps: [
      "Upload your Word document (DOC or DOCX).",
      "Click the 'Convert to PDF' button.",
      "Your PDF will be ready in seconds.",
      "Download your professional-quality PDF file."
    ]
  }
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
