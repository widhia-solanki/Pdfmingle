import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Grip } from "lucide-react";
import { Link } from "react-router-dom";
import { tools } from "@/constants/tools"; // Import from our new file

export function ToolsMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
          <Grip className="h-6 w-6" />
          <span className="sr-only">Open Tools Menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <div className="grid grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link to={`/${tool.value}`} key={tool.value} className="flex flex-col items-center justify-center text-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
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
