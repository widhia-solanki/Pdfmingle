import { FormEvent, useEffect, useMemo, useRef } from "react";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AskPdfMessage {
  content: string;
  id: string;
  role: "assistant" | "user";
}

interface ChatBoxProps {
  disabled: boolean;
  exampleQuestions: string[];
  hasDocument: boolean;
  isLoading: boolean;
  messages: AskPdfMessage[];
  onExampleClick: (question: string) => void;
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
  question: string;
}

export const ChatBox = ({
  disabled,
  exampleQuestions,
  hasDocument,
  isLoading,
  messages,
  onExampleClick,
  onQuestionChange,
  onSubmit,
  question,
}: ChatBoxProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [isLoading, messages]);

  const exampleButtons = useMemo(
    () =>
      exampleQuestions.map((example) => (
        <Button
          key={example}
          type="button"
          variant="outline"
          onClick={() => onExampleClick(example)}
          disabled={disabled}
          className="justify-start rounded-full"
        >
          {example}
        </Button>
      )),
    [disabled, exampleQuestions, onExampleClick]
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ask questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask about summaries, key points, explanations, and details from the uploaded PDF.
          </p>
        </div>
      </div>

      <div className="border-b border-border px-6 py-4">
        <div className="flex flex-wrap gap-2">{exampleButtons}</div>
      </div>

      <div ref={scrollContainerRef} className="max-h-[420px] space-y-4 overflow-y-auto bg-background px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-xl font-semibold text-foreground">
              {hasDocument ? "Your PDF is ready for questions" : "Upload a PDF to start"}
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {hasDocument
                ? "Try asking for a summary, action items, dates, names, or a specific explanation from the document."
                : "Once the PDF text is extracted, your conversation will appear here."}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground ring-1 ring-border"
                )}
              >
                {message.content}
              </div>
            </div>
          ))
        )}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm ring-1 ring-border">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
              Thinking...
            </div>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-border bg-card px-4 py-4 md:px-6"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            placeholder="Ask a question"
            disabled={disabled}
            className="h-12 rounded-full bg-background px-5"
          />
          <Button
            type="submit"
            disabled={disabled || isLoading || !question.trim()}
            className="h-12 rounded-full bg-brand-blue px-6 text-white hover:bg-brand-blue-dark"
          >
            <SendHorizonal className="mr-2 h-4 w-4" />
            Ask
          </Button>
        </div>
      </form>
    </section>
  );
};
