import { useState } from 'react';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { getCharacterVariant } from '../assets/characters/registry';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToastStore } from '../components/common/ToastContainer';
import { CharacterPreviewCanvas } from '../components/participants/CharacterPreviewCanvas';
import { ParticipantForm } from '../components/participants/ParticipantForm';
import { ParticipantList } from '../components/participants/ParticipantList';
import { useParticipants } from '../hooks/useParticipants';
import { useGiftExchangeStore } from '../store/giftExchangeStore';
import type { CharacterVariantId } from '../types/character';
import type { Participant } from '../types/participant';

export function ParticipantSetupPage() {
  const {
    participants,
    count,
    canStartDraw,
    addParticipant,
    addParticipantsBulk,
    updateParticipantName,
    updateParticipantCharacter,
    removeParticipant,
    clearParticipants,
    randomizeAllCharacters,
  } = useParticipants();

  const setScreen = useGiftExchangeStore((s) => s.setScreen);
  const prepareNewDraw = useGiftExchangeStore((s) => s.prepareNewDraw);
  const pushToast = useToastStore((s) => s.pushToast);

  const [previewParticipantId, setPreviewParticipantId] = useState<string | null>(
    participants[0]?.id ?? null,
  );
  const [previewVariantOverride, setPreviewVariantOverride] = useState<CharacterVariantId>('santa');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const previewParticipant =
    participants.find((p) => p.id === previewParticipantId) ?? participants[0] ?? null;
  const activeVariantId: CharacterVariantId =
    previewParticipant?.characterId ?? previewVariantOverride;
  const activeVariant = getCharacterVariant(activeVariantId);

  const handleSelectPreview = (participant: Participant) => {
    setPreviewParticipantId(participant.id);
    setPreviewVariantOverride(participant.characterId);
  };

  const handleStartExchange = () => {
    if (!canStartDraw) {
      pushToast('Add at least 2 participants before starting the draw.', 'error');
      return;
    }
    prepareNewDraw();
    setScreen('exchange');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
      {/* Header Row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-pastel-mint">
            <Sparkles className="h-3.5 w-3.5" />
            Step 1 • Organizer Setup
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
            Participant Setup
          </h1>
          <p className="mt-1 text-sm text-ice-200/75">
            Add everyone joining your Manita-Manito and customize their adorable 3D Christmas avatar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartExchange}
          disabled={!canStartDraw}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pastel-gold via-amber-300 to-pastel-pink px-6 py-3.5 font-display text-base font-bold text-navy-950 shadow-gold transition hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
        >
          Enter 3D Gift Exchange ({count})
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {!canStartDraw && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-xs font-bold text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          At least 2 participants are required to start the gift exchange wheel.
        </div>
      )}

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Add Form + 3D Character Preview */}
        <div className="space-y-6 lg:col-span-5">
          <ParticipantForm
            onAddSingle={addParticipant}
            onAddBulk={addParticipantsBulk}
            onSelectPreviewVariant={(variantId) => {
              setPreviewParticipantId(null);
              setPreviewVariantOverride(variantId);
            }}
          />

          {/* Live 3D Avatar Preview Card */}
          <div className="glass-card rounded-3xl p-5">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-ice-300">
                  3D Character Preview
                </div>
                <div className="font-display text-lg font-bold text-white">
                  {previewParticipant ? `${previewParticipant.name} — ` : ''}
                  <span className="text-pastel-gold">{activeVariant.name}</span>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-ice-200">
                Drag to Spin
              </span>
            </div>

            <div className="rounded-3xl bg-gradient-to-b from-navy-800/75 to-navy-950/90">
              <CharacterPreviewCanvas
                variantId={activeVariantId}
                label={previewParticipant?.name}
                animationState="giver_center"
                heightClass="h-60"
              />
            </div>

            <p className="mt-2.5 text-center text-xs text-ice-200/70">{activeVariant.tagline}</p>
          </div>
        </div>

        {/* Right Column: Roster List */}
        <div className="lg:col-span-7">
          <ParticipantList
            participants={participants}
            selectedPreviewId={previewParticipant?.id ?? null}
            onSelectPreview={handleSelectPreview}
            onEditName={updateParticipantName}
            onChangeCharacter={updateParticipantCharacter}
            onRemove={(id) => {
              removeParticipant(id);
              pushToast('Participant removed.', 'info');
            }}
            onRandomizeAll={randomizeAllCharacters}
            onRequestClear={() => setConfirmClearOpen(true)}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear Participant List?"
        description="This will remove all participants from your current list so you can enter a fresh roster."
        confirmLabel="Clear List"
        tone="danger"
        onCancel={() => setConfirmClearOpen(false)}
        onConfirm={() => {
          clearParticipants();
          setConfirmClearOpen(false);
          pushToast('Participant list cleared.', 'info');
        }}
      />
    </div>
  );
}
