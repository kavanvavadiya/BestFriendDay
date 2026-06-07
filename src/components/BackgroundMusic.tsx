
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface BackgroundMusicProps {
  audioSrc: string;
  autoPlay?: boolean;
}

export default function BackgroundMusic({ audioSrc, autoPlay = true }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop = true;

    // Try to autoplay on mount
    if (autoPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay was prevented, show controls to let user start manually
            setShowControls(true);
          });
      }
    }

    // Handle play/pause events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Set both muted property and volume for better mobile support
      audio.muted = isMuted;
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      // For mobile, ensure audio is ready before playing
      audio.play().catch((error) => {
        console.log('Playback failed:', error);
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Directly set audio properties for mobile compatibility
    audio.muted = newMutedState;
    if (newMutedState) {
      audio.volume = 0;
    } else {
      audio.volume = volume;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} />
      
      {/* Floating music control button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          className={`transition-all duration-300 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {/* Volume slider - appears on hover */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 accent-rose-400 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #e8a0b4 0%, #e8a0b4 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div 
          className="group relative"
          onMouseEnter={() => setShowControls(true)}
        >
          <div className="flex gap-2">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-glow"
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? (
                <Pause size={20} className="text-white" fill="currentColor" />
              ) : (
                <Play size={20} className="text-white ml-0.5" fill="currentColor" />
              )}
            </button>

            {/* Mute/Unmute button */}
            <button
              onClick={toggleMute}
              onTouchEnd={(e) => {
                e.preventDefault();
                toggleMute();
              }}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white/20"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX size={20} className="text-rose-300" />
              ) : (
                <Volume2 size={20} className="text-rose-300" />
              )}
            </button>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
              {isPlaying ? 'Music playing' : 'Click to play music'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
