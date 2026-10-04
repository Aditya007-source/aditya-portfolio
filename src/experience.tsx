import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Discovery } from './data';
import { InteractionAudio, type SoundCue } from './audio';

interface ExperienceState { motion: boolean; sound: boolean; discoveries: Discovery[]; toast: string; setMotion: (v: boolean) => void; setSound: (v: boolean) => void; discover: (id: Discovery) => void; reset: () => void; pulse: () => void; notify: (message: string) => void; play: (cue?: SoundCue) => void }
const Context = createContext<ExperienceState | null>(null);
export function useExperience() { const value = useContext(Context); if (!value) throw new Error('Missing experience provider'); return value; }
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [motion, setMotion] = useState(true);
  const [sound, updateSound] = useState(false);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [toast, setToast] = useState('');
  const loaded = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const audio = useRef(new InteractionAudio());
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    try {
      const saved = JSON.parse(localStorage.getItem('signal-play:v1') || '{}');
      setMotion(!preference.matches && saved.motion !== false);
      updateSound(saved.sound === true);
      audio.current.setEnabled(saved.sound === true);
      if (Array.isArray(saved.discoveries)) setDiscoveries(saved.discoveries.filter((id: unknown) => ['pulse', 'spring', 'circuit'].includes(String(id))));
    } catch { setMotion(!preference.matches); }
    loaded.current = true;
    const change = () => { if (preference.matches) setMotion(false); };
    preference.addEventListener('change', change);
    const visibility = () => { if (document.hidden) audio.current.suspend(); else void audio.current.resumeMusic(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { preference.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility); clearTimeout(toastTimer.current); audio.current.dispose(); };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off';
    if (loaded.current) try { localStorage.setItem('signal-play:v1', JSON.stringify({ motion, sound, discoveries })); } catch { /* device-local fallback */ }
  }, [motion, sound, discoveries]);
  const notify = (message: string) => { clearTimeout(toastTimer.current); setToast(message); toastTimer.current = setTimeout(() => setToast(''), 4000); };
  const play = (cue: SoundCue = 'tap') => {
    void audio.current.play(cue).then(ok => {
      if (!ok) { audio.current.setEnabled(false); updateSound(false); notify('Audio is unavailable. Try enabling sound again in your browser.'); }
    });
  };
  const setSound = (value: boolean) => {
    audio.current.setEnabled(value); updateSound(value);
    if (value) { notify('Sound on. Signal Drift is playing.'); play('enable'); }
    else notify('Sound off.');
  };
  const discover = (id: Discovery) => {
    if (!discoveries.includes(id)) { setDiscoveries(v => v.includes(id) ? v : [...v, id]); notify(({ pulse: 'First contact. Signal discovered.', spring: 'Good vibrations. Spring discovered.', circuit: 'Connection complete. Circuit discovered.' })[id]); }
    play(id === 'circuit' ? 'success' : id);
  };
  const pulse = () => { window.dispatchEvent(new Event('signal-pulse')); discover('pulse'); };
  const reset = () => { setDiscoveries([]); notify('A clean slate. Explore again.'); };
  return <Context.Provider value={{ motion, sound, discoveries, toast, setMotion, setSound, discover, reset, pulse, notify, play }}>{children}<div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast}</div></Context.Provider>;
}
