import React from "react";
import { Header } from "@/components/Header";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FeedbackButton } from "@/components/FeedbackButton"; // 1. IMPORT the new component

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col")}>
      <Header />
      <main className="flex-grow container py-8 md:py-12 bg-background">
        {children}
      </main>
      <footer className="text-center py-6 text-sm text-gray-600 border-t">
        <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 mb-4 px-4">
          <Link href="/about" className="hover:underline">About Us</Link>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>

      {/* 2. ADD the FeedbackButton here */}
      <FeedbackButton />
    </div>
  );
};
