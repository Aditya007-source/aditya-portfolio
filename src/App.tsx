import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import { ExperienceProvider, useExperience } from './experience';
import { Header, Footer } from './components/Chrome';
import Home from './pages/Home';
import ProjectPage from './pages/Project';
import { projects } from './data';

function Site({ path }: { path: string }) {
  const { motion } = useExperience();
  const slug = path.match(/^\/work\/([^/]+)\/?$/)?.[1];
  const project = projects.find(p => p.slug === slug);
  const home = path === '/' || path === '/index.html';
  return <MotionConfig reducedMotion={motion ? 'user' : 'always'}><LazyMotion features={domAnimation} strict><Header home={home} />{home ? <Home /> : project ? <ProjectPage project={project} /> : <main id="main" className="not-found"><span className="eyebrow">404 / A LITTLE OFF COURSE</span><h1>Let’s find<br />the signal.</h1><a className="pill-button light" href="/">Back to the beginning</a></main>}<Footer /></LazyMotion></MotionConfig>;
}
export default function App({ path = '/' }: { path?: string }) { return <ExperienceProvider><Site path={path} /></ExperienceProvider>; }
