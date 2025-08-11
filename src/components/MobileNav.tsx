import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { tools } from "@/constants/tools";
import { Link } from "react-router-dom";
import { PDFMingleLogo } from "./PDFMingleLogo";

export const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      {/* The text-ilovepdf-text class is added here to ensure the icon is dark */}
      <Button variant="ghost" size="icon" className="text-ilovepdf-text" aria-label="Open Menu">
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="p-4 overflow-y-auto">
      <div className="mb-6">
        <PDFMingleLogo />
      </div>
      <h2 className="text-lg font-semibold mb-4">All PDF Tools</h2>
      <nav className="flex flex-col gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.value}
              to={`/${tool.value}`}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-accent"
            >
              <Icon className={`h-6 w-6 ${tool.color}`} />
              <span className="font-medium">{tool.label}</span>
            </Link>
          );
        })}
      </nav>
    </SheetContent>
  </Sheet>
);
