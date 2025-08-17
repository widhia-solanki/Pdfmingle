import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, FileQuestion } from "lucide-react";
import { tools, iconMap } from "@/constants/tools";
import Link from "next/link";

const PDFMingleLogo = () => (
  <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-gray-800 no-underline">
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M50 0 L20 0 L0 20 L0 50 L30 50 L50 30 Z" fill="#10B981" />
      <path d="M50 0 L80 0 L100 20 L100 50 L70 50 L50 30 Z" fill="#3B82F6" />
      <path d="M50 100 L20 100 L0 80 L0 50 L30 50 L50 70 Z" fill="#2563EB" />
      <path d="M50 100 L80 100 L100 80 L100 50 L70 50 L50 70 Z" fill="#6EE7B7" />
    </svg>
    <div>
      {/* --- THIS IS THE FIX --- */}
      <span className="text-blue-600">PDF</span>Mingle
    </div>
  </Link>
);

export const NewMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-800" aria-label="Open Menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <PDFMingleLogo />
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-6 w-6" />
            </Button>
          </SheetClose>
        </div>

        <nav className="flex-grow overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">All PDF Tools</h2>
          <div className="flex flex-col gap-1">
            {tools.map((tool) => {
              const Icon = iconMap[tool.icon] || FileQuestion;
              return (
                <Link
                  key={tool.value}
                  href={`/${tool.value}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Icon className="h-6 w-6" style={{ color: tool.color }} />
                  <span className="font-medium text-gray-700">{tool.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
