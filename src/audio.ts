export type SoundCue = 'enable' | 'tap' | 'pulse' | 'spring' | 'success';

const notes: Record<SoundCue, number[]> = {
  enable: [440, 660, 880], tap: [620], pulse: [320, 160],
  spring: [220, 440, 330], success: [523.25, 659.25, 783.99, 1046.5],
};

// Original, short synthesized cues. No downloaded audio or background playback.
export class InteractionAudio {
  private context?: AudioContext;
  private output?: GainNode;
  private enabled = false;
  private lastCue = -Infinity;

  setEnabled(value: boolean) {
    this.enabled = value;
    if (!value && this.context && this.output) {
      this.output.gain.cancelScheduledValues(this.context.currentTime);
      this.output.gain.setTargetAtTime(0, this.context.currentTime, .01);
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
  dispose() {
    this.setEnabled(false);
    if (this.context && this.context.state !== 'closed') void this.context.close().catch(() => {});
    this.context = undefined; this.output = undefined;
  }
}
