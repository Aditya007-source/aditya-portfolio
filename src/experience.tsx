import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Discovery } from './data';

interface ExperienceState { motion: boolean; sound: boolean; discoveries: Discovery[]; toast: string; setMotion: (v: boolean) => void; setSound: (v: boolean) => void; discover: (id: Discovery) => void; reset: () => void; pulse: () => void; notify: (message: string) => void; play: () => void }
const Context = createContext<ExperienceState | null>(null);
export function useExperience() { const value = useContext(Context); if (!value) throw new Error('Missing experience provider'); return value; }
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [motion, setMotion] = useState(true);
  const [sound, setSound] = useState(false);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [toast, setToast] = useState('');
  const loaded = useRef(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const audio = useRef<AudioContext>();
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    try {
      const saved = JSON.parse(localStorage.getItem('signal-play:v1') || '{}');
      setMotion(!preference.matches && saved.motion !== false);
      setSound(saved.sound === true);
      if (Array.isArray(saved.discoveries)) setDiscoveries(saved.discoveries.filter((id: unknown) => ['pulse', 'spring', 'circuit'].includes(String(id))));
    } catch { setMotion(!preference.matches); }
    loaded.current = true;
    const change = () => { if (preference.matches) setMotion(false); };
    preference.addEventListener('change', change);
    return () => { preference.removeEventListener('change', change); clearTimeout(toastTimer.current); void audio.current?.close(); };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off';
    if (loaded.current) try { localStorage.setItem('signal-play:v1', JSON.stringify({ motion, sound, discoveries })); } catch { /* device-local fallback */ }
  }, [motion, sound, discoveries]);
  const notify = (message: string) => { clearTimeout(toastTimer.current); setToast(message); toastTimer.current = setTimeout(() => setToast(''), 4000); };
  const play = () => {
    if (!sound) return;
    try {
      audio.current ??= new AudioContext();
      void audio.current.resume();
      const oscillator = audio.current.createOscillator(); const gain = audio.current.createGain();
      oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(420, audio.current.currentTime); oscillator.frequency.exponentialRampToValueAtTime(210, audio.current.currentTime + .18);
      gain.gain.setValueAtTime(.035, audio.current.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.current.currentTime + .2);
      oscillator.connect(gain); gain.connect(audio.current.destination); oscillator.start(); oscillator.stop(audio.current.currentTime + .21);
    } catch { /* optional audio */ }
  };
  const discover = (id: Discovery) => {
    if (!discoveries.includes(id)) { setDiscoveries(v => v.includes(id) ? v : [...v, id]); notify(({ pulse: 'First contact. Signal discovered.', spring: 'Good vibrations. Spring discovered.', circuit: 'Connection complete. Circuit discovered.' })[id]); }
    play();
  };
  const pulse = () => { window.dispatchEvent(new Event('signal-pulse')); discover('pulse'); };
  const reset = () => { setDiscoveries([]); notify('A clean slate. Explore again.'); };
  return <Context.Provider value={{ motion, sound, discoveries, toast, setMotion, setSound, discover, reset, pulse, notify, play }}>{children}<div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast}</div></Context.Provider>;
}
