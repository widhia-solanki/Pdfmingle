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
        {/* --- THIS IS THE UPDATED SECTION --- */}
        <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 mb-4 px-4">
          <Link href="/about" className="hover:underline text-gray-300">
            About Us
          </Link>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <Link href="/privacy" className="hover:underline text-gray-300">
            Privacy Policy
          </Link>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <Link href="/terms" className="hover:underline text-gray-300">
            Terms & Conditions
          </Link>
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>
    </div>
  );
};
