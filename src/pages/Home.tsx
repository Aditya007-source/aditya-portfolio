import { lazy, Suspense, useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { profile } from '../data';
import { useExperience } from '../experience';
import SignalCanvas from '../components/SignalCanvas';
import { Plus, Spark } from '../components/Chrome';
import SelectedWork from '../components/SelectedWork';
import PersonalStory from '../components/PersonalStory';
import Contact from '../components/Contact';
const Playground = lazy(() => import('../components/Playground'));

function WorkPortal() {
  const target = useRef<HTMLDivElement>(null);
  const { motion } = useExperience();
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-18, 24]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -60]);
  return <div className="work-intro" ref={target}><div><span className="eyebrow">01 / SELECTED WORK & POSSIBILITIES</span><h2>Curiosity,<br />put to work<span className="orange-text">.</span></h2></div><m.div className="portal-symbol" style={motion ? { rotate, y } : undefined} aria-hidden="true"><Spark /><span className="mono">IDEA → EXPERIMENT → EXPERIENCE</span></m.div></div>;
}

export default function Home() {
  const { pulse, discoveries } = useExperience();
  return <main id="main">
    <section className="hero" aria-labelledby="hero-title"><div className="hero-topline"><span className="eyebrow">{profile.role.toUpperCase()}</span><span className="mono">EST. IN CURIOSITY / BUILT WITH CARE</span></div><div className="hero-art"><SignalCanvas /><span className="sculpture-label mono">FIG. 001<br />THOUGHTS, IN MOTION</span><div className="hero-art-caption"><span className="crosshair" aria-hidden="true">+</span><span className="mono">A SMALL INPUT.<br />A NEW PERSPECTIVE.</span></div></div><div className="hero-content"><h1 id="hero-title">A little<br />logic.<br />A lot of<br /><span className="hero-magic">magic<span className="orange-text">.</span></span></h1><div className="hero-copy"><p>Hi, I’m <strong>{profile.name}</strong>.<br />I build intelligent products<br className="desktop-break" /> with people at the center.</p><a className="pill-button light" href="#work">Explore the work <Plus /></a></div></div><button className="pulse-button" onClick={pulse}><span aria-hidden="true">✳</span><span>GIVE IT A PULSE</span></button><div className="hero-bottom"><span className="mono">SCROLL TO EXPLORE</span><span className="scroll-mark" aria-hidden="true" /><span className="mono">NO TWO IDEAS MOVE THE SAME WAY.</span></div></section>
    <SelectedWork intro={<WorkPortal />} />
    <section className="lab-section" id="lab" aria-labelledby="lab-title"><div className="lab-intro"><div><span className="eyebrow">02 / SERIOUSLY, PLAY A LITTLE</span><h2 id="lab-title">Less looking.<br />More <span>doing.</span></h2></div><div className="lab-intro-copy"><p>Some ideas make more sense<br />when you get your hands on them.<br />Go ahead. Break the ice.</p><span className="discovery-counter mono"><span aria-hidden="true">✳</span> {discoveries.length} / 3 DISCOVERIES</span></div></div><Suspense fallback={<div className="lab-loading"><h3>Your playground is getting ready.</h3><p>Signal fields, spring physics, and a circuit to connect.</p></div>}><Playground /></Suspense><div className="lab-footnote"><span className="mono">NO SCORES. NO PRESSURE. JUST POSSIBILITIES.</span><button onClick={() => window.dispatchEvent(new Event('open-build'))}>{discoveries.length === 3 ? 'All discoveries found. Peek under the hood.' : 'Curious how it works?'}<Plus /></button></div></section>
    <PersonalStory />
    <Contact />
  </main>;
}
