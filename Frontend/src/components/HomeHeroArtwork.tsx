import type { ReactNode } from "react";
import { FileText, Lock, Scissors, Sparkles, Zap } from "lucide-react";

const FloatingPill = ({
  className,
  icon,
  label,
}: {
  className: string;
  icon: ReactNode;
  label: string;
}) => (
  <div
    className={`absolute flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur ${className}`}
  >
    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
      {icon}
    </span>
    <span>{label}</span>
  </div>
);

const StatusDot = ({ color }: { color: string }) => (
  <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
);

export const HomeHeroArtwork = () => {
  return (
    <div className="relative w-full max-w-[560px]">
      <div className="absolute inset-x-10 top-10 h-44 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute left-3 top-28 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
      <div className="absolute right-2 top-12 h-28 w-28 rounded-full bg-amber-400/10 blur-2xl" />

      <div className="relative aspect-[11/9]">
        <FloatingPill
          className="left-0 top-10 -rotate-6"
          icon={<Scissors className="h-4 w-4 text-emerald-600" />}
          label="Split pages"
        />
        <FloatingPill
          className="right-0 top-6 rotate-6"
          icon={<Lock className="h-4 w-4 text-blue-600" />}
          label="Protect PDF"
        />
        <FloatingPill
          className="bottom-10 left-10 -rotate-3"
          icon={<Zap className="h-4 w-4 text-amber-500" />}
          label="Compress fast"
        />

        <div className="absolute inset-x-12 inset-y-6 rounded-[30px] border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
          <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.10),_transparent_28%)]" />

          <div className="relative flex h-full flex-col rounded-[24px] border border-slate-200/70 bg-white/95 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Workflow
                  </p>
                  <p className="text-lg font-semibold text-slate-900">PDF toolkit</p>
                </div>
              </div>

              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Secure by default
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[1.3fr_0.9fr] gap-4">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/90 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Smart actions
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">Merge documents</span>
                      <StatusDot color="bg-blue-500" />
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-[78%] rounded-full bg-blue-500" />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">Compress output</span>
                      <StatusDot color="bg-amber-400" />
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-[62%] rounded-full bg-amber-400" />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">Protect file</span>
                      <StatusDot color="bg-emerald-500" />
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                        Encrypted
                      </span>
                      <span>Ready to download</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[22px] border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">
                    Output
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">18+</p>
                  <p className="mt-1 text-sm text-slate-600">PDF actions ready in one place</p>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    Private processing
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Merge, split, compress, and protect documents without visual clutter.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50/90 px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Session summary
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">Ready for merge, split, compress, and export</p>
              </div>
              <div className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                Live tools
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
