import { useState } from 'react';
import { Pencil, Check, X, Trash2, Shuffle, Eraser } from 'lucide-react';
import { CHARACTER_VARIANT_LIST, getCharacterVariant } from '../../assets/characters/registry';
import { CharacterAvatar } from '../common/CharacterAvatar';
import { useToastStore } from '../common/ToastContainer';
import type { CharacterVariantId } from '../../types/character';
import type { Participant } from '../../types/participant';

interface ParticipantListProps {
  participants: Participant[];
  selectedPreviewId: string | null;
  onSelectPreview: (participant: Participant) => void;
  onEditName: (id: string, nextName: string) => { ok: boolean; error?: string };
  onChangeCharacter: (id: string, characterId: CharacterVariantId) => void;
  onRemove: (id: string) => void;
  onRandomizeAll: () => void;
  onRequestClear: () => void;
}

export function ParticipantList({
  participants,
  selectedPreviewId,
  onSelectPreview,
  onEditName,
  onChangeCharacter,
  onRemove,
  onRandomizeAll,
  onRequestClear,
}: ParticipantListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const pushToast = useToastStore((s) => s.pushToast);

  const startEdit = (p: Participant) => {
    setEditingId(p.id);
    setDraftName(p.name);
    setEditError(null);
  };

  const commitEdit = (id: string) => {
    const res = onEditName(id, draftName);
    if (!res.ok) {
      setEditError(res.error ?? 'Invalid name');
      return;
    }
    setEditingId(null);
    setEditError(null);
    pushToast('Participant name updated.', 'success');
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            Gift Exchange Roster{' '}
            <span className="ml-1 inline-flex items-center rounded-full bg-pastel-purple/25 px-2.5 py-0.5 text-sm font-extrabold text-pastel-purple">
              {participants.length}
            </span>
          </h2>
          <p className="text-xs text-ice-200/70">
            Click any participant to preview their 3D fantasy character.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onRandomizeAll();
              pushToast('Randomized all fantasy characters!', 'info');
            }}
            disabled={participants.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-ice-300/25 bg-navy-950/65 px-3 py-2 text-xs font-bold text-ice-200 transition hover:border-ice-300/60 hover:text-white disabled:opacity-40"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Shuffle Characters
          </button>

          <button
            type="button"
            onClick={onRequestClear}
            disabled={participants.length === 0}
            className="flex items-center gap-1.5 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-500/20 disabled:opacity-40"
          >
            <Eraser className="h-3.5 w-3.5" />
            Clear List
          </button>
        </div>
      </div>

      {participants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ice-300/25 bg-navy-950/40 px-6 py-12 text-center">
          <div className="mb-2 text-4xl">🎁</div>
          <p className="font-display text-lg font-bold text-white">No Participants Yet</p>
          <p className="mt-1 max-w-sm text-xs text-ice-200/70">
            Add at least 2 participants individually or paste multiple names separated by new lines
            to build your 3D circle.
          </p>
        </div>
      ) : (
        <div className="grid max-h-[460px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {participants.map((participant) => {
            const isEditing = editingId === participant.id;
            const isPreviewed = selectedPreviewId === participant.id;
            const variant = getCharacterVariant(participant.characterId);

            return (
              <div
                key={participant.id}
                onClick={() => !isEditing && onSelectPreview(participant)}
                className={`group flex items-center gap-3 rounded-2xl border p-3 transition ${
                  isPreviewed
                    ? 'border-pastel-gold/70 bg-navy-800/85 shadow-gold/20'
                    : 'cursor-pointer border-white/10 bg-navy-950/55 hover:border-ice-300/40 hover:bg-navy-900/70'
                }`}
              >
                <CharacterAvatar variantId={participant.characterId} size="md" />

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit(participant.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          maxLength={32}
                          className="w-full rounded-lg border border-ice-400/60 bg-navy-950 px-2.5 py-1 text-sm font-bold text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => commitEdit(participant.id)}
                          className="rounded-lg bg-pastel-mint p-1.5 text-navy-950"
                          aria-label="Save name"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-lg bg-white/10 p-1.5 text-white"
                          aria-label="Cancel edit"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {editError && <p className="text-[11px] font-bold text-rose-300">{editError}</p>}
                    </div>
                  ) : (
                    <>
                      <div className="truncate font-display text-base font-bold text-white">
                        {participant.name}
                      </div>
                      <div className="mt-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <select
                          aria-label={`Change character for ${participant.name}`}
                          value={participant.characterId}
                          onChange={(e) => {
                            const nextChar = e.target.value as CharacterVariantId;
                            onChangeCharacter(participant.id, nextChar);
                            onSelectPreview({ ...participant, characterId: nextChar });
                          }}
                          className="max-w-[140px] rounded-lg border border-white/15 bg-navy-900 px-2 py-0.5 text-[11px] font-bold text-ice-200 outline-none focus:border-ice-400"
                        >
                          {CHARACTER_VARIANT_LIST.map((v) => (
                            <option key={v.id} value={v.id} className="bg-navy-900 text-white">
                              {v.name}
                            </option>
                          ))}
                        </select>
                        <span className="hidden text-[10px] text-ice-200/45 sm:inline">
                          {variant.shortName}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => startEdit(participant)}
                      className="rounded-lg p-1.5 text-ice-200/65 transition hover:bg-white/10 hover:text-white"
                      aria-label={`Edit ${participant.name}`}
                      title="Edit name"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(participant.id)}
                      className="rounded-lg p-1.5 text-rose-300/70 transition hover:bg-rose-500/20 hover:text-rose-200"
                      aria-label={`Remove ${participant.name}`}
                      title="Remove participant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
