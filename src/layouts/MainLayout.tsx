import { Header } from "@/components/Header";
import Link from "next/link";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayoutComponent = ({ children }: MainLayoutProps) => { // Renamed to avoid conflict
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container py-8 md:py-12">
        {children}
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground border-t">
        <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
          <Link href="/" className="hover:underline text-gray-600">
            Home
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/about" className="hover:underline text-gray-600">
            About Us
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/terms" className="hover:underline text-gray-600">
            Terms & Conditions
          </Link>
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>
    </div>
  );
};

export const MainLayout = MainLayoutComponent; // Keep named export for consistency if needed elsewhere
export default MainLayoutComponent; // Add default export for _app.tsx
