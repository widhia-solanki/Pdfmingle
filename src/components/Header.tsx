import { PDFMingleLogo } from "./PDFMingleLogo";
import { MobileNav } from "./MobileNav";
import { ToolsMenu } from "./ToolsMenu";
import { useRouter } from "next/navigation";

export const Header = () => {
  const pathname = useRouter().pathname

  const isHomePage = pathname === '/';
  

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
