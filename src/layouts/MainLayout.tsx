import React from "react";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { FeedbackButton } from "@/components/FeedbackButton";
import { CustomCursor } from "@/components/CustomCursor"; // <-- Import the new component

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
 <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg">
      <CustomCursor />
      <Header />
      {/* --- THIS IS THE FIX --- */}
      {/* Added pt-20 to offset the sticky h-20 header */}
      <main className="flex-grow pt-20">
        {children}
      </main>
      
      {/* The footer is now handled by the InformativePanel on the homepage */}
      <InformativePanel />
      
      <FeedbackButton />
    </div>
  );
};
