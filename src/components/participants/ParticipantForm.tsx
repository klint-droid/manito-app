import { useState, type FormEvent } from 'react';
import { UserPlus, ClipboardList, Sparkles } from 'lucide-react';
import { CHARACTER_VARIANT_LIST } from '../../assets/characters/registry';
import { CharacterAvatar } from '../common/CharacterAvatar';
import { useToastStore } from '../common/ToastContainer';
import type { CharacterVariantId } from '../../types/character';

interface ParticipantFormProps {
  onAddSingle: (
    name: string,
    characterId?: CharacterVariantId,
  ) => { ok: boolean; error?: string };
  onAddBulk: (rawText: string) => {
    addedCount: number;
    duplicates: string[];
    invalidCount: number;
  };
  onSelectPreviewVariant: (variantId: CharacterVariantId) => void;
}

export function ParticipantForm({
  onAddSingle,
  onAddBulk,
  onSelectPreviewVariant,
}: ParticipantFormProps) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [name, setName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterVariantId | 'auto'>('auto');
  const [bulkText, setBulkText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const pushToast = useToastStore((s) => s.pushToast);

  const handleSingleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = onAddSingle(
      name,
      selectedCharacter === 'auto' ? undefined : selectedCharacter,
    );
    if (!res.ok) {
      setError(res.error ?? 'Please enter a valid name.');
      return;
    }
    setError(null);
    pushToast(`Added ${name.trim()} to the exchange!`, 'success');
    setName('');
  };

  const handleBulkSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) {
      setError('Paste at least one name separated by new lines.');
      return;
    }
    const res = onAddBulk(bulkText);
    if (res.addedCount === 0) {
      setError(
        res.duplicates.length > 0
          ? `All pasted names are already in the list (${res.duplicates.slice(0, 3).join(', ')}).`
          : 'No valid participant names found.',
      );
      return;
    }
    setError(null);
    const dupNote =
      res.duplicates.length > 0 ? ` (${res.duplicates.length} duplicate skipped)` : '';
    pushToast(`Added ${res.addedCount} participants${dupNote}!`, 'success');
    setBulkText('');
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 rounded-2xl bg-navy-950/70 p-1">
        <button
          type="button"
          onClick={() => {
            setMode('single');
            setError(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
            mode === 'single'
              ? 'bg-gradient-to-r from-pastel-pink to-pastel-purple text-navy-950 shadow'
              : 'text-ice-200/75 hover:text-white'
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Add One by One
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('bulk');
            setError(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
            mode === 'bulk'
              ? 'bg-gradient-to-r from-ice-400 to-pastel-mint text-navy-950 shadow'
              : 'text-ice-200/75 hover:text-white'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Paste Multiple
        </button>
      </div>

      {mode === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <div>
            <label htmlFor="participant-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ice-300">
              Participant Name
            </label>
            <div className="flex gap-2">
              <input
                id="participant-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                maxLength={32}
                placeholder="e.g. Anna, Mark, Sofia..."
                className="w-full rounded-xl border border-ice-300/25 bg-navy-950/75 px-4 py-3 text-sm font-semibold text-white placeholder-ice-200/35 outline-none transition focus:border-ice-400 focus:ring-2 focus:ring-ice-400/25"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gradient-to-r from-pastel-gold to-amber-300 px-5 py-3 text-sm font-extrabold text-navy-950 shadow-lg transition hover:brightness-105 active:scale-95"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ice-300">
                Character Appearance
              </span>
              <button
                type="button"
                onClick={() => setSelectedCharacter('auto')}
                className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition ${
                  selectedCharacter === 'auto'
                    ? 'bg-pastel-mint/20 text-pastel-mint ring-1 ring-pastel-mint/50'
                    : 'text-ice-200/60 hover:text-white'
                }`}
              >
                <Sparkles className="h-3 w-3" />
                Auto Random
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {CHARACTER_VARIANT_LIST.map((variant) => {
                const isSelected = selectedCharacter === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setSelectedCharacter(variant.id);
                      onSelectPreviewVariant(variant.id);
                    }}
                    className={`flex flex-col items-center gap-1 rounded-2xl border p-2 text-center transition ${
                      isSelected
                        ? 'border-pastel-gold bg-pastel-gold/15 ring-2 ring-pastel-gold/40'
                        : 'border-white/10 bg-navy-950/50 hover:border-ice-300/40'
                    }`}
                  >
                    <CharacterAvatar variantId={variant.id} size="sm" />
                    <span className="w-full truncate text-[10px] font-bold text-ice-200">
                      {variant.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleBulkSubmit} className="space-y-3">
          <label htmlFor="bulk-names" className="block text-xs font-bold uppercase tracking-wider text-ice-300">
            Paste Names (One Per Line)
          </label>
          <textarea
            id="bulk-names"
            rows={6}
            value={bulkText}
            onChange={(e) => {
              setBulkText(e.target.value);
              if (error) setError(null);
            }}
            placeholder={'Anna\nMark\nJohn\nKate\nSofia'}
            className="w-full rounded-2xl border border-ice-300/25 bg-navy-950/75 p-3.5 text-sm font-semibold text-white placeholder-ice-200/35 outline-none transition focus:border-ice-400 focus:ring-2 focus:ring-ice-400/25"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-ice-200/65">
              Empty lines and duplicates are automatically skipped.
            </span>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-gradient-to-r from-ice-400 to-pastel-mint px-5 py-2.5 text-sm font-extrabold text-navy-950 shadow-lg transition hover:brightness-105"
            >
              Add All Names
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="mt-3 rounded-xl border border-rose-400/35 bg-rose-500/15 px-3 py-2 text-xs font-bold text-rose-200">
          {error}
        </p>
      )}
    </div>
  );
}
