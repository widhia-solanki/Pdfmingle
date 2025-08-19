// src/lib/pdf/rotate.ts
export const rotatePDF = async (file: File, angle: number): Promise<Uint8Array> => {
  const { PDFDocument, RotationTypes } = await import('pdf-lib');
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pages = pdfDoc.getPages();
  pages.forEach(page => {
    const currentRotation = page.getRotation().angle;
    page.setRotation({ type: RotationTypes.Degrees, angle: currentRotation + angle });
  });

  return pdfDoc.save();
};
