import { useEffect, useRef, useState } from 'react';
import { experiments } from '../data';
import { useExperience } from '../experience';
import SignalCanvas from './SignalCanvas';

function Spring() {
  const { discover, motion } = useExperience();
  const [stiffness, setStiffness] = useState(110);
  const [value, setValue] = useState(0);
  const object = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const physics = useRef({ x: 0, target: 0, velocity: 0, dragging: false, frame: 0, prev: 0, origin: 0 });
  const stiffnessRef = useRef(stiffness); stiffnessRef.current = stiffness;
  const animate = (time: number) => {
    const p = physics.current; const dt = Math.min((time - (p.prev || time)) / 1000, .025); p.prev = time;
    if (!p.dragging) { const acceleration = -stiffnessRef.current * p.x - 8 * p.velocity; p.velocity += acceleration * dt; p.x += p.velocity * dt; } else p.x = p.target;
    if (object.current) object.current.style.transform = `translateX(${p.x}px) rotate(${p.x * .14}deg)`;
    if (Math.abs(p.x) > .15 || Math.abs(p.velocity) > .15 || p.dragging) p.frame = requestAnimationFrame(animate); else { p.frame = 0; p.prev = 0; }
  };
  const wake = () => { const p = physics.current; if (!p.frame && motion) p.frame = requestAnimationFrame(animate); else if (!motion) { p.x = p.target; if (object.current) object.current.style.transform = `translateX(${p.x}px)`; } };
  const pull = (x: number) => { const p = physics.current; p.target = x; p.dragging = true; wake(); };
  const release = () => { const p = physics.current; p.dragging = false; p.target = 0; if (!motion) { p.x = 0; if (object.current) object.current.style.transform = 'none'; } else wake(); setValue(0); discover('spring'); };
  useEffect(() => () => cancelAnimationFrame(physics.current.frame), []);
  useEffect(() => { if (!motion) { cancelAnimationFrame(physics.current.frame); physics.current.frame = 0; if (object.current) object.current.style.transform = 'none'; } }, [motion]);
  return <><div className="spring-area" ref={area}><span className="spring-axis" aria-hidden="true" /><div ref={object} className="spring-object" role="img" aria-label="Spring object"><span>PLAY</span><span>WITH</span><span>FEELING.</span></div><button className="spring-drag-target" aria-label="Pull and release the spring" onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); physics.current.origin = e.clientX; pull(0); }} onPointerMove={e => { if (physics.current.dragging) { const max = (area.current?.clientWidth || 300) * .3; pull(Math.max(-max, Math.min(max, e.clientX - physics.current.origin))); } }} onPointerUp={release} onPointerCancel={release} onClick={e => { if (e.detail === 0) { physics.current.x = 110; physics.current.velocity = 0; release(); } }}><span className="sr-only">Pull and release the spring</span></button><span className="spring-hint mono">DRAG & RELEASE / OR USE THE CONTROLS</span></div><div className="experiment-controls spring-controls"><label>Stiffness <input type="range" min="40" max="240" value={stiffness} onChange={e => { setStiffness(Number(e.target.value)); discover('spring'); }} /><span className="mono">{stiffness}</span></label><label>Pull <input aria-label="Spring pull" type="range" min="-110" max="110" value={value} onChange={e => { setValue(Number(e.target.value)); pull(Number(e.target.value)); }} onPointerUp={release} onKeyUp={e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) release(); }} /></label><button className="pill-button small" onClick={() => { physics.current.x = 100; physics.current.velocity = 0; release(); }}>Give it a bounce <span aria-hidden="true">✳</span></button></div></>;
}

function Circuit() {
  const { discover } = useExperience();
  const [rotations, setRotations] = useState([3, 0, 2, 1]);
  const targets = [1, 2, 0, 3]; // top-left east/south; top-right south/west; bottom-left north/east; bottom-right west/north
  const solved = rotations.every((r, i) => r === targets[i]);
  const rotate = (i: number) => { const next = rotations.map((v, index) => index === i ? (v + 1) % 4 : v); setRotations(next); if (next.every((r, index) => r === targets[index])) discover('circuit'); };
  return <><div className={`circuit-area ${solved ? 'solved' : ''}`}><div className="circuit-grid">{rotations.map((rotation, i) => <button key={i} className="circuit-tile" onClick={() => rotate(i)} aria-label={`Rotate circuit tile ${i + 1}, currently ${['north and east', 'east and south', 'south and west', 'west and north'][rotation]}`}><svg viewBox="0 0 100 100" aria-hidden="true" style={{ transform: `rotate(${rotation * 90}deg)` }}><path d="M50 0v30q0 20 20 20h30" fill="none" stroke="currentColor" strokeWidth="8" /><circle cx="50" cy="24" r="3" fill="#101112" /></svg><span className="mono">0{i + 1}</span></button>)}</div><div className="circuit-status" role="status">{solved ? 'CONNECTED. NICE WORK.' : 'FOUR CORNERS. ONE CONNECTION.'}</div></div><div className="experiment-controls"><p>Tap a tile to rotate it. Make a closed square.</p><button className="pill-button small" onClick={() => setRotations([3, 0, 2, 1])}>Reset circuit <span aria-hidden="true">↻</span></button></div></>;
}

export default function Playground() {
  const [active, setActive] = useState(0);
  const { pulse } = useExperience();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="playground-panel"><div className="lab-tabs" role="tablist" aria-label="Choose an experiment">{experiments.map((experiment, i) => <button key={experiment.id} id={`tab-${experiment.id}`} role="tab" aria-selected={active === i} aria-controls={`panel-${experiment.id}`} tabIndex={active === i ? 0 : -1} ref={el => { tabs.current[i] = el; }} onClick={() => setActive(i)} onKeyDown={e => { let next = active; if (e.key === 'ArrowRight') next = (active + 1) % 3; else if (e.key === 'ArrowLeft') next = (active + 2) % 3; else if (e.key === 'Home') next = 0; else if (e.key === 'End') next = 2; else return; e.preventDefault(); setActive(next); tabs.current[next]?.focus(); }}><span className="mono">0{i + 1}</span>{['Signal field', 'Spring physics', 'Circuit puzzle'][i]}<span className="tab-dot" /></button>)}</div><div role="tabpanel" id={`panel-${experiments[active].id}`} aria-labelledby={`tab-${experiments[active].id}`} tabIndex={0}><div className="experiment-heading"><h3>{experiments[active].title}</h3><p>{experiments[active].description}</p></div>{active === 0 && <><div className="signal-field"><SignalCanvas field /><span className="field-label mono">INPUT → ENERGY → RESPONSE</span></div><div className="experiment-controls"><p>Move your pointer. See what follows.</p><button className="pill-button small" onClick={pulse}>Send a pulse <span aria-hidden="true">✳</span></button></div></>}{active === 1 && <Spring />}{active === 2 && <Circuit />}</div></div>;
}
