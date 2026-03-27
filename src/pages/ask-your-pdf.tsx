import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import * as pdfjsLib from "pdfjs-dist";
import { ShieldCheck, Sparkles, Stars, WandSparkles } from "lucide-react";

import { ChatBox, type AskPdfMessage } from "@/components/askpdf/ChatBox";
import { ConsentModal } from "@/components/askpdf/ConsentModal";
import { UploadBox } from "@/components/askpdf/UploadBox";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { tools } from "@/constants/tools";
import { buildCanonical } from "@/lib/seo";
import { useToast } from "@/hooks/use-toast";

const AI_CONSENT_STORAGE_KEY = "ai_consent_given";
const MAX_TEXT_LENGTH = 20000;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pdfmingle-backend.onrender.com";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

const createMessage = (
  role: AskPdfMessage["role"],
  content: string
): AskPdfMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  role,
  content,
});

const extractTextFromPdf = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item && typeof item.str === "string" ? item.str : ""))
      .join(" ")
      .trim();

    if (pageText) {
      pageTexts.push(pageText);
    }
  }

  const fullText = pageTexts.join("\n\n");

  return {
    pageCount: pdf.numPages,
    text: fullText.slice(0, MAX_TEXT_LENGTH),
    wasTruncated: fullText.length > MAX_TEXT_LENGTH,
  };
};

const AskYourPdfPage: NextPage = () => {
  const tool = tools["ask-your-pdf"];
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<AskPdfMessage[]>([]);
  const [pdfText, setPdfText] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [isAsking, setIsAsking] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedConsent = window.localStorage.getItem(AI_CONSENT_STORAGE_KEY);
    if (storedConsent === "true") {
      setIsConsentGiven(true);
      setIsConsentChecked(true);
    }
  }, []);

  const extractedCharacterCount = useMemo(() => pdfText.length, [pdfText]);

  const handleConsentContinue = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AI_CONSENT_STORAGE_KEY, "true");
    }

    setIsConsentGiven(true);
    setIsConsentChecked(true);
  };

  const resetDocumentState = () => {
    setFile(null);
    setPdfText("");
    setPageCount(0);
    setMessages([]);
    setQuestion("");
    setIsTextTruncated(false);
    setError(null);
  };

  const handleFileSelected = async (selectedFile: File | null) => {
    resetDocumentState();

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setIsExtracting(true);

    try {
      const extracted = await extractTextFromPdf(selectedFile);

      if (!extracted.text.trim()) {
        throw new Error("No readable text was found in this PDF.");
      }

      setPdfText(extracted.text);
      setPageCount(extracted.pageCount);
      setIsTextTruncated(extracted.wasTruncated);
      setMessages([
        createMessage(
          "assistant",
          extracted.wasTruncated
            ? "Your PDF is ready. I extracted the document text and trimmed it to fit the AI context window. Ask a question and verify the answer against the original file."
            : "Your PDF is ready. Ask me anything about the document and I’ll answer from the extracted text."
        ),
      ]);

      toast({
        title: "PDF ready",
        description: "Text extraction finished in your browser.",
      });
    } catch (extractionError) {
      const message =
        extractionError instanceof Error
          ? extractionError.message
          : "Could not extract text from this PDF.";

      setError(message);
      setFile(null);
      setPdfText("");
      setPageCount(0);
      setMessages([]);
      toast({
        title: "Extraction failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAskQuestion = async () => {
    const trimmedQuestion = question.trim();

    if (!pdfText || !trimmedQuestion || isAsking) {
      return;
    }

    const userMessage = createMessage("user", trimmedQuestion);
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setIsAsking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ask-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: pdfText,
          question: trimmedQuestion,
        }),
      });

      const payload = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok || !payload.answer) {
        throw new Error(payload.error ?? "Could not get an answer from AI.");
      }

      setMessages((current) => [...current, createMessage("assistant", payload.answer as string)]);
    } catch (askError) {
      const message =
        askError instanceof Error ? askError.message : "Could not get an answer from AI.";

      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          `I couldn't answer that right now. ${message}`
        ),
      ]);
      toast({
        title: "AI request failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <AuthGuard>
      <NextSeo
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={buildCanonical(`/${tool.value}`)}
      />

      <ConsentModal
        open={!isConsentGiven}
        checked={isConsentChecked}
        onCheckedChange={setIsConsentChecked}
        onContinue={handleConsentContinue}
      />

      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fff7ed_0%,#f0fdfa_38%,#ffffff_100%)]">
        <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
        <div className="absolute right-[-5rem] top-10 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />

        <section className="relative container mx-auto px-4 pb-16 pt-10 md:pb-24 md:pt-14">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-700 shadow-sm backdrop-blur">
                  <WandSparkles className="h-4 w-4 text-orange-500" />
                  AI document helper
                </div>

                <div className="max-w-3xl space-y-4">
                  <h1 className="max-w-2xl text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
                    Ask Your PDF
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-700 md:text-xl">
                    Upload a PDF and ask questions using AI.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <Stars className="h-5 w-5 text-cyan-500" />
                    <p className="mt-3 text-sm font-bold text-slate-900">Browser-first</p>
                    <p className="mt-1 text-sm text-slate-600">
                      PDF text is extracted on your device before you ask anything.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <Sparkles className="h-5 w-5 text-orange-500" />
                    <p className="mt-3 text-sm font-bold text-slate-900">Fast Q&A</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Ask for summaries, details, definitions, dates, or action items.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <ShieldCheck className="h-5 w-5 text-lime-600" />
                    <p className="mt-3 text-sm font-bold text-slate-900">Consent required</p>
                    <p className="mt-1 text-sm text-slate-600">
                      AI use is gated with explicit consent and a clear no-sensitive-documents warning.
                    </p>
                  </div>
                </div>
              </div>

              <UploadBox
                file={file}
                onFileSelected={handleFileSelected}
                isExtracting={isExtracting}
                pageCount={pageCount}
                extractedCharacterCount={extractedCharacterCount}
                isTruncated={isTextTruncated}
                error={error}
              />
            </div>

            <div className="lg:pt-12">
              <ChatBox
                messages={messages}
                question={question}
                onQuestionChange={setQuestion}
                onSubmit={handleAskQuestion}
                isLoading={isAsking}
                disabled={!pdfText || isExtracting}
                hasDocument={Boolean(pdfText)}
              />
            </div>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
};

export default AskYourPdfPage;
