import Link from "next/link";

export const PDFMingleLogo = () => (
  // THIS IS THE FIX: Using 'href' instead of 'to'
  <Link href="/" className="flex items-center text-2xl font-bold tracking-tighter text-ilovepdf-text no-underline">
    <span className="text-ilovepdf-red">PDF</span>Mingle
  </Link>
);
