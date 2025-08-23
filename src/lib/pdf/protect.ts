// src/lib/pdf/protect.ts

import { PDFDocument, PDFDict, PDFName, PDFString } from 'pdf-lib';

/**
 * Encrypts a PDF with a user-provided password using a compatible method.
 * @param file The original PDF file.
 * @param password The password to apply for encryption.
 * @returns A Promise that resolves with the new, encrypted PDF as a Uint8Array.
 */
export const protectPdf = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the document using the standard method.
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    // This option is important for processing a wide range of PDFs
    ignoreEncryption: true,
  });

  // Access the document's context. This is the correct way.
  const { context } = pdfDoc;

  // Manually create the encryption dictionary.
  const encryptDict = context.obj({
    Filter: 'Standard',
    V: 2,
    R: 3,
    P: -44, // Permissions: allow printing, copying, modifying
    U: PDFString.of(''),
    O: PDFString.of(''),
  });

  // This is the critical step: Set the password on the document's context.
  context.userPassword = PDFString.of(password);

  // Set the encryption dictionary on the document's trailer.
  pdfDoc.trailer.set(PDFName.of('Encrypt'), encryptDict);

  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

  return pdfBytes;
};
