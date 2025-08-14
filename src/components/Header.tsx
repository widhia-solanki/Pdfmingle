import { PDFMingleLogo } from "./PDFMingleLogo";
import { MobileNav } from "./MobileNav";
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
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
        {/* The <ToolsMenu /> component has been removed from here */}
      </div>
    </header>
  );
};```

### Summary of the Changes:

1.  **Removed Import:** The line `import { ToolsMenu } from "./ToolsMenu";` has been deleted.
2.  **Removed Component:** The `<ToolsMenu />` component at the end of the header layout has been deleted.

After you commit this change, the header will be updated, and the grid menu icon on the right side will be completely gone.

**Optional Cleanup:** For a perfectly clean project, you can now also safely **delete** the file `src/components/ToolsMenu.tsx`, as it is no longer being used anywhere.
