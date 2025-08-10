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
};```

---

### Step 3: Replace the Old `PDFProcessor` with the New Tool UI

The biggest change is on the tool pages. We will completely replace your old `PDFProcessor` component with a new one that matches the iLovePDF layout.

**Action:** Replace the entire content of `src/components/PDFProcessor.tsx` with this new code.

```tsx
import { useRef } from "react";
import { Button } from "@/components/ui/button";
// We will create these icon components next
import GoogleDriveIcon from "@/components/GoogleDriveIcon"; 
import DropboxIcon from "@/components/DropboxIcon";

export const PDFProcessor = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
      <Button 
        onClick={handleFileSelect}
        className="w-full max-w-xs h-16 text-xl font-bold bg-ilovepdf-red hover:bg-ilovepdf-red-dark text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        aria-label="Select PDF files from your computer"
      >
        Select PDF files
      </Button>
      <input type="file" ref={fileInputRef} className="hidden" multiple accept=".pdf" />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white border shadow-sm hover:bg-gray-100" aria-label="Select files from Google Drive">
          <GoogleDriveIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white border shadow-sm hover:bg-gray-100" aria-label="Select files from Dropbox">
          <DropboxIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
