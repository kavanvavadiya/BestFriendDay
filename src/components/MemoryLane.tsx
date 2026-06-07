import { useState, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight, Puzzle, ArrowRight } from 'lucide-react';

const MEMORIES = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'The Beginning',
    message: 'Every great friendship has a beginning, and ours started with a spark that only grew brighter with time.',
    date: 'Where it all started',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Adventures Together',
    message: 'From silly adventures to deep conversations — every moment with you is an adventure I cherish.',
    date: 'Making memories',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/4587665/pexels-photo-4587665.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Laughter & Joy',
    message: 'Your laughter is contagious and your joy is infectious. You make the world a happier place just by being you.',
    date: 'The best laughs',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Through It All',
    message: 'Rain or shine, good days and tough ones — having you by my side makes everything better.',
    date: 'Always together',
  },
  {
    id: 5,
    image: 'https://images.pexels.com/photos/1679315/pexels-photo-1679315.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Our Bond',
    message: 'Some friendships are so deep they become family. That is what you are to me — chosen family.',
    date: 'Unbreakable bond',
  },
  {
    id: 6,
    image: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Here\'s To Us',
    message: 'To the countless memories we have made and the infinite ones yet to come. Happy Best Friend Day, Aishwarya!',
    date: 'Forever & always',
  },
];

export default function MemoryLane({ onContinue }: { onContinue: () => void }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [animating, setAnimating] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      if (current < MEMORIES.length - 1) {
        goNext();
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const goNext = () => {
    if (current < MEMORIES.length - 1 && !animating) {
      setDirection('right');
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => prev + 1);
        setAnimating(false);
      }, 300);
    }
  };

  const goPrev = () => {
    if (current > 0 && !animating) {
      setDirection('left');
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => prev - 1);
        setAnimating(false);
      }, 300);
    }
  };

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const memory = MEMORIES[current];
  const isLast = current === MEMORIES.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f0] via-[#faf0e6] to-[#f5e6d3] relative overflow-hidden">
      {/* Header */}
      <div className="pt-8 pb-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Memory Lane
        </h2>
        <p className="text-rose-400/70 text-sm tracking-wider">Our journey together</p>
        <div className="flex justify-center gap-1.5 mt-4">
          {MEMORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 'right' : 'left');
                setAnimating(true);
                setTimeout(() => {
                  setCurrent(i);
                  setAnimating(false);
                }, 300);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-rose-400 scale-125'
                  : i < current
                  ? 'bg-rose-300/50'
                  : 'bg-gray-300/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main card */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto mt-6">
        <div className={`transition-all duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-rose-100/30">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={memory.image}
                alt={memory.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Like button */}
              <button
                onClick={() => toggleLike(memory.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              >
                <Heart
                  size={20}
                  className={liked.has(memory.id) ? 'text-rose-500' : 'text-white'}
                  fill={liked.has(memory.id) ? 'currentColor' : 'none'}
                />
              </button>

              {/* Date badge */}
              <div className="absolute bottom-4 left-4 px-4 py-1.5 bg-white/30 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm font-medium">{memory.date}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl font-bold text-gray-800 mb-3">
                {memory.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {memory.message}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 mb-8">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 ${
              current === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-white/60 hover:bg-white/80 shadow-md hover:shadow-lg active:scale-95'
            }`}
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-medium text-gray-700">Previous</span>
          </button>

          {isLast ? (
            <button
              onClick={onContinue}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Puzzle size={18} />
              Solve the Puzzle
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-5 py-3 bg-white/60 hover:bg-white/80 rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              <span className="text-sm font-medium text-gray-700">Next</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
