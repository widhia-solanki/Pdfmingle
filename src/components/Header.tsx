import Link from 'next/link';
import { NewMobileMenu } from './NewMobileMenu';
import { ToolsMenu } from './ToolsMenu';

export const Header = () => {
  return (
    // The sticky header with a white background and bottom border
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo and Brand Name - always visible */}
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold tracking-tighter text-gray-800 no-underline">
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
            {/* --- THIS IS THE FIX --- */}
            <span className="text-blue-600">PDF</span>Mingle
          </div>
        </Link>

        {/* Navigation Menus - always visible and responsive */}
        <div className="flex items-center gap-2">
          {/* Desktop Menu (hidden on mobile) */}
          <div className="hidden md:flex">
            <ToolsMenu />
          </div>
          {/* Mobile Menu (only visible on mobile) */}
          <div className="md:hidden">
            <NewMobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
