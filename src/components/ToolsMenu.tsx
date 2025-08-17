import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Grip, FileQuestion } from "lucide-react"; // Import a fallback icon
import Link from "next/link";
// 1. Import the iconMap and tools list
import { tools, iconMap } from "@/constants/tools";

export function ToolsMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-800" aria-label="Open Tools Menu">
          <Grip className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <div className="grid grid-cols-3 gap-4">
          {tools.map((tool) => {
            // --- THIS IS THE FIX ---
            // 2. Look up the component from the map using the tool's icon string
            const Icon = iconMap[tool.icon] || FileQuestion;
            return (
              <Link
                href={`/${tool.value}`}
                key={tool.value}
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center justify-center text-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {/* 3. Render the icon with its specific color */}
                <Icon className="h-8 w-8" style={{ color: tool.color }} />
                <span className="text-xs font-medium text-gray-700">{tool.label}</span>
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
