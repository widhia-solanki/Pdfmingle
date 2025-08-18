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
  {
    value: "merge-pdf",
    label: "Merge PDF",
    h1: "Merge PDF Online",
    description: "Combine multiple PDF files into one instantly. Fast, free, and secure online PDF merger.",
    category: "Organize",
    icon: 'FilePlus',
    color: "#4A90E2",
    metaTitle: "Merge PDF Online – Free & Secure",
    metaDescription: "Combine multiple PDF files into one instantly. Fast, free, and secure online PDF merger.",
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
    h1: "Split PDF Online",
    description: "Separate PDF pages or extract sections easily. Free, secure, and fast PDF splitter.",
    category: "Organize",
    icon: 'Scissors',
    color: "#50E3C2",
    metaTitle: "Split PDF Online – Extract Pages Free",
    metaDescription: "Separate PDF pages or extract sections easily. Free, secure, and fast PDF splitter.",
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
    value: "compress-pdf",
    label: "Compress PDF",
    h1: "Compress PDF Online",
    description: "Shrink PDF file size without losing quality. Quick, secure, and free online PDF compressor.",
    category: "Optimize",
    icon: 'Archive',
    color: "#F8E71C",
    metaTitle: "Compress PDF Online – Reduce File Size",
    metaDescription: "Shrink PDF file size without losing quality. Quick, secure, and free online PDF compressor.",
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
    h1: "Convert PDF to Word Online",
    description: "Convert PDFs into editable Word documents in seconds. Accurate, free, and easy PDF to Word converter.",
    category: "Convert",
    icon: 'FileType',
    color: "#2B78E4",
    metaTitle: "Convert PDF to Word Online – Free",
    metaDescription: "Convert PDFs into editable Word documents in seconds. Accurate, free, and easy PDF to Word converter.",
    metaKeywords: "pdf to word, convert pdf to word, pdf to docx",
    steps: ["Upload your PDF file", "Click 'Convert to Word'", "Download your editable DOCX file in seconds"],
    isBrowserOnly: false,
    faqs: [
        { question: "Will my formatting be preserved when converting from PDF to Word?", answer: "Our converter does its best to preserve the original layout, images, and text formatting. However, very complex PDFs may see minor differences." },
        { question: "Is the converted Word document fully editable?", answer: "Yes. The output is a standard .DOCX file that you can open and edit in Microsoft Word, Google Docs, or any other compatible software." },
        { question: "Can I convert scanned PDFs to Word?", answer: "Our standard converter works best with text-based PDFs. For scanned documents, OCR is required, which is a feature we are exploring for a future update." }
    ]
  },
  {
    value: "word-to-pdf",
    label: "Word to PDF",
    h1: "Word to PDF Converter – Free Online",
    description: "Convert Word documents (DOCX) to PDF with one click. Free, secure, and reliable.",
    category: "Convert",
    icon: 'FileOutput',
    color: "#2B78E4",
    metaTitle: "Word to PDF Converter – Free Online",
    metaDescription: "Convert Word documents (DOCX) to PDF with one click. Free, secure, and reliable.",
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
    value: "pdf-to-excel",
    label: "PDF to Excel",
    h1: "PDF to Excel Converter – Free Online",
    description: "Extract tables and convert PDF files into Excel spreadsheets instantly.",
    category: "Convert",
    icon: 'FileType',
    color: "#1D6F42",
    metaTitle: "PDF to Excel Converter – Free Online",
    metaDescription: "Extract tables and convert PDF files into Excel spreadsheets instantly.",
    metaKeywords: "pdf to excel, convert pdf to excel, pdf to xlsx",
    steps: ["Upload your PDF", "Click 'Convert to Excel'", "Download your editable spreadsheet"],
    isBrowserOnly: false,
    faqs: [
        { question: "Can this tool extract complex tables accurately?", answer: "Our tool uses advanced data extraction to accurately convert tables from your PDF to Excel rows and columns. Accuracy may vary with highly complex layouts." },
        { question: "Will my formulas be preserved?", answer: "The converter extracts the text and data from your PDF. It does not transfer Excel formulas, which you would need to re-apply in the spreadsheet." },
        { question: "Can it handle scanned PDFs with tables?", answer: "For scanned documents, OCR technology is needed to recognize text. This feature is planned for a future update for best results." }
    ]
  },
  {
    value: "excel-to-pdf",
    label: "Excel to PDF",
    h1: "Excel to PDF Converter – Free Online",
    description: "Convert Excel sheets to PDF quickly and securely. Free online Excel to PDF tool.",
    category: "Convert",
    icon: 'FileOutput',
    color: "#1D6F42",
    metaTitle: "Excel to PDF Converter – Free Online",
    metaDescription: "Convert Excel sheets to PDF quickly and securely. Free online Excel to PDF tool.",
    metaKeywords: "excel to pdf, xlsx to pdf, convert excel to pdf",
    steps: ["Upload your Excel file", "Adjust settings like page orientation", "Click 'Convert to PDF'", "Download your formatted PDF"],
    isBrowserOnly: false,
    faqs: [
      { question: "Will the entire Excel workbook be converted?", answer: "You can choose to convert the active sheet, specific sheets, or the entire workbook into a single PDF." },
      { question: "How will my Excel charts and graphs look in the PDF?", answer: "The conversion process is designed to preserve the formatting of your charts, graphs, and tables, ensuring the PDF looks just like your spreadsheet." },
      { question: "Can I set the page orientation for my PDF?", answer: "Yes, our tool provides options to set the page orientation to portrait or landscape to best fit your Excel data." }
    ]
  },
  {
    value: "pdf-to-powerpoint",
    label: "PDF to PowerPoint",
    h1: "PDF to PPT Converter – Free Online",
    description: "Convert PDFs to editable PowerPoint slides in seconds. Free and accurate PDF to PPT tool.",
    category: "Convert",
    icon: 'FileType',
    color: "#D04423",
    metaTitle: "PDF to PPT Converter – Free Online",
    metaDescription: "Convert PDFs to editable PowerPoint slides in seconds. Free and accurate PDF to PPT tool.",
    metaKeywords: "pdf to powerpoint, pdf to ppt, convert pdf to ppt",
    steps: ["Upload your PDF", "Click 'Convert to PPT'", "Download your editable presentation"],
    isBrowserOnly: false,
    faqs: [
      { question: "Will each PDF page become a separate PowerPoint slide?", answer: "Yes, the standard conversion process turns each page of your PDF into an individual, editable slide in the PowerPoint presentation." },
      { question: "Can I edit the text and images after converting?", answer: "Absolutely. The goal of the conversion is to provide an editable PPTX file where you can modify text, images, and other elements." },
      { question: "How accurate is the formatting?", answer: "Our tool strives for high accuracy in preserving the original layout, but complex PDFs may require minor formatting adjustments in PowerPoint." }
    ]
  },
  {
    value: "powerpoint-to-pdf",
    label: "PowerPoint to PDF",
    h1: "PPT to PDF Converter – Free Online",
    description: "Turn PowerPoint presentations into PDFs instantly. Free, secure, and simple PPT to PDF tool.",
    category: "Convert",
    icon: 'FileOutput',
    color: "#D04423",
    metaTitle: "PPT to PDF Converter – Free Online",
    metaDescription: "Turn PowerPoint presentations into PDFs instantly. Free, secure, and simple PPT to PDF tool.",
    metaKeywords: "powerpoint to pdf, ppt to pdf, convert ppt to pdf",
    steps: ["Upload your PowerPoint file", "Click 'Convert to PDF'", "Download your universally shareable PDF"],
    isBrowserOnly: false,
    faqs: [
      { question: "Why should I convert my PowerPoint to a PDF?", answer: "Converting to PDF ensures that your presentation's formatting, fonts, and images are preserved and viewable on any device, regardless of whether they have PowerPoint installed." },
      { question: "Will my animations and transitions be included in the PDF?", answer: "No, the PDF format does not support animations or transitions. The PDF will be a static version of your slides." },
      { question: "Does this tool support both .PPT and .PPTX formats?", answer: "Yes, our converter works with both modern .PPTX files and older .PPT formats." }
    ]
  },
  {
    value: "jpg-to-pdf", // Image to PDF
    label: "Image to PDF",
    h1: "Image to PDF Converter – JPG/PNG to PDF",
    description: "Convert JPG, PNG, and other images into PDF documents easily. Free and secure.",
    category: "Convert",
    icon: 'Image',
    color: "#BD10E0",
    metaTitle: "Image to PDF Converter – JPG/PNG to PDF",
    metaDescription: "Convert JPG, PNG, and other images into PDF documents easily. Free and secure.",
    metaKeywords: "image to pdf, jpg to pdf, png to pdf",
    steps: ["Upload your JPG or other image files", "Adjust orientation and margins if needed", "Click 'Convert to PDF'", "Download your PDF document"],
    isBrowserOnly: true,
    faqs: [
      { question: "Can I convert multiple images into a single PDF?", answer: "Yes, you can upload multiple images at once. Our tool will combine them into a single PDF document in the order you uploaded them." },
      { question: "What other image formats do you support?", answer: "Besides JPG, our converter also supports PNG, GIF, BMP, and TIFF image formats." },
      { question: "Can I adjust the page size or orientation?", answer: "Yes, our tool offers options to set the page orientation (portrait or landscape) and margins before you convert the images to PDF." }
    ]
  },
  {
    value: "pdf-to-jpg", // PDF to Image
    label: "PDF to Image",
    h1: "PDF to JPG/PNG – Convert PDF to Images",
    description: "Extract pages from PDFs and save them as JPG or PNG images. Free online converter.",
    category: "Convert",
    icon: 'FileImage',
    color: "#BD10E0",
    metaTitle: "PDF to JPG/PNG – Convert PDF to Images",
    metaDescription: "Extract pages from PDFs and save them as JPG or PNG images. Free online converter.",
    metaKeywords: "pdf to jpg, pdf to image, convert pdf to png",
    steps: ["Upload your PDF", "Choose image format (JPG or PNG)", "Click 'Convert'", "Download your images in a ZIP file"],
    isBrowserOnly: false,
    faqs: [
      { question: "What is the difference between converting to JPG and PNG?", answer: "JPG is great for photos and offers smaller file sizes, while PNG is ideal for graphics with sharp lines or transparency." },
      { question: "Can I choose the image quality?", answer: "Yes, our tool provides different quality settings, allowing you to balance file size and image resolution for your needs." },
      { question: "Will it convert every page of the PDF?", answer: "Yes, by default it converts every page into a separate image. You also have the option to select specific pages to convert." }
    ]
  },
  {
    value: "protect-pdf",
    label: "Protect PDF",
    h1: "Protect PDF with Password – Free Online",
    description: "Secure your PDF by adding a password. Lock PDFs online safely and for free.",
    category: "Security",
    icon: 'Lock',
    color: "#000000",
    metaTitle: "Protect PDF with Password – Free Online",
    metaDescription: "Secure your PDF by adding a password. Lock PDFs online safely and for free.",
    metaKeywords: "protect pdf, password protect pdf, encrypt pdf",
    steps: ["Upload your PDF", "Set a strong password", "Click 'Protect PDF'", "Download your encrypted file"],
    isBrowserOnly: false,
    faqs: [
      { question: "How strong is the encryption used to protect my PDF?", answer: "We use strong AES encryption to protect your PDF, which is the industry standard for securing documents." },
      { question: "Can I remove the password later if I need to?", answer: "Yes, you can use our 'Unlock PDF' tool to remove the password, provided you remember what it is." },
      { question: "What happens if I forget the password I set?", answer: "We do not store your password, so it cannot be recovered. Please make sure to save your password in a secure place, as you will not be able to open the file without it." }
    ]
  },
  {
    value: "unlock-pdf",
    label: "Unlock PDF",
    h1: "Unlock PDF – Remove Password Online",
    description: "Remove passwords from locked PDFs instantly. Free, safe, and quick PDF unlocker.",
    category: "Security",
    icon: 'Unlock',
    color: "#9013FE",
    metaTitle: "Unlock PDF – Remove Password Online",
    metaDescription: "Remove passwords from locked PDFs instantly. Free, safe, and quick PDF unlocker.",
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
    value: "rotate-pdf",
    label: "Rotate PDF",
    h1: "Rotate PDF Pages – Free Online Tool",
    description: "Rotate and flip PDF pages easily. Free, secure, and simple to use online tool.",
    category: "Edit",
    icon: 'RotateCw',
    color: "#F5A623",
    metaTitle: "Rotate PDF Pages – Free Online Tool",
    metaDescription: "Rotate and flip PDF pages easily. Free, secure, and simple to use online tool.",
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
    value: "esign-pdf",
    label: "eSign PDF",
    h1: "Sign PDF Online – Add Digital Signatures",
    description: "Add your electronic signature to PDFs quickly. Free and secure PDF signing tool.",
    category: "Security",
    icon: 'FileHeart', // Placeholder, consider a more fitting icon
    color: "#FF4136",
    metaTitle: "Sign PDF Online – Add Digital Signatures",
    metaDescription: "Add your electronic signature to PDFs quickly. Free and secure PDF signing tool.",
    metaKeywords: "esign pdf, sign pdf, digital signature, electronic signature",
    steps: ["Upload your PDF", "Create or upload your signature", "Place your signature on the document", "Download your signed PDF"],
    isBrowserOnly: false,
    faqs: [
      { question: "Is an electronic signature legally binding?", answer: "Electronic signatures are legally recognized in many countries around the world for most types of documents. However, you should consult local laws for specific requirements." },
      { question: "Can I create my own signature?", answer: "Yes, our tool allows you to draw your signature, type it, or upload an image of your signature." },
      { question: "Can others sign the same document?", answer: "Our current tool is designed for a single user to sign a document. Multi-signer workflows are a feature we are considering for the future." }
    ]
  },
  {
    value: "edit-pdf",
    label: "Edit PDF",
    h1: "Edit PDF Online – Free PDF Editor",
    description: "Edit text, images, and pages in PDF files instantly. Free and user-friendly PDF editor.",
    category: "Edit",
    icon: 'FileText',
    color: "#7ED321",
    metaTitle: "Edit PDF Online – Free PDF Editor",
    metaDescription: "Edit text, images, and pages in PDF files instantly. Free and user-friendly PDF editor.",
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
    value: "organize-pdf",
    label: "Organize PDF",
    h1: "Organize PDF Pages – Free Online Tool",
    description: "Reorder, arrange, and manage PDF pages effortlessly. Free and secure.",
    category: "Organize",
    icon: 'Files',
    color: "#4A90E2",
    metaTitle: "Organize PDF Pages – Free Online Tool",
    metaDescription: "Reorder, arrange, and manage PDF pages effortlessly. Free and secure.",
    metaKeywords: "organize pdf, sort pdf pages, delete pdf pages, reorder pdf",
    steps: ["Upload your PDF", "Drag pages to reorder them, or use the delete button", "Click 'Organize PDF'", "Download the modified file"],
    isBrowserOnly: false,
    faqs: [
      { question: "Can I move multiple pages at once?", answer: "Yes, our interface allows you to select and drag multiple pages to reorder your document more quickly." },
      { question: "Is it possible to add a blank page to my PDF?", answer: "Yes, you can insert blank pages at any point in your document using the organization tool." },
      { question: "Will organizing my PDF affect the file's quality?", answer: "No, reorganizing, deleting, or adding pages will not affect the visual quality of your document's content." }
    ]
  },
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
