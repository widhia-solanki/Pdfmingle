// src/layouts/MainLayout.tsx

import React from "react";
import { Header } from "@/components/Header";
import { FeedbackButton } from "@/components/FeedbackButton";
import { InformativePanel } from "@/components/InformativePanel";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  flush?: boolean; // 1. Add the optional 'flush' property
}

export const MainLayout = ({ children, flush }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg">
      <Header />
      {/* --- THIS IS THE FIX --- */}
      {/* 2. Conditionally apply the padding class */}
      <main className={cn("flex-grow", !flush && "pt-20")}>
        {children}
      </main>
      
      <InformativePanel />
      
      <FeedbackButton />
    </div>
  );
};
