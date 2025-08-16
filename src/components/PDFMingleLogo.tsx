// src/components/PDFMingleLogo.tsx
import Image from 'next/image'
import Link from "next/link";

export const PDFMingleLogo = () => (
    // We replace Link
    <Link href="/" className="flex items-center gap-3 text-2xl font-bold tracking-tighter text-ilovepdf-text no-underline">
        <Image src="/pdfmingle_logo.png" width={48} height={48} alt="PDFMingle Logo" priority />
        <span>PDFMingle</span>
    </Link>
);
