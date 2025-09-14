// src/components/NewMobileMenu.tsx

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, FileQuestion } from "lucide-react";
import { toolArray, iconMap } from "@/constants/tools";
import Link from "next/link";
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';

const PDFMingleLogo = () => (
  // Use `text-foreground` to adapt to the theme
  <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-foreground no-underline">
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M50 0 L20 0 L0 20 L0 50 L30 50 L50 30 Z" fill="#10B981" />
      <path d="M50 0 L80 0 L100 20 L100 50 L70 50 L50 30 Z" fill="#3B82F6" />
      <path d="M50 100 L20 100 L0 80 L0 50 L30 50 L50 70 Z" fill="#2563EB" />
      <path d="M50 100 L80 100 L100 80 L100 50 L70 50 L50 70 Z" fill="#6EE7B7" />
    </svg>
    <div>
      <span className="text-blue-600">PDF</span>
      {/* Use `text-foreground` here as well */}
      <span className="text-foreground">Mingle</span>
    </div>
  </Link>
);

export const NewMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {/* Use `text-foreground` for the menu icon */}
        <Button variant="ghost" size="icon" className="text-foreground" aria-label="Open Menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        // THE FIX:
        // - `bg-background/80`: Uses the theme's background with transparency. In light mode, this is white/80. In dark mode, it's a dark color with 80% opacity.
        // - `border-r border-border`: Uses the theme's border color.
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

        <nav className="flex-grow overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-2 text-foreground">All PDF Tools</h2>
          <div className="flex flex-col gap-1">
            {toolArray.map((tool) => {
              const Icon = iconMap[tool.icon] || FileQuestion;
              const isActive = router.pathname === `/${tool.value}`;
              return (
                <Link
                  key={tool.value}
                  href={`/${tool.value}`}
                  onClick={() => setIsOpen(false)}
                  // THE FIX:
                  // - Use semantic colors for text, hover, and active states.
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md transition-colors",
                    isActive 
                      ? "bg-secondary text-primary font-semibold" 
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" style={{ color: isActive ? 'hsl(var(--primary))' : tool.color }} />
                  <span>{tool.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
