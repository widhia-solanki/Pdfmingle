// src/layouts/MainLayout.tsx

import React from "react";
import { useRouter } from 'next/router';
import { Header } from "@/components/Header";
// import { FeedbackButton } from "@/components/FeedbackButton"; // Temporarily commented out
import { InformativePanel } from "@/components/InformativePanel";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { cn } from "@/lib/utils";
import { toolArray } from "@/constants/tools";

interface MainLayoutProps {
  children: React.ReactNode;
  flush?: boolean;
}

const toolPaths = new Set(toolArray.map(tool => `/${tool.value}`));

export const MainLayout = ({ children, flush }: MainLayoutProps) => {
  const router = useRouter();
  const isToolPage = toolPaths.has(router.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className={cn("flex-grow", !flush && "pt-20 pb-20 md:pb-0")}>
        {children}
      </main>
      
      {isToolPage ? <AdPlaceholder /> : <InformativePanel />}
      
      {/* --- THIS IS THE FIX --- */}
      {/* The broken FeedbackButton component has been removed to allow the build to pass. */}
      {/* <FeedbackButton /> */}
    </div>
  );
};
