import { useState, useEffect } from 'react';
import { Lock, Heart, Sparkles, Calculator } from 'lucide-react';

const PASSWORD = '300723';

const HINTS = [
  {
    level: 0,
    icon: Calculator,
    title: "A Tiny Clue ✨",
    lines: [
      "This isn’t random or guessed.",
      "It comes from a very specific moment in time.",
      "Not a birthday, something that actually *started us*.",
    ],
  },
  {
    level: 1,
    title: "Getting Warmer 🌙",
    lines: [
      "Think about the first time we really met / connected.",
      "Not when we knew of each other… but when it began.",
      "That day matters more than you think.",
    ],
  },
  {
    level: 2,
    title: "Almost There 💫",
    lines: [
      "You’re close, but the clue isn’t fully inside this game.",
      "Sometimes answers live where things were made 👀",
      "https://gaurisakhalkar.netlify.app/",
    ],
  },
];

export default function PasswordGate({ onAccess }: { onAccess: () => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [hintLevel, setHintLevel] = useState(-1);
  const [attempts, setAttempts] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const x = Math.random() * 100;
      setHearts(prev => [...prev.slice(-8), { id, x }]);
      setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 3000);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if input is not complete (less than 6 digits)
    if (input.length < 6) {
      return;
    }
    
    if (input === PASSWORD) {
      setInput(''); // Clear input on success
      onAccess();
    } else {
      setError(true);
      setShake(true);
      setAttempts(prev => prev + 1);
      setInput(''); // Clear input on wrong password
      setTimeout(() => {
        setShake(false);
        setError(false);
      }, 3000);
    }
  };

  const handleDigitClick = (digit: string) => {
    if (input.length < 6) {
      setInput(prev => prev + digit);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
    setError(false);
  };

  const currentHint = hintLevel >= 0 ? HINTS[Math.min(hintLevel, HINTS.length - 1)] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d1b2e] via-[#1a1025] to-[#0d0a12] flex items-center justify-center relative overflow-hidden">
      {/* Floating hearts background */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute text-rose-300 opacity-60 pointer-events-none"
          style={{
            left: `${h.x}%`,
            bottom: '0',
            animation: 'heart-float 3s ease-out forwards',
            fontSize: '1.2rem',
          }}
        >
          <Heart size={16} fill="currentColor" />
        </div>
      ))}

      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-md w-full">
        {/* Lock icon */}
        <div className="mb-8 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-rose-400/20 to-amber-400/20 border border-rose-400/30 flex items-center justify-center animate-pulse-glow">
            <Lock className="text-rose-300" size={32} />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in-up delay-100" style={{ animationFillMode: 'both' }}>
          Bestie Vault ✨
        </h1>
        <p className="text-rose-200/70 text-lg mb-2 animate-fade-in-up delay-200" style={{ animationFillMode: 'both' }}>
          Access granted only to cute little kido
        </p>
        <p className="text-amber-200/50 text-sm mb-4 animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
          <Sparkles size={14} className="inline mr-1" />
          Aishu, this is for you
          <Sparkles size={14} className="inline ml-1" />
        </p>

        {/* Password clue teaser */}
        <div className="mb-6 animate-fade-in-up delay-400" style={{ animationFillMode: 'both' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Calculator size={14} className="text-amber-400" />
            <span className="text-amber-300/80 text-xs tracking-wide">
              The day a friendship began ✨
            </span>
          </div>
        </div>

        {/* Display dots */}
        <div className={`flex justify-center gap-3 mb-6 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                i < input.length
                  ? error
                    ? 'bg-red-400 scale-110'
                    : 'bg-rose-400 scale-110'
                  : 'bg-white/20 border border-white/30'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-300 text-sm mb-4 animate-fade-in">
            {/* {ROASTS[Math.min(attempts - 1, ROASTS.length - 1)]} */}
            {attempts === 1 && "Wrong 😭 I believed in you for a second"}
            {attempts === 2 && "Okay this is getting embarrassing"}
            {attempts === 3 && "Do you want a hint or emotional support?"}
            {attempts === 4 && "I’m judging you silently right now"}
            {attempts >= 5 && "I think you're doing this on purpose 💀"}
          </p>
        )}

        {/* Number pad */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
              <button
                key={d}
                type="button"
                onClick={() => handleDigitClick(d)}
                className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:border-violet-400/40 text-white text-xl font-medium transition-all duration-200 active:scale-90 flex items-center justify-center mx-auto"
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-3 max-w-[240px] mx-auto">
            <button
              type="button"
              onClick={handleBackspace}
              className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white/60 transition-all duration-200 active:scale-90"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => handleDigitClick('0')}
              className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 hover:border-violet-400/40 text-white text-xl font-medium transition-all duration-200 active:scale-90 flex items-center justify-center mx-auto"
            >
              0
            </button>
            <button
              type="submit"
              disabled={input.length < 6}
              className={`w-16 h-16 rounded-2xl text-white transition-all duration-200 shadow-lg ${
                input.length < 6
                  ? 'bg-gray-500/30 cursor-not-allowed opacity-50 shadow-gray-500/10'
                  : 'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 active:scale-95 shadow-violet-500/20 hover:shadow-violet-500/30'
              }`}
            >
              <Sparkles size={20} className={`mx-auto ${input.length < 6 ? '' : 'animate-pulse'}`} />
              {/* <Heart size={20} fill="currentColor" className="mx-auto" /> */}
            </button>
          </div>
        </form>

        {/* Hint system */}
        <div className="mt-8">
          {hintLevel < 0 ? (
            <button
              onClick={() => setHintLevel(0)}
              className="text-white/30 text-xs hover:text-white/60 transition-colors underline underline-offset-4 inline-flex items-center gap-1"
            >
              <Calculator size={12} />
              Okay fine… I need help 😭
            </button>
          ) : (
            <div className="animate-fade-in">
              <div className="glass rounded-2xl p-5 text-left space-y-3">

                {/* Hint header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center">
                      <Calculator size={12} className="text-amber-300" />
                    </div>

                    <span className="text-amber-300 text-xs font-semibold tracking-wider uppercase">
                      Hint Level {Math.min(hintLevel + 1, HINTS.length)} / {HINTS.length}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="text-white/30 hover:text-white/60 text-xs transition-colors"
                  >
                    {showCalculator ? "Hide" : "Show"} gentle help
                  </button>
                </div>

                {/* Progress */}
                <div className="flex gap-1.5">
                  {HINTS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= hintLevel
                          ? "bg-amber-400/60"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                {/* Mini helper panel */}
                {showCalculator && (
                  <div className="bg-black/30 rounded-xl p-3 space-y-3 animate-fade-in">

                    <div className="text-center text-xs text-white/40">
                      I promise this is simpler than it looks 😌
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
                      <p className="text-amber-300/60 text-xs mb-1">
                        Think about this moment
                      </p>
                      <p className="text-amber-300 font-mono font-bold">
                        the day it all started
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 text-center space-y-1">
                      <p className="text-white/40 text-[10px]">
                        HOW TO SOLVE THIS
                      </p>
                      <p className="text-white/70 text-xs">
                        find the date → remove symbols → just numbers
                      </p>
                      <p className="text-white/50 text-[10px]">
                        I swear it's not tricking you (much)
                      </p>
                    </div>

                    <div className="text-center text-[10px] text-white/30">
                      I’m helping… emotionally 😌
                    </div>
                  </div>
                )}

                {/* Hint lines */}
                <div className="space-y-1.5">
                  {currentHint?.lines.map((line, i) => (
                    <p key={i} className="text-amber-200/60 text-xs leading-relaxed">
                      {line.startsWith("http") ? (
                        <a
                          href={line}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-amber-300 hover:text-amber-200 break-all"
                        >
                          {line}
                        </a>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>

                {/* Next hint button */}
                {hintLevel < HINTS.length - 1 && (
                  <button
                    onClick={() => setHintLevel(prev => prev + 1)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white/70 text-xs transition-all"
                  >
                    I’m still stuck (please be nicer to me 😭)
                  </button>
                )}

              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
