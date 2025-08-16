import Image from 'next/image';
import Link from "next/link";

export const PDFMingleLogo = () => (
  <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-ilovepdf-text no-underline">
    {/* This uses the Next.js Image component for optimization */}
    <Image 
      src="/pdfmingle_logo.png" 
      width={32} 
      height={32} 
      alt="PDFMingle Logo" 
      priority={true} // Helps load the logo faster
    />
    <span className="text-ilovepdf-red">PDF</span>
    <span>Mingle</span>
  </Link>
);
