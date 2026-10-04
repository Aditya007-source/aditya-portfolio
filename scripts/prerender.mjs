import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { render, profile, projects } from '../.cache/ssr/entry-server.js';
const template = await readFile('dist/index.html', 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const pages = [
  { path: '/', title: `${profile.name} — ${profile.role}`, description: `${profile.name} — ${profile.role}. RAG systems, computer vision, Generative AI, and intelligent web applications.` },
  ...projects.map(project => ({ path: `/work/${project.slug}/`, title: `${project.name} — ${profile.name}`, description: project.description })),
];
for (const { path, title, description } of pages) {
  const html = template.replace('<!--app-html-->', await render(path)).replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(description)}" />`);
  const directory = `dist${path === '/' ? '' : path}`; await mkdir(directory, { recursive: true }); await writeFile(`${directory}/index.html`, html); console.log(`Prerendered ${path}`);
}
await writeFile('dist/404.html', template.replace('<!--app-html-->', await render('/404')).replace(/<title>.*?<\/title>/, `<title>Page not found — ${escape(profile.name)}</title>`));
await import('./notices.mjs');
