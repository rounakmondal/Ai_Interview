import { useState, useEffect } from "react";

const STORAGE_KEY = "medhahub-lang-chosen";

const LANGUAGES = [
  {
    code: "en",
    native: "English",
    sub: "Continue in English",
    icon: "A",
    gradient: "from-blue-500 to-cyan-400",
    ring: "ring-blue-400/30",
  },
  {
    code: "hi",
    native: "हिन्दी",
    sub: "हिन्दी में जारी रखें",
    icon: "अ",
    gradient: "from-orange-500 to-amber-400",
    ring: "ring-orange-400/30",
  },
  {
    code: "bn",
    native: "বাংলা",
    sub: "বাংলায় চালিয়ে যান",
    icon: "অ",
    gradient: "from-green-500 to-emerald-400",
    ring: "ring-green-400/30",
  },
];

function setGoogleTranslateLanguage(langCode: string) {
  if (langCode === "en") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." +
      window.location.hostname;
  } else {
    const value = `/en/${langCode}`;
    document.cookie = `googtrans=${value}; path=/;`;
    document.cookie = `googtrans=${value}; path=/; domain=.${window.location.hostname}`;
  }
  window.location.reload();
}

export default function LanguagePickerModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setOpen(true), 12000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePick = (code: string) => {
    setSelected(code);
    // Brief animation before closing
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, code);
      setOpen(false);
      if (code !== "en") {
        setGoogleTranslateLanguage(code);
      }
    }, 400);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-black/70 to-purple-950/80 backdrop-blur-md"
        style={{ animation: "fadeIn 0.4s ease-out" }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl"
        style={{ animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Glass card */}
        <div className="relative bg-white/[0.08] dark:bg-white/[0.06] border border-white/[0.12] shadow-2xl shadow-black/40 backdrop-blur-2xl">
          {/* Top gradient accent */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="p-8 space-y-7">
            {/* Logo + Heading */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.97.633-3.792 1.708-5.274"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Welcome to MedhaHub
                </h2>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                  Select your preferred language to get started
                </p>
              </div>
            </div>

            {/* Language cards */}
            <div className="space-y-3">
              {LANGUAGES.map((lang, i) => {
                const isSelected = selected === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handlePick(lang.code)}
                    disabled={!!selected}
                    className={`
                      w-full flex items-center gap-4 px-5 py-4 rounded-2xl
                      border transition-all duration-300 group relative overflow-hidden
                      ${isSelected
                        ? `border-transparent ring-4 ${lang.ring} scale-[1.02]`
                        : "border-white/10 hover:border-white/25 hover:bg-white/[0.06]"}
                    `}
                    style={{ animationDelay: `${i * 80}ms`, animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
                  >
                    {/* Selected glow */}
                    {isSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${lang.gradient} opacity-15`} />
                    )}

                    {/* Icon circle */}
                    <div
                      className={`
                        relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                        text-xl font-bold text-white
                        bg-gradient-to-br ${lang.gradient}
                        shadow-lg group-hover:scale-110 transition-transform duration-300
                        ${isSelected ? "scale-110" : ""}
                      `}
                    >
                      {lang.icon}
                    </div>

                    {/* Label */}
                    <div className="relative text-left flex-1">
                      <div
                        className={`
                          text-lg font-semibold transition-colors duration-200
                          ${isSelected ? "text-white" : "text-zinc-200 group-hover:text-white"}
                        `}
                      >
                        {lang.native}
                      </div>
                      <div className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        {lang.sub}
                      </div>
                    </div>

                    {/* Arrow / check */}
                    <div className="relative flex-shrink-0">
                      {isSelected ? (
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${lang.gradient} flex items-center justify-center`}>
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <svg
                          className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all duration-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            <p className="text-[11px] text-center text-zinc-500">
              You can change this anytime using the{" "}
              <span className="text-indigo-400">🌐</span> button at the
              bottom-left corner
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
