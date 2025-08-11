import { useState } from "react"; // 1. Import useState
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Grip } from "lucide-react";
import { Link } from "react-router-dom";
import { tools } from "@/constants/tools";

export function ToolsMenu() {
  // 2. Add state to control if the menu is open or closed
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // 3. Control the Popover with our state
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
                to={`/${tool.value}`} 
                key={tool.value} 
                // 4. Add an onClick handler to close the menu
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
