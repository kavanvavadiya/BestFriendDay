import { useEffect, useState } from 'react';
import { Heart, Star, Sparkles, PartyPopper } from 'lucide-react';

const FIREWORKS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  color: ['#e8a0b4', '#d4a574', '#f472b6', '#fbbf24', '#a78bfa', '#fb7185', '#34d399', '#60a5fa'][Math.floor(Math.random() * 8)],
  duration: 2 + Math.random() * 2,
  size: 4 + Math.random() * 8,
}));

export default function Celebration() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2500),
      setTimeout(() => setPhase(5), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d1b2e] via-[#1a1025] to-[#0d0a12] flex items-center justify-center relative overflow-hidden">
      {/* Fireworks */}
      {FIREWORKS.map(f => (
        <div
          key={f.id}
          className="absolute pointer-events-none"
          style={{
            left: `${f.x}%`,
            top: '0',
            width: f.size,
            height: f.size,
            backgroundColor: f.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${f.duration}s linear ${f.delay}s infinite`,
          }}
        />
      ))}

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-rose-500/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pink-500/5 blur-[120px]" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Trophy / Celebration icon */}
        <div className={`transition-all duration-1000 ${phase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-400 via-rose-400 to-amber-400 flex items-center justify-center shadow-2xl shadow-amber-400/30 animate-float">
            <PartyPopper size={48} className="text-white" />
          </div>
        </div>

        {/* Main message */}
        <div className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            <span className="animate-shimmer">Happy Best Friend Day!</span>
          </h1>
        </div>

        <div className={`transition-all duration-1000 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-rose-200 text-xl md:text-2xl font-display italic mb-8">
            Aishwarya, you are my person
          </p>
        </div>

        {/* The big message card */}
        <div className={`transition-all duration-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass rounded-3xl p-8 md:p-10 text-left space-y-5 mb-8">
            <p className="text-white/90 text-lg leading-relaxed">
              Dear Aishwarya,
            </p>
            <p className="text-white/80 leading-relaxed">
              There are friends, there is family, and then there are friends who become family.
              You are that once-in-a-lifetime kind of friend who makes the ordinary feel extraordinary.
            </p>
            <p className="text-white/80 leading-relaxed">
              Thank you for every late-night call, every shared secret, every moment of uncontrollable laughter,
              and every time you stood by me when things were tough. You make the world a better place just by being in it.
            </p>
            <p className="text-white/80 leading-relaxed">
              I am so grateful that life brought us together. Here is to every memory we have made
              and every adventure still waiting for us.
            </p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-rose-300 font-display text-xl italic">
                "A true friend is the greatest of all blessings."
              </p>
            </div>
          </div>
        </div>

        {/* From Kavan */}
        <div className={`transition-all duration-1000 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart size={20} className="text-rose-400" fill="currentColor" />
            <p className="text-white/70 text-lg">
              With love and gratitude,
            </p>
            <Heart size={20} className="text-rose-400" fill="currentColor" />
          </div>
          <p className="font-display text-3xl font-bold text-amber-300 mb-2">Kavan Vavadiya</p>
          <p className="text-white/40 text-sm">Your best friend, now and always</p>
        </div>

        {/* Stars decoration */}
        <div className={`transition-all duration-1000 ${phase >= 5 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center gap-4 mt-8">
            {[Star, Heart, Sparkles, Heart, Star].map((Icon, i) => (
              <Icon
                key={i}
                size={16}
                className="text-amber-400/60 animate-float"
                style={{ animationDelay: `${i * 0.3}s` }}
                fill={i === 1 || i === 3 ? 'currentColor' : 'none'}
              />
            ))}
          </div>

          <p className="text-white/30 text-xs mt-8">
            8th June — Best Friend Day 2026
          </p>
        </div>
      </div>
    </div>
  );
}
