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
const toolPaths = new Set(toolArray.map(tool => tool ? `/${tool.value}` : null).filter(Boolean));

export const MainLayout = ({ children, flush }: MainLayoutProps) => {
  const router = useRouter();
  const isToolPage = toolPaths.has(router.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className={cn("flex-grow", !flush && "pt-20 pb-20 md:pb-0")}>
        {children}
      </main>
      
      {/* --- THIS IS THE FIX --- */}
      {/* We render the footer/ad placeholder in a separate div outside of the main flex container */}
      {/* This prevents complex conditional rendering from breaking the build */}
      <div>
        {isToolPage ? <AdPlaceholder /> : <InformativePanel />}
      </div>
      
      <FeedbackButton />
    </div>
  );
};
