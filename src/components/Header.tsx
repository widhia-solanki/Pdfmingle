import { PDFMingleLogo } from "./PDFMingleLogo";
import { MobileNav } from "./MobileNav";
import { ToolsMenu } from "./ToolsMenu";
import { DesktopNav } from "./DesktopNav"; // Import the new component

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile hamburger menu, hidden on medium screens and up */}
          <div className="md:hidden">
            <MobileNav />
          </div>
          <PDFMingleLogo />

          {/* Desktop navigation, hidden on small screens */}
          <div className="hidden md:flex md:ml-6">
            <DesktopNav />
          </div>
        </div>

        {/* The grid menu on the right */}
        <ToolsMenu />
      </div>
    </header>
  );
};```

After you **commit these two changes**, your website will have the correct, functional desktop navigation, and the header will appear as it should.
