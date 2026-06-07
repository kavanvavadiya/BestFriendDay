import { useEffect, useState } from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomeMessage({ onContinue }: { onContinue: () => void }) {
  const [phase, setPhase] = useState(0);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    const items = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#e8a0b4', '#d4a574', '#f472b6', '#fbbf24', '#a78bfa', '#fb7185'][Math.floor(Math.random() * 6)],
      delay: Math.random() * 2,
      size: Math.random() * 8 + 4,
    }));
    setConfetti(items);

    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f0] via-[#faf0e6] to-[#f5e6d3] flex items-center justify-center relative overflow-hidden">
      {/* Confetti */}
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute top-0 pointer-events-none"
          style={{
            left: `${c.x}%`,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${3 + Math.random() * 2}s linear ${c.delay}s forwards`,
          }}
        />
      ))}

      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-rose-200/30 blur-2xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-amber-200/30 blur-2xl" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Big heart animation */}
        <div className={`transition-all duration-1000 ${phase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center shadow-xl shadow-rose-300/30 animate-float">
            <Heart size={40} className="text-white" fill="currentColor" />
          </div>
        </div>

        {/* Welcome text */}
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-rose-400/60 text-sm tracking-[0.3em] uppercase mb-4">A Special Message For</p>
        </div>

        <div className={`transition-all duration-1000 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-2 animate-shimmer">
            Aishwarya
          </h1>
          <p className="font-display text-2xl md:text-3xl text-amber-600/80 italic mb-6">Sakhalkar</p>
        </div>

        <div className={`transition-all duration-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-rose-100/50 mb-8">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              You are not just my best friend, you are the person who makes every day brighter,
              every laugh louder, and every memory more beautiful.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              On this Best Friend Day, I wanted to create something as special as you are.
              Something that captures even a fraction of the joy you bring into my life.
            </p>
            <p className="text-rose-500 font-display text-xl italic">
              "Some people arrive and make such a mark on your life, it becomes impossible to imagine it without them."
            </p>
          </div>
        </div>

        <div className={`transition-all duration-1000 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-amber-600/60 text-sm mb-6">
            With all my love, <span className="font-semibold text-amber-600">Kavan</span>
          </p>

          <button
            onClick={onContinue}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-400 to-amber-400 text-white rounded-full font-medium shadow-lg shadow-rose-300/30 hover:shadow-xl hover:shadow-rose-300/40 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Sparkles size={18} />
            Walk Down Memory Lane
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
