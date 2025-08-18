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
  faqs: { question: string; answer:string; }[];
}

export const tools: Tool[] = [
  // --- BROWSER-ONLY TOOLS ---
  {
    value: "merge-pdf",
    label: "Merge PDF",
    h1: "Merge PDF Files Online",
    description: "Combine multiple PDF documents into one single file.",
    category: "Organize",
    icon: 'FilePlus',
    color: "#4A90E2",
    metaTitle: "Merge PDF Files Online – Free PDF Combiner",
    metaDescription: "Combine multiple PDFs into one document with our free online PDF merger. Fast, secure, and no software to install.",
    metaKeywords: "merge pdf, combine pdf, pdf joiner, unite pdf",
    steps: ["Upload your PDFs", "Drag and drop to order them", "Click 'Merge PDF' to combine", "Download your merged file"],
    isBrowserOnly: true,
    faqs: [
        { question: "How many PDF files can I merge at once?", answer: "You can upload and merge multiple PDF files at once. The specific limit is designed to handle most common use cases." },
        { question: "Can I reorder the files before merging?", answer: "Yes. After uploading your files, you can drag and drop them into your desired order before clicking the merge button." },
        { question: "Is this PDF merger tool safe to use?", answer: "Absolutely. We use SSL encryption for all file transfers and automatically delete all files from our servers after a few hours to protect your privacy." }
    ]
  },
  {
    value: "split-pdf",
    label: "Split PDF",
    h1: "Split a PDF File",
    description: "Extract pages from your PDF or save each page as a separate PDF.",
    category: "Organize",
    icon: 'Scissors',
    color: "#50E3C2",
    metaTitle: "Split PDF - Free Online PDF Page Extractor",
    metaDescription: "Easily split a large PDF into separate files or extract specific pages. Our free online tool is fast, secure, and simple to use.",
    metaKeywords: "split pdf, pdf cutter, extract pdf pages",
    steps: ["Upload your PDF", "Select the pages or ranges to split", "Click 'Split PDF'", "Download your new files in a ZIP archive"],
    isBrowserOnly: true,
    faqs: [
      { question: "Can I select a specific range of pages to extract?", answer: "Yes, our tool allows you to define custom page ranges (e.g., 2-5, 8, 11-13) to extract exactly the pages you need into a new PDF." },
      { question: "Will the split PDFs maintain their original quality?", answer: "Yes, the splitting process does not alter the quality or formatting of your pages. They are simply extracted into new, separate documents." },
      { question: "How are the split files delivered?", answer: "If you split a PDF into multiple new documents, they will be delivered in a single ZIP file for easy downloading." }
    ]
  },
  {
    value: "rotate-pdf",
    label: "Rotate PDF",
    h1: "Rotate PDF Pages",
    description: "Rotate one or all pages in your PDF file permanently.",
    category: "Edit",
    icon: 'RotateCw',
    color: "#F5A623",
    metaTitle: "Rotate PDF Online – Fix PDF Orientation Free",
    metaDescription: "Rotate PDF pages to the left or right permanently. Fix portrait and landscape orientation issues in your document for free.",
    metaKeywords: "rotate pdf, fix pdf orientation, pdf rotator",
    steps: ["Upload your PDF", "Choose to rotate all pages or select specific ones", "Set the rotation angle (90°, 180°, 270°)", "Download your rotated PDF"],
    isBrowserOnly: true,
    faqs: [
        { question: "Can I rotate only one page in a PDF?", answer: "Yes, our tool provides an option to rotate all pages at once or to select and rotate specific pages individually." },
        { question: "Is the rotation permanent?", answer: "Yes, when you download the file, the rotation is saved permanently in the PDF document." },
        { question: "What rotation angles are supported?", answer: "You can rotate your PDF pages by 90 degrees clockwise, 90 degrees counter-clockwise (270 degrees), or 180 degrees (upside down)." }
    ]
  },
  {
    value: "jpg-to-pdf",
    label: "JPG to PDF",
    h1: "Convert JPG to PDF",
    description: "Convert JPG, PNG, and other image formats to a PDF file.",
    category: "Convert",
    icon: 'Image',
    color: "#BD10E0",
    metaTitle: "JPG to PDF Converter – Convert Images to PDF Free",
    metaDescription: "Free online tool to convert your JPG and other image formats like PNG, GIF, and TIFF into a single, professional PDF file.",
    metaKeywords: "jpg to pdf, image to pdf, png to pdf, convert image",
    steps: ["Upload your JPG or other image files", "Adjust orientation and margins if needed", "Click 'Convert to PDF'", "Download your PDF document"],
    isBrowserOnly: true,
    faqs: [
      { question: "Can I convert multiple JPGs into one PDF?", answer: "Yes, you can upload multiple images at once. Our tool will combine them into a single PDF document in the order you uploaded them." },
      { question: "What other image formats do you support?", answer: "Besides JPG, our converter also supports PNG, GIF, BMP, and TIFF image formats." },
      { question: "Can I adjust the page size or orientation?", answer: "Yes, our tool offers options to set the page orientation (portrait or landscape) and margins before you convert the images to PDF." }
    ]
  },
  {
    value: "add-page-numbers",
    label: "Page Numbers",
    h1: "Add Page Numbers to PDF",
    description: "Insert page numbers into your PDF documents with ease.",
    category: "Edit",
    icon: 'FileText',
    color: "#7ED321",
    metaTitle: "Add Page Numbers to PDF Free – Online PDF Paginator",
    metaDescription: "Easily add page numbers to your PDF files online. Customize the position, format, and range for your page numbers.",
    metaKeywords: "add page numbers pdf, paginate pdf, number pdf pages",
    steps: ["Upload your PDF", "Choose the position and format for the numbers", "Click 'Add Numbers'", "Download your paginated PDF"],
    isBrowserOnly: true,
    faqs: [
      { question: "Can I choose where the page numbers appear?", answer: "Yes, you can choose the position of the page numbers, such as top-left, bottom-center, top-right, etc." },
      { question: "Can I apply page numbers to only a specific range of pages?", answer: "Yes, our tool allows you to specify a page range so that numbers are only added to the pages you select." },
      { question: "Is it possible to customize the format of the numbers?", answer: "Our tool provides several common formatting options to ensure the page numbers match the style of your document." }
    ]
  },

  // --- BACKEND-REQUIRED TOOLS ---
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
    value: "organize-pdf",
    label: "Organize PDF",
    h1: "Organize PDF Pages",
    description: "Sort, add, and delete pages in your PDF file.",
    category: "Organize",
    icon: 'Files',
    color: "#4A90E2",
    metaTitle: "Organize PDF Pages Free – Sort & Delete Pages",
    metaDescription: "Easily reorder, add, or remove pages from your PDF document online with our free organization tool.",
    metaKeywords: "organize pdf, sort pdf pages, delete pdf pages, reorder pdf",
    steps: ["Upload your PDF", "Drag pages to reorder them, or use the delete button", "Click 'Organize PDF'", "Download the modified file"],
    isBrowserOnly: false,
    faqs: [
      { question: "Can I move multiple pages at once?", answer: "Yes, our interface allows you to select and drag multiple pages to reorder your document more quickly." },
      { question: "Is it possible to add a blank page to my PDF?", answer: "Yes, you can insert blank pages at any point in your document using the organization tool." },
      { question: "Will organizing my PDF affect the file's quality?", answer: "No, reorganizing, deleting, or adding pages will not affect the visual quality of your document's content." }
    ]
  },
  {
    value: "repair-pdf",
    label: "Repair PDF",
    h1: "Repair a Damaged PDF",
    description: "Attempt to recover data from a corrupt or damaged PDF file.",
    category: "Optimize",
    icon: 'FileHeart',
    color: "#D0021B",
    metaTitle: "Repair PDF Online – Fix Corrupted PDF Files",
    metaDescription: "Try to fix your corrupted or damaged PDF files and recover your data with our free online PDF repair tool.",
    metaKeywords: "repair pdf, fix pdf, corrupted pdf, damaged pdf",
    steps: ["Upload your damaged PDF", "Click the 'Repair PDF' button", "If successful, preview and download the recovered file"],
    isBrowserOnly: false,
    faqs: [
      { question: "Can all corrupted PDF files be repaired?", answer: "While our tool has a high success rate, some files may be too damaged to be fully recovered. We will always attempt the best possible repair." },
      { question: "Is my data secure when I upload a file for repair?", answer: "Yes, your file is handled securely and is automatically deleted from our servers after the repair process is complete." },
      { question: "How do I know if my PDF is corrupted?", answer: "Common signs of a corrupted PDF include being unable to open the file, seeing error messages, or having missing or garbled content." }
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
  {
    value: "word-to-pdf",
    label: "Word to PDF",
    h1: "Word to PDF Converter",
    description: "Convert your Word document (DOCX) to a high-quality PDF file.",
    category: "Convert",
    icon: 'FileOutput',
    color: "#2B78E4",
    metaTitle: "Word to PDF Converter Free – DOCX to PDF Online",
    metaDescription: "Easily convert Microsoft Word documents to high-quality PDF files online. Free, fast, and preserves your formatting.",
    metaKeywords: "word to pdf, docx to pdf, convert word to pdf",
    steps: ["Upload your Word document", "Click 'Convert to PDF'", "Download your professional PDF"],
    isBrowserOnly: false,
    faqs: [
      { question: "Will my Word document look the same as a PDF?", answer: "Yes, converting to PDF is the best way to preserve your document's formatting, fonts, and images, ensuring it looks the same on any device." },
      { question: "Can I convert older .DOC files to PDF?", answer: "Yes, our converter supports both modern .DOCX files and older .DOC formats." },
      { question: "Is the conversion process secure?", answer: "Absolutely. Your file is uploaded over a secure connection and is deleted from our servers shortly after conversion." }
    ]
  },
  {
    value: "pdf-to-jpg",
    label: "PDF to JPG",
    h1: "PDF to JPG Converter",
    description: "Convert each page of a PDF into high-quality JPG images.",
    category: "Convert",
    icon: 'FileImage',
    color: "#BD10E0",
    metaTitle: "Convert PDF to JPG Free - High Quality Image Converter",
    metaDescription: "Convert each page of your PDF into a high-quality JPG image online. Fast, free, and easy to use for all your conversion needs.",
    metaKeywords: "pdf to jpg, pdf to image, convert pdf to jpg",
    steps: ["Upload your PDF", "Choose to convert all pages or select a range", "Click 'Convert to JPG'", "Download your images as a ZIP file"],
    isBrowserOnly: false,
    faqs: [
      { question: "Can I choose the image quality (DPI) of the JPG?", answer: "Our tool provides different quality settings, allowing you to balance file size and image resolution for your needs." },
      { question: "Will it convert every page of the PDF?", answer: "Yes, by default it converts every page into a separate JPG image. You also have the option to select specific pages to convert." },
      { question: "How do I download the converted images?", answer: "All the generated JPG images will be bundled into a single ZIP file for a convenient one-click download." }
    ]
  },
  {
    value: "html-to-pdf",
    label: "HTML to PDF",
    h1: "HTML to PDF Converter",
    description: "Convert a live webpage into a PDF document by providing a URL.",
    category: "Convert",
    icon: 'LinkIcon',
    color: "#F5A623",
    metaTitle: "HTML to PDF – Convert Webpage to PDF Online",
    metaDescription: "Convert any public webpage into a high-quality PDF file by simply entering its URL. Perfect for archiving articles or saving online receipts.",
    metaKeywords: "html to pdf, url to pdf, webpage to pdf",
    steps: ["Enter the URL of the webpage", "Set page options like size and orientation", "Click 'Convert to PDF'", "Download the resulting PDF"],
    isBrowserOnly: false,
    faqs: [
      { question: "Can I convert any website to PDF?", answer: "You can convert any publicly accessible webpage. Pages that require a login or are behind a firewall cannot be accessed by our tool." },
      { question: "Will the PDF look exactly like the webpage?", answer: "Our tool aims to preserve the layout and content of the webpage as accurately as possible, but dynamic or interactive elements may not be included." },
      { question: "Is it possible to adjust the PDF output?", answer: "Yes, we provide options to change the page size (e.g., A4, Letter), orientation (portrait, landscape), and other settings to customize your PDF." }
    ]
  },
  {
    value: "edit-pdf",
    label: "Edit PDF",
    h1: "Edit PDF Online",
    description: "Add text, shapes, highlights, and annotations to your PDF document.",
    category: "Edit",
    icon: 'FileText',
    color: "#7ED321",
    metaTitle: "Edit PDF Online Free – Free PDF Editor",
    metaDescription: "A simple online PDF editor to add text, highlight content, draw shapes, and annotate your PDF files directly in your browser.",
    metaKeywords: "edit pdf, pdf editor, annotate pdf, modify pdf",
    steps: ["Upload your PDF", "Use the toolbar to add text, images, or shapes", "Save your changes", "Download the edited PDF"],
    isBrowserOnly: false,
    faqs: [
      { question: "Can I edit the existing text in a PDF?", answer: "Our editor allows you to add new text, images, and shapes on top of the PDF. Editing the original, underlying text is a more complex feature that we are developing." },
      { question: "Are my edits saved automatically?", answer: "You will need to click the 'Save' or 'Download' button to process and finalize your edits into a new PDF file." },
      { question: "Is this online PDF editor secure?", answer: "Yes, your files and the edits you make are processed securely and are deleted from our servers after you have downloaded your document." }
    ]
  },
  {
    value: "unlock-pdf",
    label: "Unlock PDF",
    h1: "Unlock a PDF File",
    description: "Remove password and restrictions from your PDF file.",
    category: "Security",
    icon: 'Unlock',
    color: "#9013FE",
    metaTitle: "Unlock PDF & Remove Password - Free Online Tool",
    metaDescription: "Easily remove password protection and editing restrictions from your PDF file. You must have the rights to the file to unlock it.",
    metaKeywords: "unlock pdf, remove pdf password, pdf password remover",
    steps: ["Upload your protected PDF", "Confirm you have the rights to the file", "Click 'Unlock PDF'", "Download your password-free PDF"],
    isBrowserOnly: false,
    faqs: [
      { question: "Is it legal to remove a password from a PDF?", answer: "You should only remove passwords from PDFs that you own or have explicit permission to edit. By using our service, you agree that you have the necessary rights to the file." },
      { question: "What if I don't know the password?", answer: "Our tool can remove owner passwords that restrict editing or printing. However, if the PDF requires a user password to open, you will need to provide it to unlock the file." },
      { question: "Does this remove all restrictions, like printing and copying?", answer: "Yes, the unlocking process aims to remove all permission-based restrictions, allowing you to print, copy, and edit the document freely." }
    ]
  },
  {
    value: "protect-pdf",
    label: "Protect PDF",
    h1: "Protect PDF with a Password",
    description: "Add a password to your PDF to encrypt it and prevent unauthorized access.",
    category: "Security",
    icon: 'Lock',
    color: "#000000",
    metaTitle: "Protect PDF with Password - Free Online PDF Encryption",
    metaDescription: "Add a strong password to your PDF to encrypt it and prevent unauthorized access. Secure your sensitive documents for free.",
    metaKeywords: "protect pdf, password protect pdf, encrypt pdf, secure pdf",
    steps: ["Upload your PDF", "Set a strong password", "Click 'Protect PDF'", "Download your encrypted file"],
    isBrowserOnly: false,
    faqs: [
      { question: "How strong is the encryption used to protect my PDF?", answer: "We use strong AES encryption to protect your PDF, which is the industry standard for securing documents." },
      { question: "Can I remove the password later if I need to?", answer: "Yes, you can use our 'Unlock PDF' tool to remove the password, provided you remember what it is." },
      { question: "What happens if I forget the password I set?", answer: "We do not store your password, so it cannot be recovered. Please make sure to save your password in a secure place, as you will not be able to open the file without it." }
    ]
  },
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
