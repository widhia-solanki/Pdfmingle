import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Grip } from "lucide-react";
import Link from "next/link"; // CORRECTED: Only one import for Link
import { tools } from "@/constants/tools";

export function ToolsMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-ilovepdf-text" aria-label="Open Tools Menu">
          <Grip className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <div className="grid grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link 
                href={`/${tool.value}`} 
                key={tool.value} 
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center justify-center text-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <Icon className={`h-8 w-8 ${tool.color}`} />
                <span className="text-xs font-medium">{tool.label}</span>
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
