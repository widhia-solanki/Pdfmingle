import { FormEvent } from "react";
import { Loader2, MessageCircleHeart, SendHorizonal, Sparkles } from "lucide-react";

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
  hasDocument: boolean;
  isLoading: boolean;
  messages: AskPdfMessage[];
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
  question: string;
}

export const ChatBox = ({
  disabled,
  hasDocument,
  isLoading,
  messages,
  onQuestionChange,
  onSubmit,
  question,
}: ChatBoxProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
      <div className="border-b border-slate-100 bg-gradient-to-r from-cyan-50 via-white to-orange-50 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <MessageCircleHeart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Chat with your PDF</h2>
            <p className="text-sm text-slate-600">
              Ask about summaries, details, definitions, or key points.
            </p>
          </div>
        </div>
      </div>

      <div className="max-h-[480px] space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.10),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.12),_transparent_30%),white] px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-white/80 p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-orange-400 text-white shadow-lg">
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-xl font-bold text-slate-900">
              {hasDocument ? "Your PDF is ready for questions" : "Upload a PDF to start"}
            </p>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              {hasDocument
                ? "Try asking for a summary, action items, dates, names, or a specific explanation from the document."
                : "Once the PDF text has been extracted in your browser, you can ask questions here."}
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
                  "max-w-[88%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-sm",
                  message.role === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-800 ring-1 ring-slate-100"
                )}
              >
                {message.content}
              </div>
            </div>
          ))
        )}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-3 rounded-[1.5rem] bg-white px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100">
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              Thinking...
            </div>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-100 bg-white px-4 py-4 md:px-6"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            placeholder="Ask a question"
            disabled={disabled}
            className="h-12 rounded-full border-slate-200 bg-slate-50 px-5 text-slate-900 placeholder:text-slate-500"
          />
          <Button
            type="submit"
            disabled={disabled || isLoading || !question.trim()}
            className="h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 text-white hover:from-orange-600 hover:to-pink-600"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SendHorizonal className="mr-2 h-4 w-4" />}
            Ask
          </Button>
        </div>
      </form>
    </section>
  );
};
