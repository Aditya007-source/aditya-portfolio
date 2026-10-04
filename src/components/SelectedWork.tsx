import type { ReactNode } from 'react';
import { projects } from '../data';
import Scene from './Scene';
import { Plus } from './Chrome';
import { PrismArt, RetrievalArt, TrafficArt } from './ProjectArt';

export default function SelectedWork({ intro }: { intro: ReactNode }) {
  const rag = projects.find(project => project.slug === 'rag')!;
  return <section id="work" className="work-section" aria-labelledby="work-heading">
    {intro}<h2 id="work-heading" className="sr-only">Selected work</h2>
    <Scene><article className="featured-project">
      <div className="project-meta"><span className="mono">01 / RAG PDF READER</span><span className="project-badge">LIVE PROJECT</span><span className="mono">YOUR DOCUMENTS, IN CONVERSATION</span></div>
      <div className="featured-body"><div className="featured-copy">
        <span className="eyebrow">RAG INTELLIGENT PDF READER</span><h3>Your PDFs.<br />Better answers.</h3>
        <p>Upload a document. Ask a question.<br />Get an AI-powered answer informed<br />by the content that matters.</p>
        <div className="project-tags"><span>Python</span><span>LangChain</span><span>FAISS</span><span>Gemini API</span></div>
        <a className="pill-button dark" href="/work/rag/">Explore the PDF reader <Plus /></a>
        <a className="live-project-link" href={rag.live} target="_blank" rel="noreferrer">Open the live application <span className="live-dot" aria-hidden="true" /></a>
      </div><RetrievalArt /></div>
      <div className="project-bottom"><span>THE QUESTION IS ONLY HALF THE STORY.</span><span className="mono">DOCUMENTS / EMBEDDINGS / RETRIEVAL</span></div>
    </article></Scene>
    <Scene className="concept-grid">
      <article className="concept-project lavender"><div className="project-meta"><span className="mono">02 / ANPR & TRAFFIC</span><span className="project-badge">COMPUTER VISION</span></div>
        <a className="concept-art-link" href="/work/anpr/" aria-label="Explore ANPR and Traffic Monitoring"><TrafficArt /></a>
        <div className="concept-bottom"><div><h3>See. Track. Understand.</h3><span>YOLO / OPENCV / OCR / VEHICLE TRACKING</span></div><a className="circle-button" href="/work/anpr/" aria-label="Explore ANPR and Traffic Monitoring"><Plus /></a></div>
      </article>
      <article className="concept-project lime"><div className="project-meta"><span className="mono">03 / WEB & AI</span><span className="project-badge">ONGOING EXPLORATION</span></div>
        <a className="concept-art-link" href="/work/experiments/" aria-label="Explore Web and AI Experiments"><PrismArt /></a>
        <div className="concept-bottom"><div><h3>Keep asking “what if?”</h3><span>WEB INTERFACES / AI / AUTOMATION</span></div><a className="circle-button" href="/work/experiments/" aria-label="Explore Web and AI Experiments"><Plus /></a></div>
      </article>
    </Scene>
    <div className="portfolio-link"><span className="mono">PROJECT 04 / YOU’RE ALREADY IN IT.</span><a href="/work/portfolio/">This website is part of the work.<Plus /></a></div>
  </section>;
}
