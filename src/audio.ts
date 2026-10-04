export type SoundCue = 'enable' | 'tap' | 'pulse' | 'spring' | 'success';
import { createSoundtrack } from './soundtrack';

const notes: Record<SoundCue, number[]> = {
  enable: [440, 660, 880], tap: [620], pulse: [320, 160],
  spring: [220, 440, 330], success: [523.25, 659.25, 783.99, 1046.5],
};

// Original cues and an on-demand ambient score. No downloaded audio assets.
export class InteractionAudio {
  private context?: AudioContext;
  private output?: GainNode;
  private enabled = false;
  private lastCue = -Infinity;
  private musicOutput?: GainNode;
  private musicBuffer?: AudioBuffer;
  private musicSource?: AudioBufferSourceNode;

  setEnabled(value: boolean) {
    this.enabled = value;
    if (!value && this.context && this.output) {
      this.output.gain.cancelScheduledValues(this.context.currentTime);
      this.output.gain.setTargetAtTime(0, this.context.currentTime, .01);
      this.stopMusic();
    }
  }

  async play(cue: SoundCue = 'tap'): Promise<boolean> {
    if (!this.enabled || document.hidden) return true;
    try {
      const Audio = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Audio) return false;
      if (!this.context || this.context.state === 'closed') {
        this.context = new Audio();
        this.output = this.context.createGain();
        this.output.connect(this.context.destination);
      }
      const context = this.context;
      // Called directly from a gesture; wait for resume before scheduling notes.
      if (context.state !== 'running') await context.resume();
      if (!this.enabled || document.hidden) return true;
      if (context.state !== 'running') return false;
      this.startMusic(context);
      const now = context.currentTime;
      if (now - this.lastCue < .075 && cue !== 'enable') return true;
      this.lastCue = now;
      this.output!.gain.cancelScheduledValues(now);
      this.output!.gain.setValueAtTime(.16, now);
      notes[cue].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const start = now + index * .065;
        const duration = cue === 'tap' ? .09 : .22;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        if (cue === 'pulse' || cue === 'spring') oscillator.frequency.exponentialRampToValueAtTime(frequency * .65, start + duration);
        envelope.gain.setValueAtTime(.0001, start);
        envelope.gain.exponentialRampToValueAtTime(.55, start + .012);
        envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
        oscillator.connect(envelope); envelope.connect(this.output!);
        oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
        oscillator.start(start); oscillator.stop(start + duration + .02);
      });
      return true;
    } catch { return false; }
  }

  suspend() { if (this.context?.state === 'running') void this.context.suspend().catch(() => {}); }
  async resumeMusic(): Promise<void> {
    if (this.enabled && this.musicSource && this.context?.state === 'suspended' && !document.hidden) {
      try { await this.context.resume(); } catch { /* next gesture can retry */ }
    }
  }
  private startMusic(context: AudioContext) {
    if (this.musicSource) return;
    this.musicBuffer ??= createSoundtrack(context);
    this.musicOutput ??= context.createGain();
    this.musicOutput.disconnect(); this.musicOutput.connect(context.destination);
    this.musicOutput.gain.cancelScheduledValues(context.currentTime);
    this.musicOutput.gain.setValueAtTime(0, context.currentTime);
    this.musicOutput.gain.linearRampToValueAtTime(.4, context.currentTime + 1.2);
    const source = context.createBufferSource();
    source.buffer = this.musicBuffer; source.loop = true;
    source.connect(this.musicOutput);
    source.onended = () => source.disconnect();
    source.start(); this.musicSource = source;
  }
  private stopMusic() {
    if (!this.musicSource || !this.context || !this.musicOutput) return;
    const now = this.context.currentTime;
    this.musicOutput.gain.cancelScheduledValues(now);
    this.musicOutput.gain.setTargetAtTime(0, now, .055);
    this.musicSource.stop(now + .25); this.musicSource = undefined;
  }
  dispose() {
    this.setEnabled(false);
    if (this.context && this.context.state !== 'closed') void this.context.close().catch(() => {});
    this.context = undefined; this.output = undefined; this.musicOutput = undefined; this.musicBuffer = undefined;
  }
}
