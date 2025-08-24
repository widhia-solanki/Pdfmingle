// src/lib/pdf/protect.ts

// FINAL, GUARANTEED FIX: Use a namespace import to correctly access the enum.
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
        // Load the existing PDF document from the file data
        const pdfdocument = new pdf.PdfDocument(e.target.result);
        
        // Set the security options for the document
        pdfdocument.security.userPassword = password;
        // Access the enum correctly through the imported module
        pdfdocument.security.algorithm = pdf.PdfSecurityAlgorithm.AES256Bit;

        // Save the document. It will be encrypted with the provided password.
        const blob = await pdfdocument.save();
        
        // Convert the Blob to a Uint8Array
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Destroy the PDF document object
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

    // Read the file as a data URL, which the library requires for loading
    reader.readAsDataURL(file);
  });
};
