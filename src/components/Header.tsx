import { PDFMingleLogo } from "./PDFMingleLogo";
import { MobileNav } from "./MobileNav";
import { ToolsMenu } from "./ToolsMenu";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <MobileNav />
          </div>
          <PDFMingleLogo />
        </div>
        <ToolsMenu />
      </div>
    </header>
  );
};
