import { PDFDocument, rgb, StandardFonts, RotationTypes } from "pdf-lib";
import JSZip from "jszip";

export async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes], { type: "application/pdf" });
}

export async function splitPDF(file: File): Promise<Blob> {
  const originalBytes = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(originalBytes);
  const pageCount = originalPdf.getPageCount();
  if (pageCount <= 1) throw new Error("PDF must have more than one page to split.");
  
  const zip = new JSZip();
  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
    newPdf.addPage(copiedPage);
    const pageBytes = await newPdf.save();
    zip.file(`page_${String(i + 1).padStart(3, '0')}.pdf`, pageBytes);
  }
  return zip.generateAsync({ type: "blob" });
}

export async function rotatePDF(file: File, angle: 90 | 180 | 270): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  pdfDoc.getPages().forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation({ type: RotationTypes.Degrees, angle: currentRotation + angle });
  });
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

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

export async function addPageNumbersPDF(file: File): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    page.drawText(`${i + 1} / ${pages.length}`, {
      x: width / 2 - 20,
      y: 20,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
  }
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
