import { ArrowRight, Download, Printer, RotateCcw, Trash2, Users, CheckCircle2 } from 'lucide-react';
import { getCharacterVariant } from '../../assets/characters/registry';
import { CharacterAvatar } from '../common/CharacterAvatar';
import type { Assignment } from '../../types/assignment';
import type { Participant } from '../../types/participant';

interface ResultsSummaryProps {
  participants: Participant[];
  assignments: Assignment[];
  onExportCsv: () => void;
  onPrint: () => void;
  onStartNewDraw: () => void;
  onRequestClearAll: () => void;
}

export function ResultsSummary({
  participants,
  assignments,
  onExportCsv,
  onPrint,
  onStartNewDraw,
  onRequestClearAll,
}: ResultsSummaryProps) {
  const byId = new Map(participants.map((p) => [p.id, p]));
  const completedCount = assignments.filter((a) => a.revealed).length;

  return (
    <div className="space-y-6">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card print-card flex items-center gap-4 rounded-3xl p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ice-400/20 text-ice-300">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ice-200/70">
              Total Participants
            </div>
            <div className="font-display text-3xl font-bold text-white">{participants.length}</div>
          </div>
        </div>

        <div className="glass-card print-card flex items-center gap-4 rounded-3xl p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pastel-mint/20 text-pastel-mint">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ice-200/70">
              Completed Assignments
            </div>
            <div className="font-display text-3xl font-bold text-white">{completedCount}</div>
          </div>
        </div>

        <div className="glass-card no-print flex flex-wrap items-center justify-center gap-2 rounded-3xl p-4 sm:justify-end">
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pastel-mint to-ice-400 px-4 py-2.5 text-xs font-extrabold text-navy-950 shadow transition hover:brightness-105"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 rounded-xl border border-ice-300/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Pairings Table / Cards */}
      <div className="glass-card print-card rounded-3xl p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Manita-Manito Pairings
            </h2>
            <p className="text-xs text-ice-200/70">
              Verified derangement: zero self-assignments and every participant gives &amp; receives
              exactly once.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {assignments.map((assignment, index) => {
            const giver = byId.get(assignment.giverId);
            const recipient = byId.get(assignment.recipientId);
            if (!giver || !recipient) return null;

            return (
              <div
                key={assignment.giverId}
                className="print-card flex items-center justify-between gap-2 rounded-2xl border border-white/12 bg-navy-950/60 p-3.5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-extrabold text-ice-200">
                    {index + 1}
                  </span>
                  <CharacterAvatar variantId={giver.characterId} size="sm" />
                  <div className="min-w-0">
                    <div className="truncate font-display text-sm font-bold text-white sm:text-base">
                      {giver.name}
                    </div>
                    <div className="truncate text-[11px] text-ice-200/60">
                      {getCharacterVariant(giver.characterId).shortName}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-center px-1 text-pastel-gold">
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-pastel-gold/80">
                    gifts
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5 text-right">
                  <div className="min-w-0">
                    <div className="truncate font-display text-sm font-bold text-pastel-pink sm:text-base">
                      {recipient.name}
                    </div>
                    <div className="truncate text-[11px] text-ice-200/60">
                      {getCharacterVariant(recipient.characterId).shortName}
                    </div>
                  </div>
                  <CharacterAvatar variantId={recipient.characterId} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onRequestClearAll}
          className="flex items-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200 transition hover:bg-rose-500/20"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Data
        </button>

        <button
          type="button"
          onClick={onStartNewDraw}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pastel-gold via-amber-300 to-pastel-pink px-6 py-3 text-sm font-extrabold text-navy-950 shadow-gold transition hover:brightness-105"
        >
          <RotateCcw className="h-4 w-4" />
          Start New Draw
        </button>
      </div>
    </div>
  );
}
