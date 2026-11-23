// Frequency table (Hz) for cozy Christmas music-box arrangement
const NOTE: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  C3: 130.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  D3: 146.83,
  E3: 164.81,
};

interface MelodyEvent {
  melody?: keyof typeof NOTE;
  harmony?: keyof typeof NOTE;
  bass?: keyof typeof NOTE;
  beats: number;
}

// Cozy festive medley: Jingle Bells chorus + We Wish You a Merry Christmas phrase
const CHRISTMAS_MELODY: MelodyEvent[] = [
  // Jingle Bells chorus
  { melody: 'E5', harmony: 'C5', bass: 'C3', beats: 1 },
  { melody: 'E5', beats: 1 },
  { melody: 'E5', harmony: 'G4', beats: 2 },
  { melody: 'E5', harmony: 'C5', bass: 'C3', beats: 1 },
  { melody: 'E5', beats: 1 },
  { melody: 'E5', harmony: 'G4', beats: 2 },
  { melody: 'E5', harmony: 'C5', bass: 'C3', beats: 1 },
  { melody: 'G5', beats: 1 },
  { melody: 'C5', harmony: 'E4', beats: 1.5 },
  { melody: 'D5', beats: 0.5 },
  { melody: 'E5', harmony: 'C5', bass: 'C3', beats: 4 },

  { melody: 'F5', harmony: 'A4', bass: 'F3', beats: 1 },
  { melody: 'F5', beats: 1 },
  { melody: 'F5', harmony: 'C5', beats: 1.5 },
  { melody: 'F5', beats: 0.5 },
  { melody: 'F5', harmony: 'C5', bass: 'C3', beats: 1 },
  { melody: 'E5', beats: 1 },
  { melody: 'E5', harmony: 'G4', beats: 1 },
  { melody: 'E5', beats: 0.5 },
  { melody: 'E5', beats: 0.5 },
  { melody: 'E5', harmony: 'G4', bass: 'G3', beats: 1 },
  { melody: 'D5', beats: 1 },
  { melody: 'D5', harmony: 'B4', beats: 1 },
  { melody: 'E5', beats: 1 },
  { melody: 'D5', harmony: 'G4', bass: 'G3', beats: 2 },
  { melody: 'G5', harmony: 'B4', beats: 2 },

  // Second half of Jingle Bells
  { melody: 'E5', harmony: 'C5', bass: 'C3', beats: 1 },
  { melody: 'E5', beats: 1 },
  { melody: 'E5', harmony: 'G4', beats: 2 },
  { melody: 'E5', harmony: 'C5', bass: 'C3', beats: 1 },
  { melody: 'E5', beats: 1 },
  { melody: 'E5', harmony: 'G4', beats: 2 },
  { melody: 'E5', harmony: 'C5', bass: 'C3', beats: 1 },
  { melody: 'G5', beats: 1 },
  { melody: 'C5', harmony: 'E4', beats: 1.5 },
  { melody: 'D5', beats: 0.5 },
  { melody: 'E5', harmony: 'C5', bass: 'C3', beats: 4 },

  { melody: 'F5', harmony: 'A4', bass: 'F3', beats: 1 },
  { melody: 'F5', beats: 1 },
  { melody: 'F5', harmony: 'C5', beats: 1.5 },
  { melody: 'F5', beats: 0.5 },
  { melody: 'F5', harmony: 'C5', bass: 'C3', beats: 1 },
  { melody: 'E5', beats: 1 },
  { melody: 'E5', harmony: 'G4', beats: 1 },
  { melody: 'E5', beats: 0.5 },
  { melody: 'E5', beats: 0.5 },
  { melody: 'G5', harmony: 'B4', bass: 'G3', beats: 1 },
  { melody: 'G5', beats: 1 },
  { melody: 'F5', harmony: 'B4', beats: 1 },
  { melody: 'D5', beats: 1 },
  { melody: 'C5', harmony: 'E4', bass: 'C3', beats: 4 },

  // Gentle music-box bridge: We Wish You a Merry Christmas
  { melody: 'G4', bass: 'C3', beats: 1 },
  { melody: 'C5', harmony: 'E4', bass: 'C3', beats: 1 },
  { melody: 'C5', beats: 0.5 },
  { melody: 'D5', beats: 0.5 },
  { melody: 'C5', beats: 0.5 },
  { melody: 'B4', beats: 0.5 },
  { melody: 'A4', harmony: 'F4', bass: 'F3', beats: 1 },
  { melody: 'A4', beats: 1 },
  { melody: 'A4', beats: 1 },
  { melody: 'D5', harmony: 'F4', bass: 'D3', beats: 1 },
  { melody: 'D5', beats: 0.5 },
  { melody: 'E5', beats: 0.5 },
  { melody: 'D5', beats: 0.5 },
  { melody: 'C5', beats: 0.5 },
  { melody: 'B4', harmony: 'G4', bass: 'G3', beats: 1 },
  { melody: 'G4', beats: 1 },
  { melody: 'G4', beats: 1 },
  { melody: 'E5', harmony: 'G4', bass: 'E3', beats: 1 },
  { melody: 'E5', beats: 0.5 },
  { melody: 'F5', beats: 0.5 },
  { melody: 'E5', beats: 0.5 },
  { melody: 'D5', beats: 0.5 },
  { melody: 'C5', harmony: 'E4', bass: 'A3', beats: 1 },
  { melody: 'A4', beats: 1 },
  { melody: 'G4', beats: 0.5 },
  { melody: 'G4', beats: 0.5 },
  { melody: 'A4', harmony: 'F4', bass: 'F3', beats: 1 },
  { melody: 'D5', harmony: 'G4', bass: 'G3', beats: 1 },
  { melody: 'B4', harmony: 'G4', beats: 1 },
  { melody: 'C5', harmony: 'E4', bass: 'C3', beats: 3 },
];

class FestiveSoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private stepIndex = 0;
  private isMusicPlaying = false;

  public enabled = true;
  public musicEnabled = true;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private ensureMusicBus(ctx: AudioContext): GainNode {
    if (!this.musicGain) {
      this.musicGain = ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.32, ctx.currentTime);
      this.musicGain.connect(ctx.destination);
    }
    return this.musicGain;
  }

  private playMusicBoxVoice(
    ctx: AudioContext,
    dest: AudioNode,
    freq: number,
    durationSec: number,
    peakGain: number,
    type: OscillatorType = 'triangle',
  ): void {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const shimmer = ctx.createOscillator();
    const gain = ctx.createGain();
    const shimmerGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Subtle bell overtone one octave higher for celesta/music-box sparkle
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec);

    shimmerGain.gain.setValueAtTime(0.0001, now);
    shimmerGain.gain.linearRampToValueAtTime(peakGain * 0.22, now + 0.01);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0004, now + durationSec * 0.6);

    osc.connect(gain);
    shimmer.connect(shimmerGain);
    gain.connect(dest);
    shimmerGain.connect(dest);

    osc.start(now);
    shimmer.start(now);
    osc.stop(now + durationSec + 0.04);
    shimmer.stop(now + durationSec + 0.04);
  }

  private scheduleNextMusicNote = (): void => {
    if (!this.isMusicPlaying || !this.musicEnabled) return;

    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== 'running') {
      this.musicTimer = window.setTimeout(this.scheduleNextMusicNote, 400);
      return;
    }

    const bus = this.ensureMusicBus(ctx);
    const beatMs = 340; // ~176 eighth-note / ~88 gentle cozy tempo
    const event = CHRISTMAS_MELODY[this.stepIndex % CHRISTMAS_MELODY.length];
    const durSec = Math.max(0.28, (event.beats * beatMs) / 1000 * 1.15);

    if (event.melody) {
      this.playMusicBoxVoice(ctx, bus, NOTE[event.melody], durSec, 0.14, 'triangle');
    }
    if (event.harmony) {
      this.playMusicBoxVoice(ctx, bus, NOTE[event.harmony], durSec * 1.1, 0.065, 'sine');
    }
    if (event.bass) {
      this.playMusicBoxVoice(ctx, bus, NOTE[event.bass], durSec * 1.35, 0.09, 'sine');
    }

    this.stepIndex = (this.stepIndex + 1) % CHRISTMAS_MELODY.length;
    this.musicTimer = window.setTimeout(this.scheduleNextMusicNote, event.beats * beatMs);
  };

  public startMusic(): void {
    if (!this.musicEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    const bus = this.ensureMusicBus(ctx);
    bus.gain.cancelScheduledValues(ctx.currentTime);
    bus.gain.setTargetAtTime(0.32, ctx.currentTime, 0.15);

    this.scheduleNextMusicNote();
  }

  public stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.ctx && this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
    }
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public playTick(pitchMultiplier = 1): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520 * pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(760 * pitchMultiplier, now + 0.055);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.085);
  }

  public playFanfare(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const now = ctx.currentTime + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.48);
    });
  }

  public playChime(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(990, now + 0.16);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }
}

export const soundEngine = new FestiveSoundEngine();
