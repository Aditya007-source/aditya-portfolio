import { lazy, Suspense, useRef, useState } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { profile } from '../data';
import { useExperience } from '../experience';
import SignalCanvas from '../components/SignalCanvas';
import { Plus, Spark } from '../components/Chrome';
import SelectedWork from '../components/SelectedWork';
import PersonalStory from '../components/PersonalStory';
const Playground = lazy(() => import('../components/Playground'));

function WorkPortal() {
  const target = useRef<HTMLDivElement>(null);
  const { motion } = useExperience();
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-18, 24]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -60]);
  return <div className="work-intro" ref={target}><div><span className="eyebrow">01 / SELECTED WORK & POSSIBILITIES</span><h2>Curiosity,<br />put to work<span className="orange-text">.</span></h2></div><m.div className="portal-symbol" style={motion ? { rotate, y } : undefined} aria-hidden="true"><Spark /><span className="mono">IDEA → EXPERIMENT → EXPERIENCE</span></m.div></div>;
}

function Contact() {
  const { notify, play } = useExperience();
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [draftReady, setDraftReady] = useState(false);
  const draft = () => {
    const content = `Hello ${profile.name},\n\n${message}\n\nFrom: ${name}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'lets-make-something.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setDraftReady(true); notify('Draft saved locally. Nothing has been sent.'); play();
  };
  const copy = async () => { try { await navigator.clipboard.writeText(profile.email!); notify('Email address copied.'); } catch { notify('Could not copy. Select the email address instead.'); } };
  return <section className="contact-section" id="contact"><div className="contact-top"><span className="eyebrow">04 / THE NEXT GOOD THING</span><span className="mono">LET’S CONNECT THE DOTS</span></div><div className="contact-layout"><div><h2>Have a<br />wild idea<span>?</span></h2><p>{profile.availability}</p>{profile.email ? <a className="pill-button dark" href={`mailto:${profile.email}`}>Make a connection <Plus /></a> : <button className="pill-button dark" onClick={() => window.dispatchEvent(new Event('open-terminal'))}>Make a connection <Plus /></button>}<div className="contact-links">{profile.email ? <><a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={copy}>Copy email</button></> : <p className="contact-note">Contact details are coming soon.<br />For now, write a note and keep it as a local draft.</p>}{profile.phone && <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a>}{profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}{profile.resume && <a href={profile.resume}>Résumé</a>}</div></div><form className="contact-draft" onSubmit={e => { e.preventDefault(); draft(); }}><span className="mono">GOOD THINGS START WITH A CONVERSATION.</span><label htmlFor="contact-name">Your name</label><input id="contact-name" value={name} onChange={e => setName(e.target.value)} required maxLength={100} placeholder="A fellow curious human" autoComplete="name" /><label htmlFor="contact-message">What are you thinking?</label><textarea id="contact-message" value={message} onChange={e => { setMessage(e.target.value); setDraftReady(false); }} required minLength={5} maxLength={3000} rows={4} placeholder="What if we built something…" /><button className="draft-button" type="submit">{draftReady ? 'Save another draft' : 'Save a local draft'}<Plus /></button><span className="draft-note">Downloads a text file. Nothing is submitted or sent.</span></form></div><div className="contact-signoff" aria-hidden="true">GOOD CODE.<span>GOOD COMPANY.</span><Spark /></div></section>;
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
