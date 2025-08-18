// src/constants/tools.ts

import {
  FilePlus, Scissors, Archive, FileOutput, FileType, FileText,
  Unlock, Lock, RotateCw, FileImage, Image, FileHeart, Files, Link as LinkIcon, LucideProps
} from "lucide-react";

export type ToolCategory = "Organize" | "Optimize" | "Convert" | "Edit" | "Security";

export const iconMap: { [key: string]: React.ElementType<LucideProps> } = {
  FilePlus, Scissors, Archive, FileOutput, FileType, FileText,
  Unlock, Lock, RotateCw, FileImage, Image, FileHeart, Files, LinkIcon
};

export interface Tool {
  value: string;
  label: string;
  h1: string;
  description: string;
  category: ToolCategory;
  icon: keyof typeof iconMap;
  color: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  steps: string[];
  isBrowserOnly: boolean;
  faqs: { question: string; answer: string; }[]; // New property for tool-specific FAQs
}

export const tools: Tool[] = [
  {
    value: "merge-pdf",
    label: "Merge PDF",
    h1: "Merge PDF Files Online",
    description: "Combine multiple PDF documents into one single file, free and easy.",
    category: "Organize",
    icon: 'FilePlus',
    color: "#4A90E2",
    metaTitle: "Merge PDF Files Online – Free PDF Combiner",
    metaDescription: "Combine multiple PDFs into one document with our free online PDF merger. Fast, secure, and no software to install.",
    metaKeywords: "merge pdf, combine pdf, pdf joiner, unite pdf, free pdf merger",
    steps: ["Upload your PDFs", "Drag and drop to order them", "Click 'Merge PDF' to combine", "Download your single merged file"],
    isBrowserOnly: true,
    faqs: [
        { question: "How many PDF files can I merge at once?", answer: "You can upload and merge multiple PDF files at once. The specific limit is designed to handle most common use cases." },
        { question: "Can I reorder the files before merging?", answer: "Yes. After uploading your files, you can drag and drop them into your desired order before clicking the merge button." },
        { question: "Is this PDF merger tool safe to use?", answer: "Absolutely. We use SSL encryption for all file transfers and automatically delete all files from our servers after a few hours to protect your privacy." }
    ]
  },
  {
    value: "compress-pdf",
    label: "Compress PDF",
    h1: "Compress PDF Files Online",
    description: "Reduce the file size of your PDF while optimizing for the best quality.",
    category: "Optimize",
    icon: 'Archive',
    color: "#F8E71C",
    metaTitle: "Free PDF Compressor – Shrink PDF Files Online",
    metaDescription: "Compress your PDF files online for free. Keep quality while reducing file size using our simple, fast PDF compressor.",
    metaKeywords: "compress pdf, reduce pdf size, shrink pdf, pdf optimizer",
    steps: ["Upload your PDF", "Choose a compression level", "Click 'Compress PDF'", "Download your smaller, optimized PDF file"],
    isBrowserOnly: false,
    faqs: [
        { question: "How do I compress a PDF without losing quality?", answer: "Our tool uses advanced algorithms to reduce file size while maintaining the best possible text and image quality. For most documents, the quality difference is negligible." },
        { question: "What is the maximum file size I can compress?", answer: "Our PDF compressor is designed to handle large files, but for best results, we recommend files under 100MB. Performance may vary based on your connection speed." },
        { question: "Why should I compress a PDF?", answer: "Compressing a PDF makes it much easier to share via email or upload to the web. It saves storage space and reduces download times for recipients." }
    ]
  },
  {
    value: "pdf-to-word",
    label: "PDF to Word",
    h1: "PDF to Word Converter",
    description: "Easily convert your PDF files into editable Word documents (DOCX).",
    category: "Convert",
    icon: 'FileType',
    color: "#2B78E4",
    metaTitle: "Convert PDF to Word Free – Online DOCX Converter",
    metaDescription: "Free online tool to convert your PDF to an editable Word document (DOCX). High-quality conversion that preserves formatting.",
    metaKeywords: "pdf to word, convert pdf to word, pdf to docx, free pdf converter",
    steps: ["Upload your PDF file", "Click 'Convert to Word'", "Download your editable DOCX file in seconds"],
    isBrowserOnly: false,
    faqs: [
        { question: "Will my formatting be preserved when converting from PDF to Word?", answer: "Our converter does its best to preserve the original layout, images, and text formatting. However, very complex PDFs may see minor differences." },
        { question: "Is the converted Word document fully editable?", answer: "Yes. The output is a standard .DOCX file that you can open and edit in Microsoft Word, Google Docs, or any other compatible software." },
        { question: "Can I convert scanned PDFs to Word?", answer: "Our standard converter works best with text-based PDFs. For scanned documents (images of text), OCR (Optical Character Recognition) is required, which is a feature we are exploring for a future update." }
    ]
  },
  // ... (FAQs and optimized meta for all other tools would be added here in the same pattern) ...
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
