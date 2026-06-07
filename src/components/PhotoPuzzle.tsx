import { useState, useCallback } from 'react';
import { Puzzle, RotateCcw, CheckCircle, ArrowRight } from 'lucide-react';
import refImage from '../assets/ref.png';

const GRID_SIZE = 3;
const TOTAL = GRID_SIZE * GRID_SIZE;
const IMAGE_URL = refImage;

// positions[i] = which piece ID is at grid slot i
// Piece is correct when positions[i] === i
function createShuffled(): number[] {
  const arr = Array.from({ length: TOTAL }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Make sure it's not already solved
  if (arr.every((v, i) => v === i)) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

export default function PhotoPuzzle({ onComplete }: { onComplete: () => void }) {
  const [positions, setPositions] = useState<number[]>(createShuffled);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const checkSolved = useCallback((p: number[]) => p.every((v, i) => v === i), []);

  const swap = (a: number, b: number) => {
    if (solved || a === b) return;
    setPositions(prev => {
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      if (checkSolved(next)) {
        setSolved(true);
        setTimeout(onComplete, 1500);
      }
      return next;
    });
    setMoves(prev => prev + 1);
    setSelected(null);
  };

  const handleClick = (index: number) => {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
    } else if (selected === index) {
      setSelected(null);
    } else {
      swap(selected, index);
    }
  };

  const handleReset = () => {
    setPositions(createShuffled());
    setSelected(null);
    setMoves(0);
    setSolved(false);
  };

  const getPieceStyle = (slotIndex: number) => {
    const pieceId = positions[slotIndex];
    const row = Math.floor(pieceId / GRID_SIZE);
    const col = pieceId % GRID_SIZE;
    const isCorrect = pieceId === slotIndex;
    const isSelected = selected === slotIndex;

    return {
      backgroundImage: `url(${IMAGE_URL})`,
      backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
      backgroundPosition: `${(col / (GRID_SIZE - 1)) * 100}% ${(row / (GRID_SIZE - 1)) * 100}%`,
      borderColor: solved
        ? '#4ade80'
        : isCorrect
        ? '#4ade80'
        : isSelected
        ? '#f472b6'
        : 'rgba(255,255,255,0.8)',
      boxShadow: solved
        ? '0 0 15px rgba(74,222,128,0.4)'
        : isSelected
        ? '0 0 15px rgba(244,114,182,0.4)'
        : 'none',
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f0] via-[#faf0e6] to-[#f5e6d3] flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/60 rounded-full mb-4">
          <Puzzle size={16} className="text-amber-600" />
          <span className="text-amber-700 text-sm font-medium">Puzzle Challenge</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Piece Us Together
        </h2>
        <p className="text-gray-500 text-sm">
          Click two pieces to swap them, or drag & drop
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="px-4 py-2 bg-white/60 rounded-full">
          <span className="text-gray-600 text-sm">Moves: </span>
          <span className="font-semibold text-gray-800">{moves}</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full transition-all text-sm text-gray-600 hover:text-gray-800"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* Reference image */}
      <div className="mb-6">
        <p className="text-gray-400 text-xs mb-2 text-center">Reference:</p>
        <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-white/60 shadow-md mx-auto">
          <img src={IMAGE_URL} alt="Reference" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Puzzle grid */}
      <div
        className="grid gap-1.5 rounded-2xl overflow-hidden p-1.5 bg-white/40 backdrop-blur-sm shadow-xl border border-rose-100/30"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(85vw, 400px)',
          aspectRatio: '1',
        }}
      >
        {positions.map((_, slotIndex) => (
          <div
            key={slotIndex}
            className={`puzzle-piece aspect-square rounded-lg ${solved ? 'correct' : ''}`}
            style={getPieceStyle(slotIndex)}
            onClick={() => handleClick(slotIndex)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', String(slotIndex));
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = Number(e.dataTransfer.getData('text/plain'));
              swap(from, slotIndex);
            }}
          />
        ))}
      </div>

      {/* Solved overlay */}
      {solved && (
        <div className="mt-6 animate-scale-in text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-full">
            <CheckCircle size={20} className="text-green-500" />
            <span className="text-green-700 font-medium">Puzzle Solved in {moves} moves!</span>
          </div>
          <div className="mt-4">
            <button
              onClick={onComplete}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-400 to-amber-400 text-white rounded-full font-medium shadow-lg shadow-rose-300/30 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              See the Surprise
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
