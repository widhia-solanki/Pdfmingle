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
      <DialogContent className="max-w-xl overflow-hidden border-0 bg-white p-0 text-slate-900 shadow-2xl">
        <div className="bg-gradient-to-r from-orange-400 via-amber-300 to-cyan-300 px-6 py-5">
          <DialogHeader className="space-y-2 text-left">
            <div className="inline-flex w-fit rounded-full bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
              AI Notice
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900">
              AI Processing Consent
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-700">
              Review this before using Ask Your PDF.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 pb-6 pt-2">
          <div className="grid gap-3 rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
            <p>Your files will be processed using AI.</p>
            <p>Do not upload sensitive documents.</p>
            <p>AI responses may not be accurate.</p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm transition-colors hover:border-orange-300">
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => onCheckedChange(Boolean(value))}
              className="mt-0.5 border-orange-500 data-[state=checked]:bg-orange-500"
            />
            <span>I agree</span>
          </label>

          <DialogFooter>
            <Button
              type="button"
              onClick={onContinue}
              disabled={!checked}
              className="w-full rounded-full bg-slate-900 px-6 py-6 text-base font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
