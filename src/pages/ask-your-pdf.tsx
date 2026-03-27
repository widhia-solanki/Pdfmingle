import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import * as pdfjsLib from "pdfjs-dist";

import { ChatBox, type AskPdfMessage } from "@/components/askpdf/ChatBox";
import { ConsentModal } from "@/components/askpdf/ConsentModal";
import { UploadBox } from "@/components/askpdf/UploadBox";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { tools } from "@/constants/tools";
import { buildCanonical } from "@/lib/seo";
import { useToast } from "@/hooks/use-toast";

const AI_CONSENT_STORAGE_KEY = "ai_consent_given";
const MAX_TEXT_LENGTH = 20000;
const EXAMPLE_QUESTIONS = [
  "Summarize this PDF",
  "What are key points?",
  "Explain in simple terms",
];

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
  const isToolLocked = !isConsentGiven;

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
      const response = await fetch("/api/ask-pdf", {
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

  const handleExampleClick = (example: string) => {
    setQuestion(example);
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

      <div className="w-full bg-background">
        <section className="container mx-auto px-4 pb-16 pt-6 md:pb-24 md:pt-8">
          <div className="mb-8 max-w-3xl space-y-4 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Ask Your PDF
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Upload a PDF and ask questions using AI.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <UploadBox
                consentGranted={!isToolLocked}
                file={file}
                onFileSelected={handleFileSelected}
                isExtracting={isExtracting}
                pageCount={pageCount}
                extractedCharacterCount={extractedCharacterCount}
                isTruncated={isTextTruncated}
                error={error}
              />
            </div>

            <div>
              <ChatBox
                messages={messages}
                question={question}
                onExampleClick={handleExampleClick}
                exampleQuestions={EXAMPLE_QUESTIONS}
                onQuestionChange={setQuestion}
                onSubmit={handleAskQuestion}
                isLoading={isAsking}
                disabled={isToolLocked || !pdfText || isExtracting}
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
