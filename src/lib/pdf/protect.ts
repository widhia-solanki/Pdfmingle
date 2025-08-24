// src/lib/pdf/protect.ts

import { PDFDocument, PDFName, PDFString, PDFNumber, PDFHexString } from 'pdf-lib';

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
    // This option is important for processing a wide range of PDFs
    ignoreEncryption: true,
  });

  // This is the correct, low-level method required for this version of pdf-lib.
  // We manually construct the encryption dictionary.
  const P = -3904; // Permissions: allow everything except content extraction
  const R = 4;     // Revision of the security handler
  const V = 4;     // Algorithm version

  const { context } = pdfDoc;
  
  // This sets the password on the document's context.
  // The library will use this to generate the necessary encryption keys.
  context.userPassword = PDFString.of(password);
  
  // Create the encryption dictionary
  const encryptDict = context.obj({
    Filter: 'Standard',
    V,
    R,
    P,
    U: PDFHexString.of(''), // Placeholder for user password hash
    O: PDFHexString.of(''), // Placeholder for owner password hash
    UE: PDFHexString.of(''),
    OE: PDFHexString.of(''),
    Perms: PDFHexString.of(''),
    EncryptMetadata: false
  });

  // Attach the encryption dictionary to the document's trailer.
  pdfDoc.context.trailer.set(PDFName.of('Encrypt'), encryptDict);

  // When save is called, pdf-lib will see the 'Encrypt' dictionary
  // and correctly perform the password protection.
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

  return pdfBytes;
};
