import React from "react";
import { Header } from "@/components/Header";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FeedbackButton } from "@/components/FeedbackButton";
import { CookieConsent } from "@/components/CookieConsent"; // 1. IMPORT the new component

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="text-center py-6 text-sm text-gray-600 border-t bg-white">
        <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 mb-4 px-4">
          <Link href="/about" className="hover:underline text-gray-500">
            About Us
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <Link href="/privacy" className="hover:underline text-gray-500">
            Privacy Policy
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <Link href="/terms" className="hover:underline text-gray-500">
            Terms & Conditions
          </Link>
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>
      
      <FeedbackButton />
      
      {/* 2. ADD the CookieConsent component here */}
      <CookieConsent />
    </div>
  );
};
