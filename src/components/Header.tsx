import { PDFMingleLogo } from "./PDFMingleLogo";
import { MobileNav } from "./MobileNav";
import { ToolsMenu } from "./ToolsMenu";
import { usePathname } from 'next/navigation'; // 1. CORRECT IMPORT for Next.js

export const Header = () => {
  const pathname = usePathname(); // 2. CORRECT HOOK to get the current URL path
  const isHomePage = pathname === '/'; // 3. CORRECT LOGIC to check if it's the homepage

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Only show the hamburger menu on the homepage */}
          {isHomePage && (
            <div className="md:hidden">
              <MobileNav />
            </div>
          )}
          <PDFMingleLogo />
        </div>
        <ToolsMenu />
      </div>
    </header>
  );
};
