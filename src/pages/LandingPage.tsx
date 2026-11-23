import { lazy, Suspense, useMemo, useState } from 'react';
import {
  Gift,
  Sparkles,
  Users,
  Wand2,
  PartyPopper,
  ArrowRight,
  Play,
  Trash2,
  Loader2,
} from 'lucide-react';
import { CHARACTER_VARIANT_LIST } from '../assets/characters/registry';
import { CharacterAvatar } from '../components/common/CharacterAvatar';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToastStore } from '../components/common/ToastContainer';
import { CharacterPreviewCanvas } from '../components/participants/CharacterPreviewCanvas';
import { useGiftExchangeStore } from '../store/giftExchangeStore';

const LazyChristmasScene = lazy(() =>
  import('../three/scenes/ChristmasScene').then((mod) => ({ default: mod.ChristmasScene })),
);

const EMPTY_SET = new Set<string>();

export function LandingPage() {
  const setScreen = useGiftExchangeStore((s) => s.setScreen);
  const participants = useGiftExchangeStore((s) => s.participants);
  const assignments = useGiftExchangeStore((s) => s.assignments);
  const clearAllData = useGiftExchangeStore((s) => s.clearAllData);
  const pushToast = useToastStore((s) => s.pushToast);

  const [heroCharIndex, setHeroCharIndex] = useState(0);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const activeHeroVariant = CHARACTER_VARIANT_LIST[heroCharIndex];

  const hasUnfinishedDraw = useMemo(() => {
    const revealed = assignments.filter((a) => a.revealed).length;
    return assignments.length >= 2 && revealed > 0 && revealed < assignments.length;
  }, [assignments]);

  const howItWorks = [
    {
      step: '01',
      title: 'Gather Your Crew',
      desc: 'Add names one-by-one or paste your entire party list and dress everyone as adorable 3D Christmas creatures.',
      icon: Users,
      accent: 'from-ice-400 to-pastel-mint',
    },
    {
      step: '02',
      title: 'Step Into the Circle',
      desc: 'Watch every participant come alive around a glowing floating snow stage with twinkling lights and falling snow.',
      icon: Sparkles,
      accent: 'from-pastel-purple to-ice-400',
    },
    {
      step: '03',
      title: 'Spin the 3D Wheel',
      desc: 'Each giver hops to the center stage while the spotlight races around eligible friends before landing on their secret match.',
      icon: Wand2,
      accent: 'from-pastel-pink to-pastel-purple',
    },
    {
      step: '04',
      title: 'Unwrap & Export',
      desc: 'Celebrate every private reveal with a 3D magical gift box & confetti burst, then export the organizer summary to CSV or print.',
      icon: PartyPopper,
      accent: 'from-pastel-gold to-pastel-pink',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Soft ambient radial glows */}
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-pastel-purple/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-32 h-96 w-96 rounded-full bg-ice-400/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        {/* Resume unfinished session banner */}
        {hasUnfinishedDraw && (
          <div className="glass-card mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border-pastel-gold/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pastel-gold/20 text-pastel-gold">
                <Play className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-base font-bold text-white">
                  Unfinished Gift Exchange Found
                </div>
                <p className="text-xs text-ice-200/75">
                  {assignments.filter((a) => a.revealed).length} of {assignments.length} pairings
                  already revealed. Pick up right where you left off!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setScreen('exchange')}
              className="rounded-xl bg-pastel-gold px-4 py-2 text-xs font-extrabold text-navy-950 shadow transition hover:brightness-105"
            >
              Resume Session
            </button>
          </div>
        )}

        {/* Hero Section */}
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-pastel-gold/35 bg-pastel-gold/10 px-4 py-1.5 text-xs font-extrabold tracking-wide text-pastel-gold">
              <Sparkles className="h-4 w-4" />
              3D MANITA-MANITO • NO ACCOUNT REQUIRED
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Make Gift Giving{' '}
              <span className="text-gradient-festive animate-shimmer">Magical.</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-ice-200/80 sm:text-lg">
              Turn your holiday Manita-Manito draw into an unforgettable 3D party stage. Gather
              adorable Fall Guys-inspired Christmas creatures around a snowy floating wheel, watch
              them bounce and spotlight-spin, and unwrap each pairing live in your browser.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setScreen('setup')}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pastel-gold via-amber-300 to-pastel-pink px-7 py-4 font-display text-base font-bold text-navy-950 shadow-gold transition hover:scale-[1.02] hover:brightness-105 active:scale-95"
              >
                <Gift className="h-5 w-5" />
                Start Gift Exchange
                <ArrowRight className="h-5 w-5" />
              </button>

              {participants.length >= 2 && (
                <button
                  type="button"
                  onClick={() => setScreen('exchange')}
                  className="flex items-center gap-2 rounded-2xl border border-ice-300/30 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:border-ice-300/60 hover:bg-white/15"
                >
                  <Play className="h-4 w-4 text-pastel-mint" />
                  Launch 3D Room ({participants.length})
                </button>
              )}
            </div>

            <p className="text-xs font-semibold text-ice-200/55">
              &ldquo;Make Every Gift a Little More Magical.&rdquo; • 100% browser-based &amp; private.
            </p>
          </div>

          {/* Interactive 3D Hero Character Showcase */}
          <div className="lg:col-span-6">
            <div className="glass-card relative overflow-hidden rounded-[2rem] p-4 shadow-2xl sm:p-5">
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-pastel-mint">
                    Meet the Fantasy Cast
                  </div>
                  <div className="font-display text-xl font-bold text-white">
                    {activeHeroVariant.name}
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-ice-200">
                  {heroCharIndex + 1} / {CHARACTER_VARIANT_LIST.length}
                </span>
              </div>

              <div className="rounded-3xl bg-gradient-to-b from-navy-800/80 to-navy-950/90">
                <CharacterPreviewCanvas
                  variantId={activeHeroVariant.id}
                  animationState="giver_center"
                  heightClass="h-72 sm:h-80"
                />
              </div>

              <p className="mt-3 text-center text-xs font-semibold text-ice-200/75">
                {activeHeroVariant.tagline}
              </p>

              {/* 10 Character Quick Selector Strip */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {CHARACTER_VARIANT_LIST.map((variant, idx) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setHeroCharIndex(idx)}
                    className={`rounded-2xl p-1 transition ${
                      idx === heroCharIndex
                        ? 'scale-110 ring-2 ring-pastel-gold'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={variant.name}
                  >
                    <CharacterAvatar variantId={variant.id} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Live 3D Circular Stage Preview */}
        {participants.length >= 2 && (
          <section className="mt-14">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-ice-300">
                  Interactive 3D Stage Preview
                </div>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  The Circular Christmas Wheel
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setScreen('exchange')}
                className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-pastel-gold transition hover:bg-white/15"
              >
                Open Full-Screen 3D Room
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="glass-card h-[380px] overflow-hidden rounded-[2rem] shadow-2xl sm:h-[440px]">
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center gap-2 text-sm font-bold text-ice-200">
                    <Loader2 className="h-5 w-5 animate-spin text-pastel-gold" />
                    Loading 3D Christmas Stage...
                  </div>
                }
              >
                <LazyChristmasScene
                  participants={participants}
                  phase="ready"
                  currentGiverId={null}
                  highlightedId={null}
                  activeRecipientId={null}
                  assignedRecipientIds={EMPTY_SET}
                  completedGiverIds={EMPTY_SET}
                />
              </Suspense>
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <section className="mt-16">
          <div className="mb-8 text-center">
            <div className="text-xs font-extrabold uppercase tracking-wider text-pastel-pink">
              Simple Party Flow
            </div>
            <h2 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="glass-card group rounded-3xl p-6 transition hover:-translate-y-1 hover:border-ice-300/40"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-navy-950 shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-display text-2xl font-bold text-white/20">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ice-200/75">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ice-200/60">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Manita-Manito 3D Logo"
              className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/20"
            />
            <span className="font-bold text-white">3D Manita-Manito</span>
            <span>— Make Every Gift a Little More Magical.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Runs locally in your browser via WebGL &amp; localStorage.</span>
            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-bold text-rose-300/80 transition hover:bg-rose-500/15 hover:text-rose-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All Data
            </button>
          </div>
        </footer>
      </div>

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear All Saved Data?"
        description="This removes all participants, character choices, and saved drawing progress from this browser's localStorage."
        confirmLabel="Clear Everything"
        tone="danger"
        onCancel={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          clearAllData();
          setConfirmClearOpen(false);
          pushToast('All local session data cleared.', 'info');
        }}
      />
    </div>
  );
}
