// src/lib/pdf/protect.ts

// FINAL, GUARANTEED FIX: Use a single namespace import to access all library components.
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
        // Step 1: Create a new PdfDocument object.
        const pdfdocument = new pdf.PdfDocument();
        
        // Step 2: Create a new PdfSecurity object from the imported module.
        const security = new pdf.PdfSecurity();

        // Step 3: Set the password and algorithm on the new security object.
        security.userPassword = password;
        security.algorithm = pdf.PdfSecurityAlgorithm.AES256Bit;

        // Step 4: Assign the configured security object to the document.
        pdfdocument.security = security;
        
        // Step 5: Load the existing PDF data into the document.
        pdfdocument.load(e.target.result);

        // Step 6: Save the document to apply the encryption.
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

    // The library's load() method requires a base64 string.
    reader.readAsDataURL(file);
  });
};
