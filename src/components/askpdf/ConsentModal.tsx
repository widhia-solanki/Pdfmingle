import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConsentModalProps {
  checked: boolean;
  open: boolean;
  onCheckedChange: (checked: boolean) => void;
  onContinue: () => void;
}

export const ConsentModal = ({
  checked,
  open,
  onCheckedChange,
  onContinue,
}: ConsentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent className="max-w-xl border border-border bg-background p-0 shadow-xl">
        <div className="border-b border-border bg-card px-6 py-5">
          <DialogHeader className="space-y-2 text-left">
            <div className="inline-flex w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              AI Notice
            </div>
            <DialogTitle className="text-2xl font-black text-foreground">
              AI Processing Consent
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Review this before using Ask Your PDF.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6 pt-2">
          <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
            <p>Your files will be processed using AI.</p>
            <p>Do not upload sensitive documents.</p>
            <p>AI responses may not be accurate.</p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-sm text-foreground transition-colors hover:border-primary/40">
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => onCheckedChange(Boolean(value))}
              className="mt-0.5"
            />
            <span>I agree</span>
          </label>

          <DialogFooter>
            <Button
              type="button"
              onClick={onContinue}
              disabled={!checked}
              className="w-full rounded-full bg-brand-blue px-6 py-6 text-base font-semibold text-white hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
