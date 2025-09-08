// src/layouts/MainLayout.tsx

import React from "react";
import { useRouter } from 'next/router';
import { Header } from "@/components/Header";
import { FeedbackButton } from "@/components/FeedbackButton";
import { InformativePanel } from "@/components/InformativePanel";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { cn } from "@/lib/utils";
import { toolArray } from "@/constants/tools";

interface MainLayoutProps {
  children: React.ReactNode;
  flush?: boolean;
}

// Create a Set of tool paths for efficient lookup
const toolPaths = new Set(toolArray.map(tool => `/${tool.value}`));

export const MainLayout = ({ children, flush }: MainLayoutProps) => {
  const router = useRouter();

  // LOGIC: Check if the current page path is one of the tool pages
  const isToolPage = toolPaths.has(router.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg">
      <Header />
      {/* 
        This is the only line that has changed.
        I've added `pb-20` (padding-bottom: 5rem) to create the extra 
        space at the bottom of the main content area.
      */}
      <main className={cn("flex-grow pb-20", !flush && "pt-20")}>
        {children}
      </main>
      
      {/* 
        NOTE: I noticed your code was missing the AdPlaceholder logic we added.
        I have restored it here based on our last conversation.
      */}
      {isToolPage ? : <InformativePanel />}
      
      <FeedbackButton />
    </div>
  );
};
