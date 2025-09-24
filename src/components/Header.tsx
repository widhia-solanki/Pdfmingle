// src/components/Header.tsx

import Link from 'next/link';
import { NewMobileMenu } from './NewMobileMenu';
import { ToolsMenu } from './ToolsMenu';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        
        {/* --- THIS IS THE FIX --- */}
        {/* On mobile (default), show the menu. Hide it on medium screens and up. */}
        <div className="md:hidden">
          <NewMobileMenu />
        </div>

        {/* Logo and Brand Name */}
        {/* On mobile, this will be pushed to the center. On desktop, it's on the left. */}
        <div className="flex-1 md:flex-none">
          <Link href="/" className="flex items-center justify-center md:justify-start gap-3 text-2xl font-bold tracking-tighter text-foreground no-underline">
            <svg
              width="36"
              height="36"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M50 0 L20 0 L0 20 L0 50 L30 50 L50 30 Z" fill="#10B981" />
              <path d="M50 0 L80 0 L100 20 L100 50 L70 50 L50 30 Z" fill="#3B82F6" />
              <path d="M50 100 L20 100 L0 80 L0 50 L30 50 L50 70 Z" fill="#2563EB" />
              <path d="M50 100 L80 100 L100 80 L100 50 L70 50 L50 70 Z" fill="#6EE7B7" />
            </svg>
            <div className="text-3xl">
              <span className="text-blue-600">PDF</span>
              <span className="text-foreground">Mingle</span>
            </div>
          </Link>
        </div>

        {/* Desktop Menu - visible on medium screens and up */}
        <div className="hidden md:flex flex-1 justify-end">
          <ToolsMenu />
        </div>

        {/* Spacer for mobile to balance the menu button and center the logo */}
        <div className="w-8 md:hidden" aria-hidden="true" />

      </div>
    </header>
  );
};
