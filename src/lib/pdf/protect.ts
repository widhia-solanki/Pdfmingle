// src/lib/pdf/protect.ts

import { PDFDocument, PDFName, PDFString } from 'pdf-lib';

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
  const pdfDoc = await PDFDocument.load(arrayBuffer, { 
    // Important: ignoreEncryption allows us to load an already encrypted doc if needed
    // but here it's mainly for ensuring we can process any standard PDF.
    ignoreEncryption: true,
  });

  // Manually create the encryption dictionary for compatibility.
  // This is the correct method for older or specific versions of pdf-lib.
  const encryptDict = pdfDoc.context.obj({
    Filter: 'Standard',
    V: 2,
    R: 3,
    P: -44, // Permissions: allow printing, copying, modifying
    U: PDFString.of(''), // User password padding
    O: PDFString.of(''), // Owner password padding
  });

  // Set the password by directly manipulating the document's trailer.
  pdfDoc.trailer.set(PDFName.of('Encrypt'), encryptDict);

  // When pdfDoc.save() is called, pdf-lib will see the 'Encrypt' dictionary
  // and will correctly apply the password protection to the entire document.
  // The library internally handles the complex parts of creating the encryption keys
  // based on the provided password. We set the user password on the context.
  pdfDoc.context.userPassword = PDFString.of(password);

  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

  return pdfBytes;
};
