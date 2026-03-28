// src/types/jspawn__qpdf-wasm.d.ts

declare module '@jspawn/qpdf-wasm' {
  export function init(): Promise<void>;

  interface EncryptOptions {
    password: string;
    keyLength?: 128 | 256;
  }

  export function encrypt(data: Uint8Array, options: EncryptOptions): Uint8Array;

  // Add other functions here if you use them in the future
  // For now, we only need init and encrypt
}
