// src/constants/tool-config.ts

export interface ToolConfig {
  value: string; // The URL slug (e.g., 'merge-pdf')
  label: string; // The display name (e.g., 'Merge PDF')
  description: string;
  actionButtonText: string;
  acceptedFileTypes: { [key: string]: string[] }; // Mime types for validation
}

export const toolConfigs: ToolConfig[] = [
  { value: 'merge-pdf', label: 'Merge PDF', description: 'Combine multiple PDF files into a single document.', actionButtonText: 'Merge Now', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'split-pdf', label: 'Split PDF', description: 'Extract pages from a PDF file.', actionButtonText: 'Split Now', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'compress-pdf', label: 'Compress PDF', description: 'Reduce the file size of your PDF.', actionButtonText: 'Compress Now', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'pdf-to-word', label: 'PDF to Word', description: 'Convert your PDF to an editable Word document.', actionButtonText: 'Convert to Word', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'word-to-pdf', label: 'Word to PDF', description: 'Convert a Word document to a PDF file.', actionButtonText: 'Convert to PDF', acceptedFileTypes: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'application/msword': ['.doc'] } },
  { value: 'pdf-to-excel', label: 'PDF to Excel', description: 'Convert your PDF to an Excel spreadsheet.', actionButtonText: 'Convert to Excel', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'excel-to-pdf', label: 'Excel to PDF', description: 'Convert an Excel spreadsheet to a PDF file.', actionButtonText: 'Convert to PDF', acceptedFileTypes: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] } },
  { value: 'pdf-to-ppt', label: 'PDF to PPT', description: 'Convert your PDF to a PowerPoint presentation.', actionButtonText: 'Convert to PPT', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'ppt-to-pdf', label: 'PPT to PDF', description: 'Convert a PowerPoint presentation to a PDF.', actionButtonText: 'Convert to PDF', acceptedFileTypes: { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'], 'application/vnd.ms-powerpoint': ['.ppt'] } },
  { value: 'image-to-pdf', label: 'Image to PDF', description: 'Convert JPG, PNG, and other images to a PDF file.', actionButtonText: 'Convert to PDF', acceptedFileTypes: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/gif': ['.gif'] } },
  { value: 'pdf-to-image', label: 'PDF to Image', description: 'Convert a PDF file to JPG or PNG images.', actionButtonText: 'Convert to Image', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'protect-pdf', label: 'Protect PDF', description: 'Add a password to protect your PDF file.', actionButtonText: 'Protect Now', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'unlock-pdf', label: 'Unlock PDF', description: 'Remove a password from your PDF file.', actionButtonText: 'Unlock Now', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'rotate-pdf', label: 'Rotate PDF', description: 'Rotate the pages in your PDF file.', actionButtonText: 'Rotate Now', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'esign-pdf', label: 'eSign PDF', description: 'Add your electronic signature to a PDF.', actionButtonText: 'Sign Now', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'edit-pdf', label: 'Edit PDF', description: 'Edit text, images, and pages in your PDF.', actionButtonText: 'Start Editing', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
  { value: 'organize-pdf', label: 'Organize PDF', description: 'Reorder, delete, and manage PDF pages.', actionButtonText: 'Organize Now', acceptedFileTypes: { 'application/pdf': ['.pdf'] } },
];

// A helper function to easily find a tool's config by its value/slug
export const getToolConfig = (value: string) => toolConfigs.find(t => t.value === value);
