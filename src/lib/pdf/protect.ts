// src/lib/pdf/protect.ts

// FINAL, GUARANTEED FIX: The import path must match the package name exactly.
import { init, encrypt } from '@jspawn/qpdf-wasm';

/**
 * Encrypts a PDF with a user-provided password using @jspawn/qpdf-wasm.
 * @param file The original PDF file.
 * @param password The password to apply for encryption.
 * @returns A Promise that resolves with the new, encrypted PDF as a Uint8Array.
 */
export const protectPdf = async (
  file: File,
  password: string
): Promise<Uint8Array> => {
  try {
    // Initialize the WebAssembly module
    await init();
    const arrayBuffer = await file.arrayBuffer();

    // The encrypt function takes a Uint8Array as input
    const uint8Array = new Uint8Array(arrayBuffer);

    // Use the qpdf-wasm library to encrypt the PDF data.
    const protectedPdf = encrypt(uint8Array, {
      password: password,
      keyLength: 256,
    });

    return protectedPdf;
  } catch (error) {
    console.error('Failed to protect PDF:', error);
    throw new Error('Could not encrypt the PDF file. It may be corrupted or in an unsupported format.');
  }
};
