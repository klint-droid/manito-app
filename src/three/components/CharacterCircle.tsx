import { useMemo } from 'react';
import { FantasyCharacter } from './FantasyCharacter';
import type { Participant } from '../../types/participant';
import type { CharacterAnimationState } from '../../types/character';
import type { DrawPhase } from '../../types/assignment';

export interface CircleSlot {
  x: number;
  z: number;
  angle: number;
  facingRotationY: number;
}

export function computeCircleRadius(participantCount: number): number {
  if (participantCount <= 4) return 3.7;
  if (participantCount <= 8) return 4.4;
  if (participantCount <= 12) return 5.2;
  return Math.min(8.4, 4.2 + participantCount * 0.18);
}

/**
 * Computes exact circular coordinates:
 * angle = (2 * Math.PI * index) / participantCount
 * x = centerX + radius * Math.cos(angle)
 * z = centerZ + radius * Math.sin(angle)
 */
export function computeCircularSlot(
  index: number,
  participantCount: number,
  radius: number,
  centerX = 0,
  centerZ = 0,
): CircleSlot {
  const safeCount = Math.max(1, participantCount);
  const angle = (2 * Math.PI * index) / safeCount;
  const x = centerX + radius * Math.cos(angle);
  const z = centerZ + radius * Math.sin(angle);
  // Face inward toward (centerX, centerZ)
  const facingRotationY = Math.atan2(centerX - x, centerZ - z);
  return { x, z, angle, facingRotationY };
}

/**
 * Computes staggered tiered rows at the center stage for the final group photo,
 * facing forward (+Z) toward the photo camera so every character is clearly visible.
 */
export function computeGroupPhotoSlot(
  index: number,
  totalCount: number,
): { position: [number, number, number]; rotationY: number } {
  const maxPerRow = totalCount <= 5 ? totalCount : totalCount <= 10 ? 5 : 6;
  const row = Math.floor(index / maxPerRow);
  const totalRows = Math.ceil(totalCount / maxPerRow);
  const rowStart = row * maxPerRow;
  const countInRow = Math.min(maxPerRow, totalCount - rowStart);
  const col = index - rowStart;

  const spacingX = 1.28;
  const centerOffset = (countInRow - 1) / 2;
  const x = (col - centerOffset) * spacingX;

  // Front row stands closest to the camera; back rows step back & slightly curve in
  const rowDepthOffset = row - (totalRows - 1) / 2;
  const curveZ = Math.abs(col - centerOffset) * 0.14;
  const z = 0.65 - rowDepthOffset * 1.22 - curveZ;

  // Center pedestal height (y = 0.34) for inner characters, slight step up for back rows so faces stay clear
  const distFromCenter = Math.hypot(x, z);
  const baseY = distFromCenter <= 2.05 ? 0.34 : 0.1;
  const y = baseY + row * 0.14;

  // Face slightly inward toward the front camera at [0, y, +Z]
  const rotationY = -x * 0.08;
  return { position: [x, y, z], rotationY };
}

interface CharacterCircleProps {
  participants: Participant[];
  circleRadius: number;
  phase: DrawPhase;
  currentGiverId: string | null;
  highlightedId: string | null;
  activeRecipientId: string | null;
  assignedRecipientIds: Set<string>;
  completedGiverIds: Set<string>;
  isMobile?: boolean;
  onCharacterClick?: (participant: Participant) => void;
}

export function CharacterCircle({
  participants,
  circleRadius,
  phase,
  currentGiverId,
  highlightedId,
  activeRecipientId,
  assignedRecipientIds,
  completedGiverIds,
  isMobile = false,
  onCharacterClick,
}: CharacterCircleProps) {
  const slots = useMemo(() => {
    return participants.map((p, index) => ({
      participant: p,
      slot: computeCircularSlot(index, participants.length, circleRadius, 0, 0),
    }));
  }, [participants, circleRadius]);

  const baseScale = isMobile ? 0.86 : 1;

  return (
    <group>
      {slots.map(({ participant, slot }, index) => {
        const isCurrentGiver = participant.id === currentGiverId;
        const isActiveRecipient =
          participant.id === activeRecipientId &&
          (phase === 'recipient_approaching' || phase === 'revealed');
        const isHighlighted = participant.id === highlightedId && phase === 'selecting';
        const isAlreadyReceived = assignedRecipientIds.has(participant.id) && !isActiveRecipient;
        const isCompletedGiver = completedGiverIds.has(participant.id) && !isCurrentGiver;

        // Default circular position on the snowy ring
        let targetPosition: [number, number, number] = [slot.x, 0.1, slot.z];
        let targetRotationY = slot.facingRotationY;
        let animState: CharacterAnimationState = 'idle';
        let labelBadge: 'giver' | 'recipient' | 'selected' | 'done' | null = null;
        let highlightIntensity = 0;

        if (isCurrentGiver) {
          labelBadge = 'giver';
          highlightIntensity = 0.85;
          if (phase === 'giver_focus') {
            animState = 'celebrate';
          } else if (phase === 'giver_entering' || phase === 'selecting') {
            targetPosition = [0, 0.34, 0];
            targetRotationY = 0;
            animState = 'giver_center';
          } else if (phase === 'recipient_approaching' || phase === 'revealed') {
            // Step slightly left on the center stage to make room beside them for the recipient
            targetPosition = [-0.95, 0.34, -0.15];
            targetRotationY = 0.32;
            animState = phase === 'revealed' ? 'celebrate' : 'giver_center';
          }
        } else if (isActiveRecipient) {
          labelBadge = 'recipient';
          highlightIntensity = 1;
          targetPosition = [0.95, 0.34, -0.15];
          targetRotationY = -0.32;
          animState = phase === 'revealed' ? 'recipient_reveal' : 'highlighted';
        } else if (isHighlighted) {
          labelBadge = 'selected';
          highlightIntensity = 1;
          animState = 'highlighted';
        } else if (phase === 'selecting') {
          if (isAlreadyReceived) {
            animState = 'assigned_muted';
            labelBadge = 'done';
          } else {
            animState = 'bounce';
          }
        } else if (phase === 'completed') {
          const photoSlot = computeGroupPhotoSlot(index, participants.length);
          targetPosition = photoSlot.position;
          targetRotationY = photoSlot.rotationY;
          animState = 'celebrate';
          labelBadge = null;
          highlightIntensity = 0.45;
        } else if (isAlreadyReceived && isCompletedGiver) {
          animState = 'assigned_muted';
          labelBadge = 'done';
        }

        return (
          <FantasyCharacter
            key={participant.id}
            variantId={participant.characterId}
            name={participant.name}
            targetPosition={targetPosition}
            targetRotationY={targetRotationY}
            animationState={animState}
            phaseOffset={index * 0.95}
            scale={baseScale}
            showLabel
            labelBadge={labelBadge}
            highlightIntensity={highlightIntensity}
            onClick={onCharacterClick ? () => onCharacterClick(participant) : undefined}
          />
        );
      })}
    </group>
  );
}
