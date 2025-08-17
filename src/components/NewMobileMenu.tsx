import { useState } from 'react'; // 1. Import useState
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"; // 2. Import SheetClose
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { tools } from "@/constants/tools";
import Link from "next/link";
import { PDFMingleLogo } from "./PDFMingleLogo";

export const MobileNav = () => {
  // 3. Add state to control the menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-ilovepdf-text" aria-label="Open Menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      {/* 4. The SheetContent now has a transparent background */}
      <SheetContent side="left" className="p-4 overflow-y-auto bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <PDFMingleLogo />
          {/* This is now the ONLY close button */}
          <SheetClose asChild>
             <Button variant="ghost" size="icon" aria-label="Close Menu">
                <span className="text-2xl font-light" aria-hidden="true">&times;</span>
             </Button>
          </SheetClose>
        </div>
        <h2 className="text-lg font-semibold mb-4">All PDF Tools</h2>
        <nav className="flex flex-col gap-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              // 5. Clicking a link now also closes the menu
              <Link
                key={tool.value}
                href={`/${tool.value}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
              >
                <Icon className={`h-6 w-6 ${tool.color}`} />
                <span className="font-medium">{tool.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
