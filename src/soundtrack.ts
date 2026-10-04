// "Signal Drift": an original seamless ambient composition, generated once
// on demand. A minor -> F -> C -> G, 72 BPM, soft pads and a slow glassy melody.
// Mono 22.05 kHz keeps the reusable 26.7-second loop under 2.4 MB in memory.
export function createSoundtrack(context: AudioContext): AudioBuffer {
  const rate = 22050;
  const beat = 60 / 72;
  const bar = beat * 8;
  const buffer = context.createBuffer(1, Math.round(bar * 4 * rate), rate);
  const samples = buffer.getChannelData(0);
  const chords = [[110, 130.8128, 164.8138], [87.3071, 110, 130.8128], [130.8128, 164.8138, 195.9977], [97.9989, 123.4708, 146.8324]];
  const melody = [0, 2, 1, 2, 0, 1, 2, 1];
  const tone = (start: number, duration: number, frequency: number, level: number, pad: boolean) => {
    const offset = Math.round(start * rate);
    for (let i = 0; i < Math.round(duration * rate); i++) {
      const t = i / rate;
      const attack = Math.min(1, t / (pad ? .8 : .025));
      const release = pad ? Math.min(1, (duration - t) / 1.2) : Math.exp(-t * 3);
      const phase = 2 * Math.PI * frequency * t;
      const wave = Math.sin(phase) + (pad ? .12 : .22) * Math.sin(phase * 2);
      samples[(offset + i) % samples.length] += wave * level * attack * release;
    }
  };
  chords.forEach((chord, section) => {
    chord.forEach(frequency => tone(section * bar, bar + 1.2, frequency, .04, true));
    for (let step = 0; step < 8; step++) {
      tone(section * bar + step * beat, 2.4, chord[melody[step]] * 4, .055, false);
      if (step % 4 === 0) tone(section * bar + step * beat, 2, chord[0] / 2, .025, false);
    }
  });
  const dry = samples.slice();
  const echo = Math.round(beat * .75 * rate);
  for (let i = 0; i < samples.length; i++) {
    samples[i] += .18 * dry[(i - echo + samples.length) % samples.length] + .08 * dry[(i - echo * 2 + samples.length) % samples.length];
  }
  return buffer;
}
