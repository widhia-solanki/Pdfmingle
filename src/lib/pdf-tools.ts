import { PDFDocument } from "pdf-lib";
import JSZip from "jszip"; // 1. IMPORT the new JSZip library

// This function is unchanged
export async function mergePDFs(files: File[]): Promise<Blob> {
  const pdfFiles = files.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
  if (pdfFiles.length < 2) {
    throw new Error("Please select at least two PDF files to merge.");
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of pdfFiles) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes], { type: "application/pdf" });
}

// 2. CREATE the new splitPDF function
export async function splitPDF(file: File): Promise<Blob> {
  if (!file || file.type !== "application/pdf") {
    throw new Error("Please select a valid PDF file to split.");
  }

  const originalBytes = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(originalBytes);
  const pageCount = originalPdf.getPageCount();

  if (pageCount <= 1) {
    throw new Error("The selected PDF has only one page and cannot be split.");
  }

  const zip = new JSZip();

  for (let i = 0; i < pageCount; i++) {
    // Create a new document for each page
    const newPdf = await PDFDocument.create();
    // Copy the page from the original document
    const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
    newPdf.addPage(copiedPage);

    // Save the new single-page PDF to bytes
    const pageBytes = await newPdf.save();

    // Add the single-page PDF to the zip file
    const pageNumber = String(i + 1).padStart(3, '0'); // e.g., 001, 002
    zip.file(`page_${pageNumber}.pdf`, pageBytes);
  }

  // Generate the ZIP file as a Blob
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return zipBlob;
}
