import Link from "next/link";

export const PDFMingleLogo = () => (
  <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-ilovepdf-text no-underline">
    {/* 
      THIS IS THE FIX:
      1. Use a standard <img> tag for reliability.
      2. Use a simple text string with a space for the branding.
    */}
    <img 
      src="/pdfmingle_logo.png" 
      width={32} 
      height={32} 
      alt="PDFMingle Logo" 
    />
    <span>
      <span className="text-ilovepdf-red">PDF</span> Mingle
    </span>
  </Link>
);
