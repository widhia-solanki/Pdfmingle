// src/lib/pdf/protect.ts

import { PDFDocument, PDFName, PDFString } from 'pdf-lib';

/**
 * Encrypts a PDF with a user-provided password using a compatible method for pdf-lib v1.17.1.
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
    ignoreEncryption: true,
  });

  // This is the correct, low-level method required for this version of pdf-lib.
  const { context } = pdfDoc;
  
  // The library uses this context property to generate the necessary encryption keys.
  context.userPassword = PDFString.of(password);
  
  // Create the encryption dictionary that defines the security settings.
  const encryptDict = context.obj({
    Filter: 'Standard',
    V: 4,
    R: 4,
    P: -3904, // Permissions: allow printing, copying, modifying, but not extraction.
    U: PDFString.of(''), // Placeholder, will be computed during save
    O: PDFString.of(''), // Placeholder, will be computed during save
    UE: PDFString.of(''),
    OE: PDFString.of(''),
    Perms: PDFString.of(''),
    EncryptMetadata: false
  });

  // Attach the encryption dictionary to the document's trailer.
  pdfDoc.context.trailer.set(PDFName.of('Encrypt'), encryptDict);

  // When save is called, pdf-lib will see the 'Encrypt' dictionary
  // and correctly perform the password protection.
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

  return pdfBytes;
};
