// src/layouts/MainLayout.tsx

import React from "react";
import { useRouter } from 'next/router';
import { Header } from "@/components/Header";
import { FeedbackButton } from "@/components/FeedbackButton";
import { InformativePanel } from "@/components/InformativePanel";
import { cn } from "@/lib/utils";
import { toolArray } from "@/constants/tools"; // IMPORT: Get the list of tools

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
      <main className={cn("flex-grow", !flush && "pt-20")}>
        {children}
      </main>
      
      {/* 
        CONDITIONAL RENDER: 
        The InformativePanel (footer) will ONLY be rendered if the current
        page is NOT a tool page.
      */}
      {!isToolPage && <InformativePanel />}
      
      <FeedbackButton />
    </div>
  );
};
