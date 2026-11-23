import { Gift, Sparkles, Users, Trophy, Music } from 'lucide-react';
import { useGiftExchangeStore } from '../../store/giftExchangeStore';
import type { AppScreen } from '../../types/assignment';

export function Navbar() {
  const screen = useGiftExchangeStore((s) => s.screen);
  const setScreen = useGiftExchangeStore((s) => s.setScreen);
  const participantsCount = useGiftExchangeStore((s) => s.participants.length);
  const assignments = useGiftExchangeStore((s) => s.assignments);
  const musicEnabled = useGiftExchangeStore((s) => s.musicEnabled);
  const toggleMusic = useGiftExchangeStore((s) => s.toggleMusic);

  const hasAssignments = assignments.length >= 2;
  const allRevealed = hasAssignments && assignments.every((a) => a.revealed);

  const navItems: { id: AppScreen; label: string; icon: typeof Sparkles; disabled?: boolean }[] = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'setup', label: `Participants (${participantsCount})`, icon: Users },
    { id: 'exchange', label: '3D Wheel Room', icon: Gift, disabled: participantsCount < 2 },
    { id: 'results', label: 'Results', icon: Trophy, disabled: !allRevealed },
  ];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-navy-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <button
          type="button"
          onClick={() => setScreen('landing')}
          className="group flex items-center gap-2.5 text-left"
        >
          <img
            src="/logo.jpg"
            alt="Manita-Manito 3D Logo"
            className="h-9 w-9 rounded-xl object-cover shadow-glow ring-1 ring-white/25 transition group-hover:scale-105"
          />
          <div className="font-display text-sm font-bold leading-tight tracking-tight text-white sm:text-base">
            Manita-Manito <span className="text-pastel-gold">3D</span>
          </div>
        </button>

        <nav className="flex items-center gap-1 rounded-2xl border border-white/10 bg-navy-900/75 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = screen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => setScreen(item.id)}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition sm:px-3.5 sm:text-sm ${
                  active
                    ? 'bg-gradient-to-r from-pastel-purple/90 to-ice-400/90 text-navy-950 shadow-md'
                    : item.disabled
                      ? 'cursor-not-allowed text-white/25'
                      : 'text-ice-200/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={toggleMusic}
          className={`flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-bold transition ${
            musicEnabled
              ? 'border-pastel-gold/50 bg-pastel-gold/15 text-pastel-gold hover:bg-pastel-gold/25'
              : 'border-white/15 bg-navy-900/80 text-ice-200/60 hover:border-ice-300/50 hover:text-white'
          }`}
          title={musicEnabled ? 'Pause Christmas music' : 'Play Christmas music'}
          aria-label={musicEnabled ? 'Pause Christmas music' : 'Play Christmas music'}
        >
          <Music className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{musicEnabled ? 'Music On' : 'Music Off'}</span>
        </button>
      </div>
    </header>
  );
}
