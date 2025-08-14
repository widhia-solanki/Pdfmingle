import React from "react";
import { Header } from "@/components/Header";
import Link from "next/link"; // Use Next.js Link

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container py-8 md:py-12">
        {/* The current page is passed as 'children' in Next.js */}
        {children}
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground border-t">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Link href="/" className="hover:underline text-gray-600">
            Home
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/about" className="hover:underline text-gray-600">
            About Us
          </Link>
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>
    </div>
  );
};
