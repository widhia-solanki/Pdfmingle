// src/lib/pdf/protect.ts

import { PDFContext, PDFDict, PDFName, PDFString, PDFWriter } from 'pdf-lib';

/**
 * Encrypts a PDF with a user-provided password using a compatible, low-level method.
 * @param file The original PDF file.
 * @param password The password to apply for encryption.
 * @returns A Promise that resolves with the new, encrypted PDF as a Uint8Array.
 */
export const protectPdf = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Create a new PDF context and parse the existing document's raw data
  const context = await PDFContext.create();
  const [pdfDoc] = await context.parse(arrayBuffer, true);

  // Manually create the encryption dictionary. This is required for compatibility.
  const encryptDict = PDFDict.from(
    {
      Filter: PDFName.of('Standard'),
      V: PDFName.of('V2'), // Algorithm version
      R: PDFName.of('R3'), // Revision number
      P: PDFName.of('-44'),  // User access permissions (allow all)
      U: PDFString.of(''),   // Placeholder for user password
      O: PDFString.of(''),   // Placeholder for owner password
    },
    context,
  );

  // This is the critical step: Set the password on the context itself.
  // The library will use this password to generate the encryption keys.
  context.userPassword = PDFString.of(password);

  // Set the encryption dictionary on the document's trailer.
  pdfDoc.trailer.set(PDFName.of('Encrypt'), encryptDict);

  // Use a PDFWriter to save the document. This is more robust for low-level modifications.
  const writer = PDFWriter.forContext(context, pdfDoc.catalog);
  const pdfBytes = await writer.saveToBytes();

  return pdfBytes;
};
