import { useEffect, useRef, useState } from 'react';
import { profile } from '../data';
import { useExperience } from '../experience';

export function Spark({ className = '' }: { className?: string }) { return <svg className={className} viewBox="0 0 60 60" fill="none" aria-hidden="true"><path d="M30 0v60M0 30h60M9 9l42 42M9 51 51 9" stroke="currentColor" strokeWidth="7" /></svg>; }
export function Plus() { return <span aria-hidden="true" className="plus">+</span>; }
function SoundToggle({ text = false }: { text?: boolean }) {
  const { sound, setSound } = useExperience();
  return <button className={text ? 'footer-sound' : 'sound-toggle'} onClick={() => setSound(!sound)} aria-pressed={sound} aria-label={`Turn sound ${sound ? 'off' : 'on'}`} title={`Sound ${sound ? 'on' : 'off'}`}>
    {text ? `Sound ${sound ? 'on' : 'off'}` : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" />{sound ? <><path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14" /></> : <path d="m17 9 5 6m0-6-5 6" />}</svg>}
  </button>;
}
export function Header({ home }: { home: boolean }) {
  const { motion, sound, setMotion, setSound, discoveries, reset, play } = useExperience();
  const [panel, setPanel] = useState<'menu' | 'build' | 'terminal' | null>(null);
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('Connection ready. Type help to see available commands.');
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = (next: 'menu' | 'build' | 'terminal') => { opener.current = document.activeElement as HTMLElement; setPanel(next); play('tap'); };
  const close = () => { dialog.current?.close(); setPanel(null); opener.current?.focus(); };
  useEffect(() => { if (panel) { dialog.current?.showModal(); if (panel === 'terminal') input.current?.focus(); } }, [panel]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); opener.current = document.activeElement as HTMLElement; setPanel('terminal'); }
    };
    const build = () => open('build'); const terminal = () => open('terminal');
    window.addEventListener('keydown', handler); window.addEventListener('open-build', build); window.addEventListener('open-terminal', terminal);
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener('open-build', build); window.removeEventListener('open-terminal', terminal); };
  }, []);
  const href = (id: string) => `${home ? '' : '/'}#${id}`;
  const run = (value: string) => {
    const cmd = value.trim().toLowerCase(); setCommand(''); play('tap');
    if (cmd === 'help') setResponse('work → selected projects · lab → experiments · contact → connection panel · clear → clear terminal');
    else if (['work', 'lab', 'contact'].includes(cmd)) { close(); window.location.assign(href(cmd)); }
    else if (cmd === 'clear') setResponse('');
    else setResponse(`Unknown command: ${value.slice(0, 60)}. Try help, work, lab, or contact.`);
  };
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="/" aria-label={`${profile.name}, home`}><Spark /><span>{profile.shortName}<span className="brand-dot">.</span></span></a>
      <nav aria-label="Main navigation" className="desktop-nav"><a href={href('work')}>The work <span>01</span></a><a href={href('lab')}>The playground <span>02</span></a><a href={href('about')}>The human <span>03</span></a></nav>
      <div className="header-actions"><SoundToggle /><a className="contact-link" href={href('contact')}>Let’s talk <Plus /></a><button className="menu-button" onClick={() => open('menu')} aria-label="Open navigation and settings"><span /><span /></button></div>
    </header>
    <dialog ref={dialog} className={`site-dialog ${panel === 'terminal' ? 'terminal-dialog' : ''}`} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === dialog.current) close(); }} aria-labelledby="dialog-title">
      <div className="dialog-top"><span className="eyebrow">SIGNAL / PLAY</span><button className="icon-button" onClick={close} aria-label="Close dialog">×</button></div>
      {panel === 'menu' && <><h2 id="dialog-title">Pick your path.</h2><nav className="panel-nav" aria-label="Expanded navigation">{[['work', 'The work'], ['lab', 'The playground'], ['about', 'The human'], ['contact', 'Let’s connect']].map(([id, label], i) => <a key={id} href={href(id)} onClick={close}><span>0{i + 1}</span>{label}<Plus /></a>)}</nav><div className="settings"><button onClick={() => setMotion(!motion)} aria-pressed={motion}>Motion <span>{motion ? 'ON' : 'OFF'}</span></button><button onClick={() => setSound(!sound)} aria-pressed={sound}>Sound <span>{sound ? 'ON' : 'OFF'}</span></button><button onClick={() => setPanel('terminal')}>Command terminal <kbd>Ctrl K</kbd></button><button onClick={() => setPanel('build')}>Behind the build <span>{discoveries.length}/3</span></button></div></>}
      {panel === 'build' && <><h2 id="dialog-title">A peek under<br />the hood.</h2><p>This site is a working sample of creative development. Every shape in the signal is drawn live. Every experiment responds to you.</p><div className="build-details"><div><span>01 / THE SIGNAL</span><p>A projected torus drawn in Canvas. Pointer input changes its orientation; pulses deform its geometry.</p></div><div><span>02 / THE MOTION</span><p>Native scrolling, spring interpolation, and transforms. Rendering pauses when the artwork rests or leaves the screen.</p></div><div><span>03 / THE FOUNDATION</span><p>React, TypeScript, Motion, and Vite. Prerendered project pages, local fonts, keyboard controls, and a reduced-motion alternative.</p></div></div><div className="discovery-list">{[['pulse', 'First contact'], ['spring', 'Good vibrations'], ['circuit', 'Connection complete']].map(([id, label]) => <div key={id}><span>{discoveries.includes(id as 'pulse') ? '✓' : '○'}</span>{label}</div>)}</div><button className="text-button" onClick={reset}>Reset discoveries</button></>}
      {panel === 'terminal' && <><h2 id="dialog-title">Make a connection.</h2><div className="terminal-output" role="status">{response}</div><form onSubmit={e => { e.preventDefault(); run(command); }}><label htmlFor="terminal-input" className="mono">$</label><input id="terminal-input" ref={input} value={command} onChange={e => setCommand(e.target.value)} placeholder="Enter a command" autoComplete="off" spellCheck={false} maxLength={100} /><button type="submit">Run</button></form><div className="terminal-presets">{['help', 'work', 'lab', 'contact'].map(cmd => <button key={cmd} onClick={() => run(cmd)}>{cmd}</button>)}</div></>}
    </dialog>
  </>;
}
export function Footer() { const { motion, setMotion } = useExperience(); return <footer className="site-footer"><a className="brand" href="/"><Spark /><span>{profile.shortName}.</span></a><span className="mono">A little logic. A lot of magic.</span><div><SoundToggle text /><button onClick={() => setMotion(!motion)} aria-pressed={motion}>Motion {motion ? 'on' : 'off'}</button><button onClick={() => window.dispatchEvent(new Event('open-build'))}>Behind the build</button><span>© {new Date().getFullYear()}</span></div></footer>; }
