import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // FIX: Replaced 'window' with 'globalThis'
    const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      // FIX: Replaced 'window' with 'globalThis'
      setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // FIX: Replaced 'window' with 'globalThis'
    setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}```

---

### 2. Fix: `src/constants/tools.ts`

**Problem:** You are importing `Shuffle` and `FileSignature` but not using them anywhere.

**Action:** Replace the entire content of `src/constants/tools.ts` with this corrected code (the unused icons are removed from the import line).

```tsx
import {
  FilePlus, Scissors, Archive, FileOutput, FileType, 
  FileText, Unlock, Lock
} from "lucide-react"; // FIX: Removed unused 'Shuffle' and 'FileSignature'

export type ToolCategory = "Organize" | "Optimize" | "Convert" | "Edit" | "Security";

export interface Tool {
  value: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: ToolCategory;
}

export const tools: Tool[] = [
  {
    value: "merge",
    label: "Merge PDF",
    description: "Combine PDFs in the order you want.",
    icon: FilePlus,
    color: "text-red-500",
    category: "Organize",
  },
  {
    value: "split",
    label: "Split PDF",
    description: "Separate pages into new PDF files.",
    icon: Scissors,
    color: "text-orange-500",
    category: "Organize",
  },
  {
    value: "compress",
    label: "Compress PDF",
    description: "Reduce file size for easier sharing.",
    icon: Archive,
    color: "text-green-500",
    category: "Optimize",
  },
  {
    value: "pdf-to-word",
    label: "PDF to Word",
    description: "Convert PDFs to editable Word documents.",
    icon: FileOutput,
    color: "text-blue-500",
    category: "Convert",
  },
  {
    value: "word-to-pdf",
    label: "Word to PDF",
    description: "Convert Word documents to PDF.",
    icon: FileType,
    color: "text-blue-600",
    category: "Convert",
  },
  {
    value: "edit",
    label: "Edit PDF",
    description: "Add text, images, and annotations.",
    icon: FileText,
    color: "text-purple-500",
    category: "Edit",
  },
  {
    value: "unlock",
    label: "Unlock PDF",
    description: "Remove passwords from your PDFs.",
    icon: Unlock,
    color: "text-teal-500",
    category: "Security",
  },
  {
    value: "protect",
    label: "Protect PDF",
    description: "Add a password and encrypt your PDF.",
    icon: Lock,
    color: "text-gray-600",
    category: "Security",
  },
];

export const categories: ToolCategory[] = ["Organize", "Optimize", "Convert", "Edit", "Security"];
