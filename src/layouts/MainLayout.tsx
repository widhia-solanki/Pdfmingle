// src/layouts/MainLayout.tsx

import React from "react";
import { Header } from "@/components/Header";
import { FeedbackButton } from "@/components/FeedbackButton";
import { InformativePanel } from "@/components/InformativePanel";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg">
      <Header />
      {/* --- THIS IS THE FIX --- */}
      {/* All padding is removed. Pages are now responsible for their own spacing. */}
      <main className="flex-grow">
        {children}
      </main>
      
      <InformativePanel />
      
      <FeedbackButton />
    </div>
  );
};
