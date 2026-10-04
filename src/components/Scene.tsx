import { useRef, type ReactNode } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { useExperience } from '../experience';
export default function Scene({ children, className }: { children: ReactNode; className?: string }) {
  const target = useRef<HTMLDivElement>(null);
  const { motion } = useExperience();
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'center center'] });
  const y = useTransform(scrollYProgress, [0, 1], [65, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [7, 0]);
  return <m.div ref={target} className={`scroll-scene ${className || ''}`} style={motion ? { y, rotateX, transformPerspective: 1800 } : undefined}>{children}</m.div>;
}
