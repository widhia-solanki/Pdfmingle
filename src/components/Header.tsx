import React from 'react';
import Link from 'next/link';

/**
 * The main header component for the PDFMingle application.
 * It provides navigation and branding.
 */
export function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* Logo and App Name */}
            <Link href="/" className="flex-shrink-0 font-bold text-xl text-slate-800">
                PDFMingle
            </Link>
          </div>
          {/* Add other navigation items here if needed */}
        </div>
      </div>
    </header>
  );
}

// Default export for easy import
export default Header;
