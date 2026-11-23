import { useEffect } from 'react';
import { soundEngine } from './assets/sounds/soundEffects';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { GiftExchangePage } from './pages/GiftExchangePage';
import { LandingPage } from './pages/LandingPage';
import { ParticipantSetupPage } from './pages/ParticipantSetupPage';
import { ResultsPage } from './pages/ResultsPage';
import { useGiftExchangeStore } from './store/giftExchangeStore';

export function App() {
  const screen = useGiftExchangeStore((s) => s.screen);
  const soundEnabled = useGiftExchangeStore((s) => s.soundEnabled);
  const musicEnabled = useGiftExchangeStore((s) => s.musicEnabled);

  useEffect(() => {
    soundEngine.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    soundEngine.musicEnabled = musicEnabled;
    if (!musicEnabled) {
      soundEngine.stopMusic();
      return;
    }

    const unlockAndPlay = () => {
      if (useGiftExchangeStore.getState().musicEnabled) {
        soundEngine.startMusic();
      }
    };

    window.addEventListener('pointerdown', unlockAndPlay, { once: true });
    window.addEventListener('keydown', unlockAndPlay, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAndPlay);
      window.removeEventListener('keydown', unlockAndPlay);
    };
  }, [musicEnabled]);

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />
      <ToastContainer />
      <main>
        {screen === 'landing' && <LandingPage />}
        {screen === 'setup' && <ParticipantSetupPage />}
        {screen === 'exchange' && <GiftExchangePage />}
        {screen === 'results' && <ResultsPage />}
      </main>
    </div>
  );
}

export default App;
