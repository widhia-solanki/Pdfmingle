// src/components/NewMobileMenu.tsx

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, FileQuestion, Info, LogIn, Grid2X2 } from "lucide-react";
import { toolArray, iconMap } from "@/constants/tools";
import Link from "next/link";
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const PDFMingleLogo = () => (
  <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-foreground no-underline">
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M50 0 L20 0 L0 20 L0 50 L30 50 L50 30 Z" fill="#10B981" />
      <path d="M50 0 L80 0 L100 20 L100 50 L70 50 L50 30 Z" fill="#3B82F6" />
      <path d="M50 100 L20 100 L0 80 L0 50 L30 50 L50 70 Z" fill="#2563EB" />
      <path d="M50 100 L80 100 L100 80 L100 50 L70 50 L50 70 Z" fill="#6EE7B7" />
    </svg>
    <div>
      <span className="text-blue-600">PDF</span>
      <span className="text-foreground">Mingle</span>
    </div>
  </Link>
);

// --- THIS IS THE FIX ---
// Create a curated list of the top 5 tools to display directly
const featuredTools = toolArray.filter(tool => 
  ['merge-pdf', 'split-pdf', 'compress-pdf', 'edit-pdf', 'image-to-pdf'].includes(tool.value)
);

export const NewMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground" aria-label="Open Menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 bg-background/80 backdrop-blur-lg border-r border-border flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <PDFMingleLogo />
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-foreground">
              <X className="h-6 w-6" />
            </Button>
          </SheetClose>
        </div>

        <nav className="flex-grow overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="px-3 text-lg font-semibold mb-2 text-foreground">Popular Tools</h2>
            <div className="flex flex-col gap-1">
              {/* Map over the FEATURED tools */}
              {featuredTools.map((tool) => {
                const Icon = iconMap[tool.icon] || FileQuestion;
                const isActive = router.pathname === `/${tool.value}`;
                return (
                  <Link
                    key={tool.value}
                    href={`/${tool.value}`}
                    onClick={() => setIsOpen(false)}
                    className={cn( "flex items-center gap-3 p-3 rounded-md transition-colors", isActive ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground" )}
                  >
                    <Icon className="h-6 w-6" style={{ color: isActive ? 'hsl(var(--primary))' : tool.color }} />
                    <span>{tool.label}</span>
                  </Link>
                );
              })}
              {/* "View All Tools" link below the featured list */}
              <Link href="/#tools" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-md text-primary hover:bg-secondary/80 font-semibold transition-colors mt-2">
                <Grid2X2 className="h-6 w-6" />
                <span>View All Tools</span>
              </Link>
            </div>
          </div>
          
          <Separator />

          {/* Static Links Section - REORDERED */}
          <div className="flex flex-col gap-1 p-3 pt-0">
             <Button variant="outline" className="justify-start gap-3 p-3 h-auto text-muted-foreground hover:text-foreground">
                <LogIn className="h-6 w-6" />
                <span className="font-medium">Login</span>
             </Button>
             <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-md text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">
                <Info className="h-6 w-6 text-muted-foreground" />
                <span className="font-medium">About Us</span>
             </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
