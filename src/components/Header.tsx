import { PDFMingleLogo } from "./PDFMingleLogo";
import { MobileNav } from "./ToolsMenu"; 
import { ToolsMenu } from "./ToolsMenu";
import { usePathname } from 'next/navigation'; // 1. CORRECT hook

export const Header = () => {
  const pathname = usePathname(); // 2. Correct path
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
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
