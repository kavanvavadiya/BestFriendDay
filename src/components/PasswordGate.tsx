import { useState, useEffect } from 'react';
import { Lock, Heart, Sparkles, Calculator } from 'lucide-react';

// Password = 240812 (Kavan 24 Aug + Aishwarya 12 Dec)
const PASSWORD = '240812';

const HINTS = [
  {
    level: 0,
    icon: Calculator,
    title: 'The Formula',
    lines: [
      'This code is made from two special dates',
      'The day Kavan was born + The day Aishwarya was born',
    ],
  },
  {
    level: 1,
    title: 'A Little Closer',
    lines: [
      'Kavan: 24 Aug 2003 — take DDMM = 2408',
      'Aishwarya: 12 Dec 2000 — take DDMM = 1212',
      'Now combine the first half of one + second half of the other...',
    ],
  },
  {
    level: 2,
    title: 'Almost There!',
    lines: [
      'Take Kavan\'s day & month: 24 08',
      'Take Aishwarya\'s day & month: 12 12',
      'First 3 digits from Kavan: 240',
      'Last 3 digits from Aishwarya: 812',
      'Password = 240 + 812',
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
    if (input === PASSWORD) {
      onAccess();
    } else {
      setError(true);
      setShake(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => {
        setShake(false);
        setError(false);
      }, 600);
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
          A Special Place
        </h1>
        <p className="text-rose-200/70 text-lg mb-2 animate-fade-in-up delay-200" style={{ animationFillMode: 'both' }}>
          Only for someone extraordinary
        </p>
        <p className="text-amber-200/50 text-sm mb-4 animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
          <Sparkles size={14} className="inline mr-1" />
          Aishwarya, this is for you
          <Sparkles size={14} className="inline ml-1" />
        </p>

        {/* Password clue teaser */}
        <div className="mb-6 animate-fade-in-up delay-400" style={{ animationFillMode: 'both' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Calculator size={14} className="text-amber-400" />
            <span className="text-amber-300/80 text-xs tracking-wide">
              6 digits hidden in your birthdays
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
            Not quite... try again!
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
                className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-rose-400/30 text-white text-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center mx-auto"
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-3 max-w-[240px] mx-auto">
            <button
              type="button"
              onClick={handleBackspace}
              className="w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-sm transition-all duration-200 active:scale-95"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => handleDigitClick('0')}
              className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-rose-400/30 text-white text-xl font-medium transition-all duration-200 active:scale-95"
            >
              0
            </button>
            <button
              type="submit"
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white transition-all duration-200 active:scale-95 shadow-lg shadow-rose-500/20"
            >
              <Heart size={20} fill="currentColor" className="mx-auto" />
            </button>
          </div>
        </form>

        {/* Hint system */}
        <div className="mt-8">
          {hintLevel < 0 ? (
            <button
              onClick={() => setHintLevel(0)}
              className="text-white/30 text-xs hover:text-white/50 transition-colors underline underline-offset-4 inline-flex items-center gap-1"
            >
              <Calculator size={12} />
              Need a hint? Decode the birthdays
            </button>
          ) : (
            <div className="animate-fade-in">
              <div className="glass rounded-2xl p-5 text-left space-y-3">
                {/* Hint header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center">
                      <Calculator size={12} className="text-amber-400" />
                    </div>
                    <span className="text-amber-300 text-xs font-semibold tracking-wider uppercase">
                      Hint Level {Math.min(hintLevel + 1, HINTS.length)} / {HINTS.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="text-white/30 hover:text-white/50 text-xs transition-colors"
                  >
                    {showCalculator ? 'Hide' : 'Show'} Calculator
                  </button>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5">
                  {HINTS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= hintLevel ? 'bg-amber-400/60' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Mini calculator */}
                {showCalculator && (
                  <div className="bg-black/30 rounded-xl p-3 space-y-2 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2">
                        <p className="text-rose-300/60 mb-0.5">Kavan</p>
                        <p className="text-rose-300 font-mono">24 Aug 2003</p>
                        <p className="text-rose-400 font-mono font-bold mt-1">DDMM = 2408</p>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                        <p className="text-amber-300/60 mb-0.5">Aishwarya</p>
                        <p className="text-amber-300 font-mono">12 Dec 2000</p>
                        <p className="text-amber-400 font-mono font-bold mt-1">DDMM = 1212</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-white/40 text-[10px] mb-1">COMBINATION</p>
                      <p className="text-white/70 font-mono text-sm">
                        240 + 812 = ?
                      </p>
                    </div>
                  </div>
                )}

                {/* Hint lines */}
                <div className="space-y-1.5">
                  {currentHint?.lines.map((line, i) => (
                    <p key={i} className="text-rose-200/60 text-xs leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>

                {/* Next hint button */}
                {hintLevel < HINTS.length - 1 && (
                  <button
                    onClick={() => setHintLevel(prev => prev + 1)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white/60 text-xs transition-all"
                  >
                    Still stuck? Reveal more
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
