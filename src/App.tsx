import { useState, useCallback } from 'react';
import PasswordGate from './components/PasswordGate';
import WelcomeMessage from './components/WelcomeMessage';
import MemoryLane from './components/MemoryLane';
import PhotoPuzzle from './components/PhotoPuzzle';
import Celebration from './components/Celebration';
import BackgroundMusic from './components/BackgroundMusic';
import backgroundMusic from './assets/background.mp3';

type Stage = 'gate' | 'welcome' | 'memories' | 'puzzle' | 'celebration';

function App() {
  const [stage, setStage] = useState<Stage>('gate');
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((next: Stage) => {
    setTransitioning(true);
    setTimeout(() => {
      setStage(next);
      setTransitioning(false);
      window.scrollTo(0, 0);
    }, 400);
  }, []);

  return (
    <>
      {/* Background Music Player */}
      <BackgroundMusic audioSrc={backgroundMusic} autoPlay={true} />
      
      <div className={`transition-opacity duration-400 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        {stage === 'gate' && <PasswordGate onAccess={() => goTo('welcome')} />}
        {stage === 'welcome' && <WelcomeMessage onContinue={() => goTo('memories')} />}
        {stage === 'memories' && <MemoryLane onContinue={() => goTo('puzzle')} />}
        {stage === 'puzzle' && <PhotoPuzzle onComplete={() => goTo('celebration')} />}
        {stage === 'celebration' && <Celebration />}
      </div>
    </>
  );
}

export default App;
