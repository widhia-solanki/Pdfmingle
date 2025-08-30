import React from "react";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { FeedbackButton } from "@/components/FeedbackButton";
import { CustomCursor } from "@/components/CustomCursor"; // <-- Import the new component

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
      
      {/* The footer is now handled by the InformativePanel on the homepage */}
      
      <FeedbackButton />
    </div>
  );
};
