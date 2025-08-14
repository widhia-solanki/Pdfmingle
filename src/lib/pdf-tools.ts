
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";

// --- MERGE PDF ---
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

// --- SPLIT PDF ---
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
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
    newPdf.addPage(copiedPage);
    const pageBytes = await newPdf.save();
    const pageNumber = String(i + 1).padStart(3, '0');
    zip.file(`page_${pageNumber}.pdf`, pageBytes);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return zipBlob;
}

// --- ROTATE PDF ---
export async function rotatePDF(file: File, angle: 90 | 180 | 270): Promise<Blob> {
  const originalBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(originalBytes);
  const pages = pdfDoc.getPages();
  pages.forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation({ angle: currentRotation + angle });
  });
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

// --- JPG TO PDF ---
export async function jpgToPDF(files: File[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    const image = await pdfDoc.embedJpg(imageBytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

// --- ADD PAGE NUMBERS ---
export async function addPageNumbersPDF(file: File): Promise<Blob> {
  const originalBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(originalBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const pageCount = pages.length;

  for (let i = 0; i < pageCount; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const pageNumberText = `${i + 1} / ${pageCount}`;
    page.drawText(pageNumberText, {
      x: width / 2 - 30,
      y: 30,
      size: 12,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  }
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
