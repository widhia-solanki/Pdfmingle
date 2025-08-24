// src/lib/pdf/protect.ts

import * as pdf from '@syncfusion/ej2-pdf-export';

/**
 * Encrypts a PDF with a user-provided password using @syncfusion/ej2-pdf-export.
 * @param file The original PDF file.
 * @param password The password to apply for encryption.
 * @returns A Promise that resolves with the new, encrypted PDF as a Uint8Array.
 */
export const protectPdf = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        // The correct method is to pass the base64 string directly to the constructor
        const pdfdocument = new pdf.PdfDocument(e.target.result);
        
        // Now, set the security options on the loaded document
        pdfdocument.security.userPassword = password;
        pdfdocument.security.algorithm = pdf.PdfSecurityAlgorithm.AES256Bit;

        // Save the document to apply the encryption.
        const blob = await pdfdocument.save();
        
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        pdfdocument.destroy();
        
        resolve(uint8Array);
      } catch (error) {
        console.error('Failed to protect PDF:', error);
        reject(new Error('Could not encrypt the PDF file. It may be corrupted or in an unsupported format.'));
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };

    // The library's constructor requires the PDF data as a base64 string.
    reader.readAsDataURL(file);
  });
};
