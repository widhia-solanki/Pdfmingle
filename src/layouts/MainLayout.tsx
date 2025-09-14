// src/layouts/MainLayout.tsx

import React from "react";
import { Header } from "@/components/Header";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Footer } from "@/components/Footer"; // Import our new Footer component
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
      {/* We now render the simple, robust Footer component. */}
      {/* All complex logic has been moved out of this file. */}
      <Footer />
      
      <FeedbackButton />
    </div>
  );
};
