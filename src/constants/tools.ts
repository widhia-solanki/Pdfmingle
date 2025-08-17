import {
  FilePlus, Scissors, Archive, FileOutput, FileType, FileText,
  Unlock, Lock, RotateCw, FileImage, Image, FileHeart, Files, Link as LinkIcon, LucideProps
} from "lucide-react";

export type ToolCategory = "Organize" | "Optimize" | "Convert" | "Edit" | "Security";

// This creates a type that maps string names to the actual components.
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
  icon: keyof typeof iconMap; // The icon is now a string name
  color: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  steps: string[];
  isBrowserOnly: boolean;
}

export const tools: Tool[] = [
  {
    value: "merge-pdf",
    label: "Merge PDF",
    h1: "Merge PDF Files",
    description: "Combine multiple PDF documents into one single file.",
    category: "Organize",
    icon: 'FilePlus', // Changed from component to string
    color: "#4A90E2",
    metaTitle: "Merge PDF Files Online | Combine PDFs for Free",
    metaDescription: "Easily merge multiple PDF files into a single document online. Free, fast, and secure PDF merger tool.",
    metaKeywords: "merge pdf, combine pdf, pdf joiner, unite pdf",
    steps: ["Upload your PDFs", "Drag and drop to order them", "Click 'Merge PDF' to combine", "Download your merged file"],
    isBrowserOnly: true,
  },
  {
    value: "split-pdf",
    label: "Split PDF",
    h1: "Split PDF",
    description: "Extract one or more pages from your PDF or save each page as a separate PDF file.",
    category: "Organize",
    icon: 'Scissors', // Changed from component to string
    color: "#50E3C2",
    metaTitle: "Split PDF Files Online | Extract Pages from PDF",
    metaDescription: "Split a PDF file into multiple documents or extract specific pages. Easy-to-use online PDF splitter.",
    metaKeywords: "split pdf, pdf cutter, extract pdf pages",
    steps: ["Upload your PDF", "Select the pages or ranges to split", "Click 'Split PDF'", "Download your new files"],
    isBrowserOnly: true,
  },
  {
    value: "rotate-pdf",
    label: "Rotate PDF",
    h1: "Rotate PDF",
    description: "Rotate one or all pages in your PDF file as you need.",
    category: "Edit",
    icon: 'RotateCw', // Changed from component to string
    color: "#F5A623",
    metaTitle: "Rotate PDF Online | Free PDF Page Rotation",
    metaDescription: "Rotate PDF pages to the left or right permanently. Fix portrait and landscape issues in your document.",
    metaKeywords: "rotate pdf, fix pdf orientation, pdf rotator",
    steps: ["Upload your PDF", "Choose to rotate all pages or select specific ones", "Set the rotation angle (90°, 180°, 270°)", "Download your rotated PDF"],
    isBrowserOnly: true,
  },
  {
    value: "jpg-to-pdf",
    label: "JPG to PDF",
    h1: "JPG to PDF Converter",
    description: "Convert JPG, PNG, BMP, GIF, and TIFF images to PDF.",
    category: "Convert",
    icon: 'Image', // Changed from component to string
    color: "#BD10E0",
    metaTitle: "JPG to PDF Converter | Convert Images to PDF Online",
    metaDescription: "Free online tool to convert your JPG and other image formats to a single PDF file.",
    metaKeywords: "jpg to pdf, image to pdf, png to pdf, convert image",
    steps: ["Upload your JPG or other image files", "Adjust orientation and margins if needed", "Click 'Convert to PDF'", "Download your PDF document"],
    isBrowserOnly: true,
  },
  {
    value: "add-page-numbers",
    label: "Page Numbers",
    h1: "Add Page Numbers to PDF",
    description: "Insert page numbers into your PDF documents with ease.",
    category: "Edit",
    icon: 'FileText', // Changed from component to string
    color: "#7ED321",
    metaTitle: "Add Page Numbers to PDF | Online PDF Paginator",
    metaDescription: "Easily add page numbers to your PDF files. Customize position, format, and range.",
    metaKeywords: "add page numbers pdf, paginate pdf, number pdf pages",
    steps: ["Upload your PDF", "Choose the position and format for the numbers", "Click 'Add Numbers'", "Download your paginated PDF"],
    isBrowserOnly: true,
  },
  {
    value: "compress-pdf",
    label: "Compress PDF",
    h1: "Compress PDF",
    description: "Reduce the file size of your PDF while optimizing for maximal quality.",
    category: "Optimize",
    icon: 'Archive', // Changed from component to string
    color: "#F8E71C",
    metaTitle: "Compress PDF | Reduce PDF File Size Online",
    metaDescription: "The best online tool to reduce PDF file size. Compress your PDFs for easy sharing and storage.",
    metaKeywords: "compress pdf, reduce pdf size, pdf optimizer",
    steps: ["Upload your PDF", "Choose a compression level", "Click 'Compress PDF'", "Download your smaller PDF file"],
    isBrowserOnly: false,
  },
  {
    value: "organize-pdf",
    label: "Organize PDF",
    h1: "Organize PDF",
    description: "Sort, add, and delete pages in your PDF file.",
    category: "Organize",
    icon: 'Files', // Changed from component to string
    color: "#4A90E2",
    metaTitle: "Organize PDF Pages | Sort, Add, and Delete PDF Pages",
    metaDescription: "Easily reorder, add, or remove pages from your PDF document online.",
    metaKeywords: "organize pdf, sort pdf pages, delete pdf pages, reorder pdf",
    steps: ["Upload your PDF", "Drag pages to reorder them, or use the delete button", "Click 'Organize PDF'", "Download the modified file"],
    isBrowserOnly: false,
  },
  {
    value: "repair-pdf",
    label: "Repair PDF",
    h1: "Repair PDF",
    description: "Attempt to recover data from a corrupt or damaged PDF file.",
    category: "Optimize",
    icon: 'FileHeart', // Changed from component to string
    color: "#D0021B",
    metaTitle: "Repair PDF | Fix Damaged PDF Files Online",
    metaDescription: "Try to fix your corrupted PDF files and recover your data with our free online PDF repair tool.",
    metaKeywords: "repair pdf, fix pdf, corrupted pdf, damaged pdf",
    steps: ["Upload your damaged PDF", "Click 'Repair PDF'", "If successful, download the recovered file"],
    isBrowserOnly: false,
  },
  {
    value: "pdf-to-word",
    label: "PDF to Word",
    h1: "PDF to Word Converter",
    description: "Convert your PDF to an editable Word document (DOCX).",
    category: "Convert",
    icon: 'FileType', // Changed from component to string
    color: "#2B78E4",
    metaTitle: "PDF to Word Converter | Convert PDF to DOCX Online",
    metaDescription: "Convert PDFs to editable Microsoft Word documents for free. High-quality conversion.",
    metaKeywords: "pdf to word, pdf to docx, convert pdf to word",
    steps: ["Upload your PDF file", "Click 'Convert to Word'", "Download your editable DOCX file"],
    isBrowserOnly: false,
  },
  {
    value: "word-to-pdf",
    label: "Word to PDF",
    h1: "Word to PDF Converter",
    description: "Convert your Word document (DOCX) to a PDF file.",
    category: "Convert",
    icon: 'FileOutput', // Changed from component to string
    color: "#2B78E4",
    metaTitle: "Word to PDF Converter | Convert DOCX to PDF Online",
    metaDescription: "Easily convert Microsoft Word documents to high-quality PDF files online for free.",
    metaKeywords: "word to pdf, docx to pdf, convert word to pdf",
    steps: ["Upload your Word document", "Click 'Convert to PDF'", "Download your professional PDF"],
    isBrowserOnly: false,
  },
  {
    value: "pdf-to-jpg",
    label: "PDF to JPG",
    h1: "PDF to JPG Converter",
    description: "Extract all images from a PDF or convert each page into a JPG image.",
    category: "Convert",
    icon: 'FileImage', // Changed from component to string
    color: "#BD10E0",
    metaTitle: "PDF to JPG Converter | Convert PDF Pages to Images",
    metaDescription: "Convert each page of your PDF to a high-quality JPG image online.",
    metaKeywords: "pdf to jpg, pdf to image, convert pdf to jpg",
    steps: ["Upload your PDF", "Choose to extract images or convert pages", "Click 'Convert to JPG'", "Download your images as a ZIP file"],
    isBrowserOnly: false,
  },
  {
    value: "html-to-pdf",
    label: "HTML to PDF",
    h1: "HTML to PDF",
    description: "Convert a live webpage into a PDF document by providing a URL.",
    category: "Convert",
    icon: 'LinkIcon', // Changed from component to string
    color: "#F5A623",
    metaTitle: "HTML to PDF | Convert Webpage to PDF",
    metaDescription: "Convert any URL or webpage into a high-quality PDF file that you can download and share.",
    metaKeywords: "html to pdf, url to pdf, webpage to pdf",
    steps: ["Enter the URL of the webpage", "Set page options like size and orientation", "Click 'Convert to PDF'", "Download the resulting PDF"],
    isBrowserOnly: false,
  },
  {
    value: "edit-pdf",
    label: "Edit PDF",
    h1: "Edit PDF",
    description: "Add text, shapes, and annotations to your PDF document.",
    category: "Edit",
    icon: 'FileText', // Changed from component to string
    color: "#7ED321",
    metaTitle: "Edit PDF Online | Free PDF Editor",
    metaDescription: "A simple online PDF editor to add text, highlight, draw, and annotate your PDF files.",
    metaKeywords: "edit pdf, pdf editor, annotate pdf, modify pdf",
    steps: ["Upload your PDF", "Use the toolbar to add text, images, or shapes", "Save your changes", "Download the edited PDF"],
    isBrowserOnly: false,
  },
  {
    value: "unlock-pdf",
    label: "Unlock PDF",
    h1: "Unlock PDF",
    description: "Remove a password and restrictions from your PDF file.",
    category: "Security",
    icon: 'Unlock', // Changed from component to string
    color: "#9013FE",
    metaTitle: "Unlock PDF | Remove PDF Password Online",
    metaDescription: "Remove password protection from your PDF files so you can edit and use them freely. You must have the rights to the file.",
    metaKeywords: "unlock pdf, remove pdf password, pdf password remover",
    steps: ["Upload your protected PDF", "Provide the password if prompted", "Click 'Unlock PDF'", "Download your password-free PDF"],
    isBrowserOnly: false,
  },
  {
    value: "protect-pdf",
    label: "Protect PDF",
    h1: "Protect PDF",
    description: "Add a password to your PDF to encrypt it and protect it from unauthorized access.",
    category: "Security",
    icon: 'Lock', // Changed from component to string
    color: "#000000",
    metaTitle: "Protect PDF | Add Password to PDF Online",
    metaDescription: "Encrypt your PDF files with a password to secure them. Protect sensitive information easily.",
    metaKeywords: "protect pdf, password protect pdf, encrypt pdf, secure pdf",
    steps: ["Upload your PDF", "Set a strong password", "Click 'Protect PDF'", "Download your encrypted file"],
    isBrowserOnly: false,
  },
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
