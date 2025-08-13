import Link from 'next/link'; // 1. CORRECT IMPORT for Next.js

export const PDFMingleLogo = () => (
  // 2. USE 'href' INSTEAD OF 'to'
  <Link href="/" className="flex items-center text-2xl font-bold tracking-tighter text-ilovepdf-text no-underline">
    <span className="text-ilovepdf-red">PDF</span>Mingle
  </Link>
);
