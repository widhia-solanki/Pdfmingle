export const HomeHeroArtwork = () => {
  return (
    <div className="relative w-full max-w-[520px]">
      <div className="absolute inset-x-12 top-6 h-40 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -left-2 top-20 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
      <div className="absolute -right-3 bottom-10 h-28 w-28 rounded-full bg-amber-400/10 blur-2xl" />

      <div className="relative rounded-[28px] border border-border/60 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <svg
          viewBox="0 0 560 420"
          role="img"
          aria-label="Compact illustration of PDF tools and document actions"
          className="h-auto w-full"
        >
          <defs>
            <linearGradient id="hero-card" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
            <linearGradient id="hero-page" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="560" height="420" rx="26" fill="url(#hero-card)" />

          <circle cx="112" cy="88" r="10" fill="#f59e0b" />
          <circle cx="446" cy="72" r="12" fill="#34d399" />
          <circle cx="472" cy="314" r="10" fill="#60a5fa" />

          <path
            d="M196 80c19-21 50-33 85-33 60 0 107 36 119 87"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M180 305c-25-21-40-52-40-87 0-17 4-34 11-48"
            fill="none"
            stroke="#86efac"
            strokeWidth="14"
            strokeLinecap="round"
          />

          <g transform="translate(190 80)">
            <rect x="0" y="0" width="180" height="236" rx="22" fill="white" stroke="#bfdbfe" strokeWidth="3" />
            <path d="M129 0h17l34 34v17h-51z" fill="#dbeafe" />
            <rect x="28" y="54" width="98" height="18" rx="9" fill="url(#hero-page)" />
            <rect x="28" y="92" width="124" height="10" rx="5" fill="#cbd5e1" />
            <rect x="28" y="114" width="110" height="10" rx="5" fill="#cbd5e1" />
            <rect x="28" y="136" width="118" height="10" rx="5" fill="#cbd5e1" />
            <rect x="28" y="168" width="124" height="28" rx="14" fill="#eff6ff" />
            <rect x="40" y="178" width="52" height="8" rx="4" fill="#60a5fa" />
            <rect x="28" y="212" width="78" height="10" rx="5" fill="#cbd5e1" />
          </g>

          <g transform="translate(81 134)">
            <rect x="0" y="0" width="78" height="78" rx="20" fill="white" stroke="#dbeafe" strokeWidth="3" />
            <path d="M24 49l9-17 13 9 15-18" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="49" r="5" fill="#10b981" />
            <circle cx="46" cy="41" r="5" fill="#10b981" />
            <circle cx="61" cy="23" r="5" fill="#10b981" />
          </g>

          <g transform="translate(402 136)">
            <rect x="0" y="0" width="78" height="78" rx="20" fill="white" stroke="#dbeafe" strokeWidth="3" />
            <path d="M23 39h32" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
            <path d="M39 23v32" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
            <path d="M22 56h34" stroke="#fdba74" strokeWidth="8" strokeLinecap="round" />
          </g>

          <g transform="translate(115 276)">
            <rect x="0" y="0" width="84" height="84" rx="22" fill="white" stroke="#dbeafe" strokeWidth="3" />
            <path d="M25 55l33-33" stroke="#8b5cf6" strokeWidth="9" strokeLinecap="round" />
            <path d="M30 28h30v30" fill="none" stroke="#8b5cf6" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          <g transform="translate(361 270)">
            <rect x="0" y="0" width="94" height="94" rx="24" fill="white" stroke="#dbeafe" strokeWidth="3" />
            <path d="M30 59h34" stroke="#2563eb" strokeWidth="9" strokeLinecap="round" />
            <path d="M50 33l14 26-14 0" fill="none" stroke="#2563eb" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 33L28 59" fill="none" stroke="#60a5fa" strokeWidth="9" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};
