import { Header } from "@/components/Header";
import Link from "next/link"; // 1. IMPORT Link from Next.js
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container py-8 md:py-12">
        {/* The current page will be rendered here */}
        {children}
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground border-t">
        {/* 2. ADD a navigation section to the footer */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <Link href="/" className="hover:underline text-gray-600">
            Home
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/about" className="hover:underline text-gray-600">
            About Us
          </Link>
          {/* You can add more links here later, like Contact or Privacy Policy */}
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>
    </div>
  );
};
