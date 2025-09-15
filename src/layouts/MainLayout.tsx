// src/layouts/MainLayout.tsx

import React from "react";
import { useRouter } from 'next/router';
import { Header } from "@/components/Header";
import { FeedbackButton } from "@/components/FeedbackButton";
import { InformativePanel } from "@/components/InformativePanel";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { cn } from "@/lib/utils";
import { toolArray } from "@/constants/tools";

// --- THIS IS THE FIX ---
// The missing interface has been restored.
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
      
      {/* The FeedbackButton is correctly re-enabled */}
      <FeedbackButton />
    </div>
  );
};
