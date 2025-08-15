import { Header } from "@/components/Header";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils"; // Import cn utility

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    // --- THIS IS THE FIX ---
    // The animated-grid-background class is added here
    <div className={cn("min-h-screen flex flex-col", "animated-grid-background")}>
      <Header />
      {/* The bg-background class on <main> ensures your page content has a solid background */}
      <main className="flex-grow container py-8 md:py-12 bg-background">
        {children}
      </main>
      {/* The footer will sit on the animated background */}
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
