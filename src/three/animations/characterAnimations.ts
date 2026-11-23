import type { CharacterAnimationState } from '../../types/character';

export interface CharacterMotionSample {
  posY: number;
  rotYOffset: number;
  rotZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  leftArmZ: number;
  rightArmZ: number;
  leftLegX: number;
  rightLegX: number;
  headNodX: number;
  blinkScaleY: number;
}

/**
 * Computes playful Fall Guys-inspired procedural motion for a character
 * based on elapsed time, unique phase offset, and current animation state.
 */
export function sampleCharacterMotion(
  elapsed: number,
  phaseOffset: number,
  state: CharacterAnimationState,
): CharacterMotionSample {
  const t = elapsed + phaseOffset;

  // Periodic natural eye blink every ~3.8 seconds
  const blinkCycle = (elapsed + phaseOffset * 1.37) % 3.8;
  const blinkScaleY =
    blinkCycle > 3.64 && blinkCycle < 3.76
      ? Math.max(0.08, Math.abs(Math.cos(((blinkCycle - 3.64) / 0.12) * Math.PI)))
      : 1;

  if (state === 'celebrate' || state === 'recipient_reveal') {
    const hopFreq = 7.2;
    const hopWave = Math.abs(Math.sin(t * hopFreq));
    const stretch = 1 + hopWave * 0.12;
    const squash = 1 / Math.sqrt(stretch);
    return {
      posY: hopWave * 0.48,
      rotYOffset: Math.sin(t * 3.6) * 0.28,
      rotZ: Math.sin(t * hopFreq) * 0.12,
      scaleX: squash,
      scaleY: stretch,
      scaleZ: squash,
      leftArmZ: 1.15 + Math.sin(t * 14) * 0.35,
      rightArmZ: -1.15 - Math.sin(t * 14) * 0.35,
      leftLegX: Math.sin(t * 12) * 0.45,
      rightLegX: -Math.sin(t * 12) * 0.45,
      headNodX: Math.sin(t * 7.2) * 0.08,
      blinkScaleY,
    };
  }

  if (state === 'highlighted') {
    const jump = Math.abs(Math.sin(t * 9.5));
    return {
      posY: 0.16 + jump * 0.32,
      rotYOffset: Math.sin(t * 6) * 0.16,
      rotZ: Math.sin(t * 9.5) * 0.09,
      scaleX: 1.08 - jump * 0.05,
      scaleY: 1.06 + jump * 0.14,
      scaleZ: 1.08 - jump * 0.05,
      leftArmZ: 0.95 + Math.sin(t * 16) * 0.25,
      rightArmZ: -0.95 - Math.sin(t * 16) * 0.25,
      leftLegX: Math.sin(t * 14) * 0.35,
      rightLegX: -Math.sin(t * 14) * 0.35,
      headNodX: -0.06,
      blinkScaleY,
    };
  }

  if (state === 'giver_center') {
    const wave = Math.sin(t * 3.2);
    const bounce = Math.abs(Math.sin(t * 2.6)) * 0.1;
    return {
      posY: bounce,
      rotYOffset: Math.sin(t * 1.4) * 0.18,
      rotZ: wave * 0.05,
      scaleX: 1.03 - bounce * 0.15,
      scaleY: 1.03 + bounce * 0.25,
      scaleZ: 1.03 - bounce * 0.15,
      leftArmZ: 0.4 + Math.sin(t * 4.5) * 0.25,
      rightArmZ: -0.85 - Math.sin(t * 6.5) * 0.35,
      leftLegX: Math.sin(t * 3.2) * 0.1,
      rightLegX: -Math.sin(t * 3.2) * 0.1,
      headNodX: Math.sin(t * 2.6) * 0.05,
      blinkScaleY,
    };
  }

  if (state === 'bounce') {
    const hop = Math.abs(Math.sin(t * 5.6));
    return {
      posY: hop * 0.22,
      rotYOffset: Math.sin(t * 2.8) * 0.1,
      rotZ: Math.sin(t * 5.6) * 0.07,
      scaleX: 1 - hop * 0.04,
      scaleY: 1 + hop * 0.08,
      scaleZ: 1 - hop * 0.04,
      leftArmZ: 0.45 + Math.sin(t * 8.5) * 0.28,
      rightArmZ: -0.45 - Math.sin(t * 8.5) * 0.28,
      leftLegX: Math.sin(t * 7.5) * 0.2,
      rightLegX: -Math.sin(t * 7.5) * 0.2,
      headNodX: Math.sin(t * 5.6) * 0.04,
      blinkScaleY,
    };
  }

  if (state === 'assigned_muted') {
    const breath = Math.sin(t * 1.8);
    return {
      posY: Math.max(0, breath * 0.025),
      rotYOffset: 0,
      rotZ: breath * 0.015,
      scaleX: 0.96,
      scaleY: 0.96 + breath * 0.015,
      scaleZ: 0.96,
      leftArmZ: 0.18,
      rightArmZ: -0.18,
      leftLegX: 0,
      rightLegX: 0,
      headNodX: 0.03,
      blinkScaleY,
    };
  }

  // Default playful idle animation
  const sway = Math.sin(t * 2.1);
  const bob = (Math.sin(t * 4.2) + 1) * 0.5;
  return {
    posY: bob * 0.06,
    rotYOffset: Math.sin(t * 1.1) * 0.08,
    rotZ: sway * 0.045,
    scaleX: 1 - bob * 0.02,
    scaleY: 1 + bob * 0.035,
    scaleZ: 1 - bob * 0.02,
    leftArmZ: 0.28 + Math.sin(t * 3.1) * 0.14,
    rightArmZ: -0.28 - Math.sin(t * 3.1) * 0.14,
    leftLegX: Math.sin(t * 2.1) * 0.06,
    rightLegX: -Math.sin(t * 2.1) * 0.06,
    headNodX: Math.sin(t * 2.1) * 0.03,
    blinkScaleY,
  };
}
