import { FileText, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader";
import { cn } from "@/lib/utils";

interface UploadBoxProps {
  compact?: boolean;
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
  compact = false,
  consentGranted,
  error,
  extractedCharacterCount,
  file,
  isExtracting,
  isTruncated,
  onFileSelected,
  pageCount,
}: UploadBoxProps) => {
  const isReady = Boolean(file) && !isExtracting && extractedCharacterCount > 0;
  const selectedFiles = file ? [file] : [];

  const handleFilesChange = (files: File[]) => {
    if (!consentGranted || files.length === 0) {
      onFileSelected(files[0] ?? null);
      return;
    }

    onFileSelected(files[0] ?? null);
  };

  return (
    <section className={cn("space-y-5", compact && "space-y-4")}>
      <div>
        <h2 className={cn("text-2xl font-bold text-foreground", compact && "text-xl")}>Upload PDF</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload one PDF. Text will be extracted in your browser before AI is used.
        </p>
      </div>

      <FileUploader
        accept=".pdf"
        buttonLabel="Select PDF"
        disabled={!consentGranted || isExtracting}
        files={selectedFiles}
        helperText={
          consentGranted
            ? "Upload one PDF and start asking questions"
            : "Consent is required before you can upload a document."
        }
        multiple={false}
        onFilesChange={handleFilesChange}
        showSelectedFiles={false}
        title={isExtracting ? "Extracting text..." : "Choose a PDF file"}
        className={cn("animate-in fade-in-0", compact && "[&_.p-8]:p-5")}
      />

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
