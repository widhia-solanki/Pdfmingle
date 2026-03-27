import { useRef } from "react";
import { FileText, Loader2, RefreshCcw, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadBoxProps {
  consentGranted: boolean;
  error: string | null;
  extractedCharacterCount: number;
  file: File | null;
  isExtracting: boolean;
  isTruncated: boolean;
  onFileSelected: (file: File | null) => void;
  pageCount: number;
}

export const UploadBox = ({
  consentGranted,
  error,
  extractedCharacterCount,
  file,
  isExtracting,
  isTruncated,
  onFileSelected,
  pageCount,
}: UploadBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isReady = Boolean(file) && !isExtracting && extractedCharacterCount > 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!consentGranted) {
      event.target.value = "";
      return;
    }

    const selectedFile = event.target.files?.[0] ?? null;
    onFileSelected(selectedFile);
    event.target.value = "";
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Upload PDF</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload one PDF. Text will be extracted in your browser before AI is used.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (consentGranted) {
            inputRef.current?.click();
          }
        }}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && consentGranted) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          "rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 animate-in fade-in-0",
          error
            ? "border-destructive bg-destructive/10"
            : "border-border bg-background hover:border-primary/40",
          consentGranted ? "cursor-pointer" : "cursor-not-allowed opacity-70"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-foreground">
            {isExtracting ? <Loader2 className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">
              {isExtracting ? "Extracting text..." : "Choose a PDF file"}
            </p>
            <p className="text-sm text-muted-foreground">
              {consentGranted
                ? "Select one PDF and start asking questions."
                : "Consent is required before you can upload a document."}
            </p>
          </div>
          <Button
            type="button"
            disabled={!consentGranted}
            className="rounded-full bg-brand-blue px-6 text-white hover:bg-brand-blue-dark"
          >
            Select PDF
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-in fade-in-0">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-background p-4 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {file ? file.name : "No file uploaded yet"}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1">
                {file ? `${pageCount} pages` : "Awaiting upload"}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1">
                {isExtracting
                  ? "Extracting text"
                  : extractedCharacterCount > 0
                    ? `Text extracted: ${extractedCharacterCount.toLocaleString()} chars`
                    : "Text not extracted"}
              </span>
              {isTruncated ? <span className="rounded-full bg-secondary px-3 py-1">Trimmed for AI limit</span> : null}
            </div>
          </div>
        </div>

        {isReady ? (
          <p className="mt-4 text-sm font-medium text-foreground">
            PDF ready. Ask anything.
          </p>
        ) : null}

        {file ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => onFileSelected(null)}
            className="mt-4 rounded-full"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Replace PDF
          </Button>
        ) : null}
      </div>
    </section>
  );
};
