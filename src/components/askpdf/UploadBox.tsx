import { useRef } from "react";
import { FileText, RefreshCcw, Sparkles, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadBoxProps {
  error: string | null;
  extractedCharacterCount: number;
  file: File | null;
  isExtracting: boolean;
  isTruncated: boolean;
  onFileSelected: (file: File | null) => void;
  pageCount: number;
}

export const UploadBox = ({
  error,
  extractedCharacterCount,
  file,
  isExtracting,
  isTruncated,
  onFileSelected,
  pageCount,
}: UploadBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    onFileSelected(selectedFile);
    event.target.value = "";
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-300/40 blur-3xl" />
      <div className="absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-cyan-300/40 blur-3xl" />

      <div className="relative space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Drop in a PDF</h2>
            <p className="text-sm text-slate-600">
              Text stays in your browser until you ask a question.
            </p>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "cursor-pointer rounded-[1.75rem] border-2 border-dashed px-6 py-10 text-center transition-all",
            error
              ? "border-red-300 bg-red-50"
              : "border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-orange-50 hover:border-orange-300"
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-orange-500 shadow-md">
              <UploadCloud className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-slate-900">
                {isExtracting ? "Reading your PDF..." : "Upload your PDF"}
              </p>
              <p className="text-sm text-slate-600">
                Select one PDF and I&apos;ll extract the text in the browser.
              </p>
            </div>
            <Button
              type="button"
              className="rounded-full bg-slate-900 px-6 text-white hover:bg-slate-800"
            >
              Choose PDF
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {file ? (
          <div className="grid gap-4 rounded-[1.5rem] bg-slate-900 p-5 text-white md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-300">
                <FileText className="h-4 w-4" />
                Ready to ask
              </div>
              <p className="break-all text-lg font-bold">{file.name}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full bg-white/10 px-3 py-1">{pageCount} pages</span>
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {extractedCharacterCount.toLocaleString()} chars extracted
                </span>
                {isTruncated ? (
                  <span className="rounded-full bg-orange-400/20 px-3 py-1 text-orange-200">
                    truncated for AI safety
                  </span>
                ) : null}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onFileSelected(null)}
              className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Replace
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
};
