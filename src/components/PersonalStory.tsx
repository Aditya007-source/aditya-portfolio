import { profile } from '../data';
import { Plus, Spark } from './Chrome';

const capabilities = [
  { title: 'Intelligence, made practical.', text: 'RAG systems, Generative AI, and intelligent automation. Connecting document processing, semantic retrieval, and language models to real questions.', tools: ['Python', 'LangChain', 'FAISS', 'Gemini API'] },
  { title: 'Vision, put to work.', text: 'Computer vision and deep learning for number plate recognition, vehicle tracking, traffic analysis, and real-time video processing.', tools: ['YOLO', 'OpenCV', 'OCR', 'Deep learning'] },
  { title: 'Interfaces, built for people.', text: 'Responsive, reusable web components and modern interfaces, with a focus on performance, usability, and clear interaction.', tools: ['Full-stack development', 'Frontend development', 'Reusable components'] },
];
export default function PersonalStory() {
  return <section className="about-section" id="about" aria-labelledby="about-title">
    <div className="about-intro"><span className="eyebrow">03 / THE HUMAN BEHIND THE PIXELS</span><Spark /><span className="mono">CURIOUS BY DEFAULT.</span></div>
    <div className="about-layout"><div>
      <h2 id="about-title">Equal parts<br />head & <span>heart.</span></h2>
      <p className="about-statement">{profile.statement}</p>
      <p className="about-aside">I’m drawn to AI engineering, computer vision, RAG systems, and data-driven applications. Outside the editor, I’m usually training, exploring, or learning something new.</p>
      <div className="personal-interests"><span className="mono">BEYOND THE CODE</span><div>{profile.interests.map(interest => <span key={interest}>{interest}</span>)}</div></div>
    </div><div className="process-list">{capabilities.map((capability, index) => <details key={capability.title} open={index === 0}>
      <summary><span className="mono">0{index + 1}</span><h3>{capability.title}</h3><Plus /></summary><p>{capability.text}</p><div className="process-tags">{capability.tools.map(tool => <span key={tool}>{tool}</span>)}</div>
    </details>)}</div></div>
    <div className="personal-background" aria-label="Education and professional background">{profile.education.map((education, index) => <article key={education.qualification}>
      <span className="eyebrow">{index === 0 ? 'LEARNING / RIGHT NOW' : 'FOUNDATION / ENGINEERING'}</span><h3>{education.qualification}</h3><p>{education.institution}</p><span className="education-detail">{education.detail}</span>
    </article>)}<article><span className="eyebrow">PRACTICE / SOFTWARE ENGINEERING</span><h3>Ideas into applications.</h3><p>{profile.experience}</p><span className="education-detail">AI / COMPUTER VISION / GENERATIVE AI / WEB</span></article></div>
    <div className="about-bottom"><span className="mono">THE STACK IS A TOOL. THE EXPERIENCE IS THE POINT.</span><a href="/work/portfolio/">Read the build story <Plus /></a></div>
  </section>;
}
