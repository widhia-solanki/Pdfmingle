import {
  FilePlus, Scissors, Archive, FileOutput, FileType, FileText, 
  Unlock, Lock, RotateCw, FileImage, Image, FileKey2, FileDigit, 
  ScanLine, Scale
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

export const tools: Tool[] = [
  // --- ORGANIZE CATEGORY ---
  {
    value: "merge-pdf",
    label: "Merge PDF",
    h1: "Merge PDF files",
    description: "Combine multiple PDFs into a single, unified document.",
    category: "Organize",
    icon: FilePlus,
    color: "text-red-500",
    metaTitle: "Merge PDF Files Online - Free PDF Combiner | PDFMingle",
    metaDescription: "Easily combine multiple PDF files into one single document online. Free, fast, and secure PDF merger tool from PDFMingle.",
    metaKeywords: "merge pdf, combine pdf, pdf merger, join pdf, pdf combiner",
    steps: [ "Select PDFs", "Order them as you like", "Click Merge", "Download your file." ]
  },
  {
    value: "split-pdf",
    label: "Split PDF",
    h1: "Split a PDF file",
    description: "Extract specific pages or save each page as a separate PDF.",
    category: "Organize",
    icon: Scissors,
    color: "text-orange-500",
    metaTitle: "Split PDF Files Online - Free PDF Splitter | PDFMingle",
    metaDescription: "Separate PDF pages or extract specific pages into a new document. Our free online PDF splitter is fast and easy to use.",
    metaKeywords: "split pdf, pdf splitter, extract pdf pages, separate pdf",
    steps: [ "Select a PDF", "Choose the pages to extract", "Click Split", "Download your new files." ]
  },

  // --- OPTIMIZE CATEGORY ---
  {
    value: "compress-pdf",
    label: "Compress PDF",
    h1: "Compress a PDF file",
    description: "Reduce the file size of your PDF while maintaining quality.",
    category: "Optimize",
    icon: Archive,
    color: "text-green-500",
    metaTitle: "Compress PDF Files Online - Free PDF Reducer | PDFMingle",
    metaDescription: "Reduce the file size of your PDF files online for free. Our PDF compressor is easy to use and preserves document quality.",
    metaKeywords: "compress pdf, pdf compressor, reduce pdf size, pdf optimizer",
    steps: [ "Select a PDF", "Choose a compression level", "Click Compress", "Download your smaller file." ]
  },

  // --- CONVERT CATEGORY ---
  {
    value: "pdf-to-word",
    label: "PDF to Word",
    h1: "Convert PDF to Word",
    description: "Turn your PDF into an editable Microsoft Word document.",
    category: "Convert",
    icon: FileOutput,
    color: "text-blue-500",
    metaTitle: "Convert PDF to Word Online - Free | PDFMingle",
    metaDescription: "Convert your PDFs to editable Microsoft Word documents for free. Accurate conversion with preserved formatting.",
    metaKeywords: "pdf to word, convert pdf to word, pdf to docx",
    steps: [ "Upload your PDF", "Click Convert", "Wait for the process to finish", "Download your Word document." ]
  },
  {
    value: "word-to-pdf",
    label: "Word to PDF",
    h1: "Convert Word to PDF",
    description: "Convert Microsoft Word documents to professional PDFs.",
    category: "Convert",
    icon: FileType,
    color: "text-blue-600",
    metaTitle: "Convert Word to PDF Online - Free | PDFMingle",
    metaDescription: "Convert Microsoft Word documents (DOC, DOCX) to PDF format for easy sharing and printing. Free and secure.",
    metaKeywords: "word to pdf, convert word to pdf, docx to pdf",
    steps: [ "Upload your Word file", "Click Convert", "Your PDF is ready in seconds", "Download your new PDF." ]
  },
  {
    value: "pdf-to-jpg",
    label: "PDF to JPG",
    h1: "Convert PDF to JPG",
    description: "Extract every page from your PDF into high-quality JPG images.",
    category: "Convert",
    icon: FileImage,
    color: "text-yellow-500",
    metaTitle: "Convert PDF to JPG Images Online - Free | PDFMingle",
    metaDescription: "Turn each page of your PDF into a separate JPG image file. High quality and fast conversion.",
    metaKeywords: "pdf to jpg, convert pdf to jpg, pdf to image",
    steps: [ "Upload your PDF", "Choose image quality", "Click Convert", "Download your JPG images." ]
  },
  {
    value: "jpg-to-pdf",
    label: "JPG to PDF",
    h1: "Convert JPG to PDF",
    description: "Combine one or more JPG images into a single PDF document.",
    category: "Convert",
    icon: Image,
    color: "text-yellow-600",
    metaTitle: "Convert JPG to PDF Online - Free | PDFMingle",
    metaDescription: "Combine JPG images into a PDF file. Adjust orientation and margins with our easy-to-use image to PDF converter.",
    metaKeywords: "jpg to pdf, convert jpg to pdf, image to pdf",
    steps: [ "Upload your JPG images", "Adjust order and settings", "Click Create PDF", "Download your document." ]
  },

  // --- EDIT CATEGORY ---
  {
    value: "rotate-pdf",
    label: "Rotate PDF",
    h1: "Rotate PDF files",
    description: "Rotate pages in your PDF document permanently.",
    category: "Edit",
    icon: RotateCw,
    color: "text-sky-500",
    metaTitle: "Rotate PDF Files Online - Free PDF Rotator | PDFMingle",
    metaDescription: "Rotate your PDF files permanently. Rotate all pages or just a single page, clockwise or counter-clockwise.",
    metaKeywords: "rotate pdf, pdf rotator, flip pdf",
    steps: [ "Select your PDF", "Choose the rotation angle", "Click Rotate", "Download your file." ]
  },
  {
    value: "add-page-numbers",
    label: "Page Numbers",
    h1: "Add Page Numbers to PDF",
    description: "Insert page numbers into your PDF file with custom positions.",
    category: "Edit",
    icon: FileDigit,
    color: "text-indigo-500",
    metaTitle: "Add Page Numbers to PDF - Free Online Tool | PDFMingle",
    metaDescription: "Easily insert page numbers into your PDF documents. Customize the position, format, and range for free.",
    metaKeywords: "add page numbers to pdf, number pdf pages, pdf pagination",
    steps: [ "Upload your PDF", "Select position and style", "Click Add Numbers", "Download the numbered PDF." ]
  },
  {
    value: "edit-pdf",
    label: "Edit PDF",
    h1: "Edit a PDF file",
    description: "Add text, shapes, images, and freehand annotations to your PDF.",
    category: "Edit",
    icon: FileText,
    color: "text-purple-500",
    metaTitle: "Edit PDF Online - Free PDF Editor | PDFMingle",
    metaDescription: "Use our free online PDF editor to add text, images, and annotations to your documents without installing any software.",
    metaKeywords: "edit pdf, pdf editor, annotate pdf",
    steps: [ "Upload your PDF", "Use the toolbar to add content", "Click Save", "Download your edited file." ]
  },

  // --- SECURITY CATEGORY ---
  {
    value: "unlock-pdf",
    label: "Unlock PDF",
    h1: "Unlock a PDF file",
    description: "Remove a password from your PDF to open and edit it freely.",
    category: "Security",
    icon: Unlock,
    color: "text-teal-500",
    metaTitle: "Unlock PDF - Free Online Password Remover | PDFMingle",
    metaDescription: "Remove password security from your PDF files online, so you can edit and use them without restrictions. Fast and secure.",
    metaKeywords: "unlock pdf, remove pdf password, decrypt pdf",
    steps: [ "Select your protected PDF", "Confirm you have the right to edit", "Click Unlock", "Download your password-free PDF." ]
  },
  {
    value: "protect-pdf",
    label: "Protect PDF",
    h1: "Protect a PDF file",
    description: "Add a strong password to your PDF to prevent unauthorized access.",
    category: "Security",
    icon: Lock,
    color: "text-gray-600",
    metaTitle: "Protect PDF - Add Password to PDF Online | PDFMingle",
    metaDescription: "Encrypt and add a password to your PDF files to keep them secure. Protect sensitive information for free.",
    metaKeywords: "protect pdf, password protect pdf, encrypt pdf",
    steps: [ "Select your PDF", "Enter a strong password", "Click Protect", "Download your secured file." ]
  },
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
