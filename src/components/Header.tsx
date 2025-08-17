import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* The hamburger menu has also been removed as per the last step */}
          
          {/* This is your logo and brand name */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-ilovepdf-text no-underline">
            <svg
              width="32"
              height="32"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M50 0 L20 0 L0 20 L0 50 L30 50 L50 30 Z" fill="#10B981" />
              <path d="M50 0 L80 0 L100 20 L100 50 L70 50 L50 30 Z" fill="#3B82F6" />
              <path d="M50 100 L20 100 L0 80 L0 50 L30 50 L50 70 Z" fill="#2563EB" />
              <path d="M50 100 L80 100 L100 80 L100 50 L70 50 L50 70 Z" fill="#6EE7B7" />
            </svg>
            <div>
              <span className="text-ilovepdf-red">PDF</span>Mingle
            </div>
          </Link>
        </div>

        {/* 
          --- THIS IS THE FIX ---
          The <ToolsMenu /> component has been completely removed from this file.
          This will make the grid icon disappear.
          --- END OF THE FIX ---
        */}
      </div>
    </header>
  );
};
