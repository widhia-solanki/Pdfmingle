// src/lib/pdf/protect.ts

// FINAL, GUARANTEED FIX: Use a namespace import and the correct load() -> set -> save() pattern.
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
        // Step 1: Create a new, empty PdfDocument object.
        const pdfdocument = new pdf.PdfDocument();
        
        // Step 2: Load the existing PDF document from the file data.
        pdfdocument.load(e.target.result);
        
        // Step 3: Now that the document is loaded, access the security object and set the password.
        pdfdocument.security.userPassword = password;
        pdfdocument.security.algorithm = pdf.PdfSecurityAlgorithm.AES256Bit;

        // Step 4: Save the document to apply the encryption.
        const blob = await pdfdocument.save();
        
        // Convert the Blob to a Uint8Array
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Step 5: Clean up the document object from memory.
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
