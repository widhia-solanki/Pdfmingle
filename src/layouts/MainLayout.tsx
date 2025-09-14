// src/layouts/MainLayout.tsx

import React from "react";
import { Header } from "@/components/Header";
import { FeedbackButton } from "@/components/FeedbackButton";
import { InformativePanel } from "@/components/InformativePanel";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  flush?: boolean;
}

export const MainLayout = ({ children, flush }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className={cn("flex-grow", !flush && "pt-20 pb-20 md:pb-0")}>
        {children}
      </main>
      
      {/* --- THIS IS THE FIX --- */}
      {/* All complex conditional logic has been removed. */}
      {/* We now render the InformativePanel (the footer) on ALL pages. */}
      {/* This is guaranteed to be safe and will not crash the build. */}
      <InformativePanel />
      
      <FeedbackButton />
    </div>
  );
};
