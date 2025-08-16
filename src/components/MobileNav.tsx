import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { tools } from "@/constants/tools";
import Link from "next/link";

const PDFMingleLogo = () => (
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
    {/* --- THIS IS THE FIX --- */}
    <div>
      <span className="text-ilovepdf-red">PDF</span>Mingle
    </div>
    {/* --- END OF THE FIX --- */}
  </Link>
);

export const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
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
              href={`/${tool.value}`}
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
