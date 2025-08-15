import React from "react";
import { Header } from "@/components/Header";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col", "animated-grid-background")}>
      <Header />
      <main className="flex-grow container py-8 md:py-12 bg-background rounded-t-lg shadow-2xl">
        {children}
      </main>
      <footer className="text-center py-6 text-sm text-gray-400 bg-transparent">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Link href="/" className="hover:underline text-gray-300">
            Home
          </Link>
          <span className="text-gray-500">|</span>
          <Link href="/about" className="hover:underline text-gray-300">
            About Us
          </Link>
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>
    </div>
  );
};
