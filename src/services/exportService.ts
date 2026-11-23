import { getCharacterVariant } from '../assets/characters/registry';
import type { Assignment } from '../types/assignment';
import type { Participant } from '../types/participant';

function escapeCsvCell(value: string): string {
  const needsQuotes = /[",\r\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function exportAssignmentsToCsv(
  assignments: readonly Assignment[],
  participants: readonly Participant[],
): void {
  const byId = new Map(participants.map((p) => [p.id, p]));
  const headers = ['Order', 'Giver Name', 'Giver Character', 'Recipient Name', 'Recipient Character'];

  const rows = assignments.map((assignment, idx) => {
    const giver = byId.get(assignment.giverId);
    const recipient = byId.get(assignment.recipientId);
    return [
      String(idx + 1),
      giver?.name ?? 'Unknown',
      giver ? getCharacterVariant(giver.characterId).name : '-',
      recipient?.name ?? 'Unknown',
      recipient ? getCharacterVariant(recipient.characterId).name : '-',
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.setAttribute('download', `manita-manito-results-${dateStamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPrintResults(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}

/**
 * Composites the live 3D WebGL group photo canvas into a framed festive PNG keepsake
 * featuring a holiday header, date stamp, and all participant names.
 */
export function createGroupPhotoDataUrl(
  webglCanvas: HTMLCanvasElement,
  participantNames: readonly string[],
): string | null {
  const srcW = webglCanvas.width;
  const srcH = webglCanvas.height;
  if (!srcW || !srcH) return null;

  const padding = Math.round(Math.min(srcW, srcH) * 0.035);
  const footerH = Math.round(Math.max(120, srcH * 0.17));
  const outW = srcW + padding * 2;
  const outH = srcH + padding * 2 + footerH;

  const outCanvas = document.createElement('canvas');
  outCanvas.width = outW;
  outCanvas.height = outH;
  const ctx = outCanvas.getContext('2d');
  if (!ctx) return null;

  // Festive deep-navy Polaroid card background
  const bg = ctx.createLinearGradient(0, 0, outW, outH);
  bg.addColorStop(0, '#131d47');
  bg.addColorStop(1, '#090e26');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, outW, outH);

  // Subtle golden inner border
  ctx.strokeStyle = 'rgba(255, 213, 107, 0.45)';
  ctx.lineWidth = Math.max(3, Math.round(outW * 0.003));
  ctx.strokeRect(
    padding * 0.45,
    padding * 0.45,
    outW - padding * 0.9,
    outH - padding * 0.9,
  );

  // Draw the captured 3D WebGL scene
  ctx.drawImage(webglCanvas, padding, padding, srcW, srcH);

  // Festive caption in the footer
  const footerTop = padding + srcH;
  const centerX = outW / 2;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleSize = Math.round(Math.max(24, footerH * 0.3));
  ctx.font = `700 ${titleSize}px "Fredoka", "Nunito", system-ui, sans-serif`;
  ctx.fillStyle = '#ffd56b';
  ctx.fillText('Manita-Manito 3D — Group Photo ✨', centerX, footerTop + footerH * 0.35);

  const namesText = participantNames.join('  •  ');
  const namesSize = Math.round(Math.max(14, footerH * 0.165));
  ctx.font = `600 ${namesSize}px "Nunito", system-ui, sans-serif`;
  ctx.fillStyle = '#d8f3ff';
  const maxTextW = outW - padding * 3;
  ctx.fillText(namesText, centerX, footerTop + footerH * 0.66, maxTextW);

  const dateText = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dateSize = Math.round(Math.max(12, footerH * 0.125));
  ctx.font = `600 ${dateSize}px "Nunito", system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(168, 228, 255, 0.65)';
  ctx.fillText(dateText, centerX, footerTop + footerH * 0.87);

  return outCanvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
