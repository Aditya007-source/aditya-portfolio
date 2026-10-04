import { useEffect, useRef } from 'react';
import { useExperience } from '../experience';

export default function SignalCanvas({ field = false }: { field?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { motion } = useExperience();
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d');
    if (!context) return;
    const holder = element.parentElement!;
    holder.dataset.ready = 'true';
    let width = 0, height = 0, frame = 0, visible = true, lastInput = performance.now(), pulseAt = -10000;
    const start = performance.now();
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    const draw = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const active = motion && (now - lastInput < 4500 || now - pulseAt < 2400);
      pointer.sx += (pointer.x - pointer.sx) * .045; pointer.sy += (pointer.y - pointer.sy) * .045;
      context.clearRect(0, 0, width, height);
      const time = motion ? Math.min((now - start) / 1000, 6) : 1.5;
      const pulse = motion ? Math.max(0, 1 - (now - pulseAt) / 2200) : 0;
      if (field) {
        const spacing = width < 500 ? 26 : 23;
        for (let x = spacing; x < width; x += spacing) for (let y = spacing; y < height; y += spacing) {
          const dx = x - width * (.5 + pointer.sx * .35), dy = y - height * (.5 + pointer.sy * .35);
          const distance = Math.hypot(dx, dy);
          const wave = Math.sin(distance * .036 - time * 2 - pulse * 7) * (8 + pulse * 12) * Math.exp(-distance / 320);
          const angle = Math.atan2(dy, dx);
          context.fillStyle = distance < 110 ? '#ff6333' : distance < 220 ? '#b6a0ff' : '#64676b';
          context.beginPath(); context.arc(x + Math.cos(angle) * wave, y + Math.sin(angle) * wave, distance < 110 ? 2.1 : 1.2, 0, Math.PI * 2); context.fill();
        }
      } else {
        const scale = Math.min(width, height) * .177;
        const rotationX = 1.03 + pointer.sy * .32;
        const rotationY = -.28 + pointer.sx * .35 + Math.sin(time * .3) * .08;
        const rotationZ = -.45 + pointer.sx * .09;
        const count = width < 550 ? 64 : 100;
        const rings: { points: number[][]; depth: number; index: number }[] = [];
        for (let i = 0; i < count; i++) {
          const u = i / count * Math.PI * 2;
          const points: number[][] = [];
          for (let j = 0; j <= 64; j++) {
            const v = j / 64 * Math.PI * 2;
            const ripple = pulse * .16 * Math.sin(u * 5 - (now - pulseAt) * .006);
            const tube = .63 + .13 * Math.sin(u * 3 + time * .3) + ripple;
            const radius = 1.75 + tube * Math.cos(v);
            let x = radius * Math.cos(u), y = radius * Math.sin(u), z = tube * Math.sin(v) + .22 * Math.sin(u * 3);
            const yy = y * Math.cos(rotationX) - z * Math.sin(rotationX); z = y * Math.sin(rotationX) + z * Math.cos(rotationX); y = yy;
            const xx = x * Math.cos(rotationY) + z * Math.sin(rotationY); z = -x * Math.sin(rotationY) + z * Math.cos(rotationY); x = xx;
            const rx = x * Math.cos(rotationZ) - y * Math.sin(rotationZ); y = x * Math.sin(rotationZ) + y * Math.cos(rotationZ); x = rx;
            const perspective = 6.5 / (6.5 - z);
            points.push([width * .5 + x * scale * perspective, height * .5 + y * scale * perspective, z]);
          }
          rings.push({ points, depth: points.reduce((s, p) => s + p[2], 0) / points.length, index: i });
        }
        rings.sort((a, b) => a.depth - b.depth);
        for (const ring of rings) {
          const alpha = .25 + (ring.depth + 2.5) / 5 * .7;
          const highlight = ring.index > count * .1 && ring.index < count * .55;
          const gradient = context.createLinearGradient(width * .2, height * .2, width * .8, height * .8);
          gradient.addColorStop(0, highlight ? `rgba(255,186,132,${alpha})` : `rgba(212,215,211,${alpha})`);
          gradient.addColorStop(.5, highlight ? `rgba(255,99,51,${alpha})` : `rgba(149,153,152,${alpha})`);
          gradient.addColorStop(1, `rgba(255,99,51,${alpha * .6})`);
          context.strokeStyle = gradient; context.lineWidth = width < 550 ? 1 : 1.35;
          context.beginPath(); ring.points.forEach((p, i) => i ? context.lineTo(p[0], p[1]) : context.moveTo(p[0], p[1])); context.stroke();
        }
      }
      if (active) frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); };
    const resize = () => {
      const bounds = holder.getBoundingClientRect(); width = bounds.width; height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.25 : 1.5);
      element.width = Math.round(width * dpr); element.height = Math.round(height * dpr); context.setTransform(dpr, 0, 0, dpr, 0, 0); wake();
    };
    const move = (event: PointerEvent) => { const bounds = holder.getBoundingClientRect(); pointer.x = (event.clientX - bounds.left) / width * 2 - 1; pointer.y = (event.clientY - bounds.top) / height * 2 - 1; lastInput = performance.now(); wake(); };
    const leave = () => { pointer.x = 0; pointer.y = 0; lastInput = performance.now(); wake(); };
    const pulse = () => { pulseAt = performance.now(); lastInput = pulseAt; wake(); };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else wake(); };
    const observer = new ResizeObserver(resize); observer.observe(holder);
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; } }); intersection.observe(holder);
    holder.addEventListener('pointermove', move); holder.addEventListener('pointerleave', leave); window.addEventListener('signal-pulse', pulse); document.addEventListener('visibilitychange', visibility); resize();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); holder.removeEventListener('pointermove', move); holder.removeEventListener('pointerleave', leave); window.removeEventListener('signal-pulse', pulse); document.removeEventListener('visibilitychange', visibility); };
  }, [field, motion]);
  return <div className={`signal-canvas ${field ? 'field-canvas' : ''}`}>
    <svg className="signal-fallback" viewBox="0 0 600 600" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <ellipse key={i} cx="300" cy="300" rx={120 + i * 4} ry={65 + i * 3} fill="none" stroke={i % 3 ? '#ff6333' : '#b6a0ff'} strokeOpacity=".6" transform={`rotate(${i * 3 - 40} 300 300)`} />)}</svg>
    <canvas ref={canvas} aria-hidden="true" />
  </div>;
}
