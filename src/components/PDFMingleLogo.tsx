import Link from 'next/link';
import { PDFMingleIcon } from './PDFMingleIcon'; // 1. Import the new icon

export const PDFMingleLogo = () => (
  // 2. Use Flexbox to align the icon and text
  <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-ilovepdf-text no-underline">
    <PDFMingleIcon className="h-7 w-7" /> {/* 3. Add the icon */}
    <span>
      <span className="text-ilovepdf-red">PDF</span>Mingle
    </span>
  </Link>
);
