// src/layouts/MainLayout.tsx

import React from "react";
import { Header } from "@/components/Header";
import { FeedbackButton } from "@/components/FeedbackButton";
// --- THIS IS THE FIX ---
import { InformativePanel } from "@/components/InformativePanel"; 
import { CustomCursor } from "@/components/CustomCursor";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg">
      <CustomCursor />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      
      <InformativePanel />
      
      <FeedbackButton />
    </div>
  );
};
