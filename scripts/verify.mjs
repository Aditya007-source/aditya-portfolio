import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const dom = new JSDOM('<!doctype html><html lang="en"><head><title>Portfolio test</title></head><body></body></html>', { url: 'http://127.0.0.1:4173/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'HTMLElement', 'HTMLDialogElement', 'HTMLCanvasElement', 'SVGElement', 'Element', 'Node', 'Event', 'CustomEvent', 'KeyboardEvent', 'MutationObserver', 'getComputedStyle', 'localStorage', 'navigator']) Object.defineProperty(globalThis, name, { value: name === 'getComputedStyle' ? dom.window.getComputedStyle.bind(dom.window) : dom.window[name], configurable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.CSS = { supports: () => false };
let reduced = false;
globalThis.matchMedia = dom.window.matchMedia = query => ({ matches: reduced && query.includes('prefers-reduced-motion'), media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
dom.window.HTMLCanvasElement.prototype.getContext = () => null;
dom.window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
dom.window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
dom.window.scrollTo = () => {};
const React = await import('react');
const { render, cleanup, fireEvent, screen, within, waitFor, act } = await import('@testing-library/react');
const { App } = await import('../.cache/ssr/entry-server.js');
const axe = (await import('axe-core')).default;
const errors = [];
const originalError = console.error;
console.error = (...args) => { const message = args.map(String).join(' '); if (!message.includes('not wrapped in act')) errors.push(message); };
const results = [];
async function check(name, action) { try { await action(); results.push({ name, status: 'passed' }); console.log(`PASS ${name}`); } catch (error) { results.push({ name, status: 'failed', error: error.message }); console.log(`FAIL ${name}: ${error.message}`); } }

await check('Prerendered homepage, real work, and preserved concept routes', async () => {
  for (const [slug, title] of [['', 'Aditya Mishra'], ['work/rag', 'RAG Intelligent PDF Reader'], ['work/anpr', 'ANPR'], ['work/experiments', 'Web &amp; AI Experiments'], ['work/orbit', 'Orbit'], ['work/prism', 'Prism'], ['work/portfolio', 'Signal / Play']]) {
    const html = await readFile(`dist/${slug ? slug + '/' : ''}index.html`, 'utf8');
    assert(html.includes('<h1')); assert(html.includes(title)); assert(!html.includes('<!--app-html-->')); assert(!html.includes('The server did not finish'));
  }
});
await check('Local assets exist and no remote fonts or media are required', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets|fonts)\/[^\"]+)"/g)) await stat(`dist${match[1]}`);
  const css = await readFile('dist/fonts/fonts.css', 'utf8'); assert(!css.includes('https://')); assert(css.includes('/fonts/'));
  for (const name of ['inter', 'space-grotesk', 'ibm-plex-mono']) assert((await readFile(`dist/fonts/${name}-OFL.txt`, 'utf8')).includes('OPEN FONT LICENSE'));
});
await check('Initial compressed JavaScript stays below 200 KB', async () => {
  const files = await readdir('dist/assets'); const main = files.find(f => /^index-.*\.js$/.test(f)); const bytes = gzipSync(await readFile(`dist/assets/${main}`)).length; assert(bytes < 200000); results.push({ metric: 'initial JavaScript gzip bytes', value: bytes });
});

render(React.createElement(App, { path: '/' }));
await waitFor(() => assert(screen.getByRole('tab', { name: /Signal field/ })));
await check('Supplied RAG URL and real featured work replace homepage concepts', async () => {
  assert.equal(screen.getByRole('link', { name: /Open the live application/ }).getAttribute('href'), 'https://aditya-rag-online.streamlit.app/');
  assert.equal(screen.queryAllByText('CONCEPT PROJECT').length, 0);
  assert(screen.getAllByRole('link', { name: /Explore ANPR and Traffic Monitoring/ }).length > 0);
  assert(screen.getAllByRole('link', { name: /Explore Web and AI Experiments/ }).length > 0);
});
await check('Personal identity, contact links, education, and interests are published accurately', async () => {
  assert(screen.getByText('Aditya Mishra'));
  assert(screen.getByText('AI ENGINEER & FULL-STACK DEVELOPER'));
  assert(screen.getByText('M.Sc. Industrial AI'));
  assert(screen.getByText('CGPA: 9.22 / 10'));
  assert(screen.getByText('Boxing')); assert(screen.getByText('Fitness'));
  assert.equal(screen.getByRole('link', { name: 'GitHub' }).getAttribute('href'), 'https://github.com/Aditya007-source');
  assert.equal(screen.getByRole('link', { name: '+49 1745977418' }).getAttribute('href'), 'tel:+491745977418');
  assert.equal(screen.getByRole('link', { name: 'adityamishra3917@gmail.com' }).getAttribute('href'), 'mailto:adityamishra3917@gmail.com');
  assert.equal(screen.queryAllByRole('link', { name: 'LinkedIn' }).length, 0);
});
await check('Pulse discovery is collected once and saved locally', async () => {
  const button = screen.getByRole('button', { name: /GIVE IT A PULSE/ }); fireEvent.click(button); fireEvent.click(button);
  await waitFor(() => assert.equal(JSON.parse(localStorage.getItem('signal-play:v1')).discoveries.filter(v => v === 'pulse').length, 1));
});
await check('Keyboard-operable tabs and circuit connection', async () => {
  const first = screen.getByRole('tab', { name: /Signal field/ }); fireEvent.keyDown(first, { key: 'End' });
  assert.equal(screen.getByRole('tab', { name: /Circuit puzzle/ }).getAttribute('aria-selected'), 'true');
  for (let i = 1; i <= 4; i++) for (let j = 0; j < 2; j++) fireEvent.click(screen.getByRole('button', { name: new RegExp(`Rotate circuit tile ${i},`) }));
  assert(screen.getByText('CONNECTED. NICE WORK.')); assert(JSON.parse(localStorage.getItem('signal-play:v1')).discoveries.includes('circuit'));
  fireEvent.click(screen.getByRole('button', { name: /Reset circuit/ })); assert(screen.getByText('FOUR CORNERS. ONE CONNECTION.'));
});
await check('Spring controls award a discovery and update stiffness', async () => {
  fireEvent.click(screen.getByRole('tab', { name: /Spring physics/ }));
  fireEvent.change(screen.getByRole('slider', { name: /Stiffness/ }), { target: { value: '170' } });
  assert(screen.getByText('170')); assert(JSON.parse(localStorage.getItem('signal-play:v1')).discoveries.includes('spring'));
});
await check('Navigation settings toggle motion and show all discoveries', async () => {
  fireEvent.click(screen.getByRole('button', { name: /Open navigation and settings/ }));
  const dialog = screen.getByRole('dialog'); fireEvent.click(within(dialog).getByRole('button', { name: /^Motion/ }));
  assert.equal(document.documentElement.dataset.motion, 'off');
  fireEvent.click(within(dialog).getByRole('button', { name: /Behind the build/ }));
  assert.equal(within(dialog).getAllByText('✓').length, 3);
  fireEvent.click(within(dialog).getByRole('button', { name: /Reset discoveries/ }));
  assert.equal(JSON.parse(localStorage.getItem('signal-play:v1')).discoveries.length, 0);
  fireEvent.click(within(dialog).getByRole('button', { name: /Close dialog/ }));
});
await check('Terminal keyboard shortcut, help, and unknown command feedback', async () => {
  fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
  const dialog = screen.getByRole('dialog'); fireEvent.click(within(dialog).getByRole('button', { name: 'help' })); assert(within(dialog).getByText(/selected projects/));
  fireEvent.change(screen.getByRole('textbox', { name: '$' }), { target: { value: 'unknown' } }); fireEvent.click(within(dialog).getByRole('button', { name: 'Run' }));
  assert(within(dialog).getByText(/Unknown command: unknown/)); fireEvent.click(within(dialog).getByRole('button', { name: /Close dialog/ }));
});
await check('Homepage accessibility structure has no axe violations', async () => {
  const report = await axe.run(document, { rules: { 'color-contrast': { enabled: false } } });
  assert.deepEqual(report.violations.map(v => `${v.id}: ${v.description}`), []);
});
cleanup();
await check('System reduced motion is respected', async () => {
  localStorage.clear(); reduced = true; render(React.createElement(App, { path: '/' }));
  await waitFor(() => assert.equal(document.documentElement.dataset.motion, 'off')); cleanup(); reduced = false;
});
await check('Orbit preview tasks actually toggle', async () => {
  render(React.createElement(App, { path: '/work/orbit/' })); const task = screen.getByRole('button', { name: /Make something tangible/ });
  fireEvent.click(task); assert.equal(task.getAttribute('aria-pressed'), 'true'); assert(screen.getByText('2 / 3 complete')); fireEvent.click(task); assert.equal(task.getAttribute('aria-pressed'), 'false'); cleanup();
});
await check('Prism preview chart changes with the selected time range', async () => {
  render(React.createElement(App, { path: '/work/prism/' })); fireEvent.click(screen.getByRole('button', { name: '30 days' })); assert(screen.getByRole('img', { name: /Illustrative trend over 30 days/ })); cleanup();
});
await check('Retrieval preview advances locally without fabricating an API request', async () => {
  render(React.createElement(App, { path: '/work/rag/' })); fireEvent.click(screen.getByRole('button', { name: /Next step/ })); assert(screen.getByText('Retrieve relevant source material.')); cleanup();
});
await check('ANPR uses a labeled simulation and supports advancing frames', async () => {
  render(React.createElement(App, { path: '/work/anpr/' }));
  assert(screen.getByText('SIMULATED FRAME'));
  fireEvent.click(screen.getByRole('button', { name: /Next frame/ }));
  assert(screen.getByRole('img', { name: /Simulated traffic frame 2/ }));
  assert.equal(screen.queryAllByRole('link', { name: /Open live application/ }).length, 0);
  cleanup();
});
await check('Real work pages use personal titles and route-specific descriptions', async () => {
  for (const slug of ['rag', 'anpr', 'experiments', 'portfolio']) {
    const html = await readFile(`dist/work/${slug}/index.html`, 'utf8');
    assert(html.includes('— Aditya Mishra</title>')); assert(!html.includes('[Your Email]')); assert(!html.includes('[GitHub Profile]'));
    if (slug === 'anpr') assert(html.includes('traffic analysis system')); if (slug === 'rag') assert(html.includes('upload PDFs'));
  }
});
await check('Unknown routes have a usable recovery link', async () => { render(React.createElement(App, { path: '/missing' })); assert(screen.getByRole('link', { name: /Back to the beginning/ })); cleanup(); });
await check('Contact posts complete messages to the configured email service', async () => {
  render(React.createElement(App, { path: '/' }));
  const form = screen.getByRole('form', { name: 'Send Aditya a message' });
  assert.equal(form.getAttribute('action'), 'https://formsubmit.co/adityamishra3917@gmail.com');
  assert.equal(form.method, 'post');
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Test visitor' } });
  fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'visitor@example.com' } });
  fireEvent.change(screen.getByLabelText('What are you thinking?'), { target: { value: 'What if we built a better knowledge tool?' } });
  assert(form.checkValidity());
  const fields = new dom.window.FormData(form);
  assert.equal(fields.get('name'), 'Test visitor');
  assert.equal(fields.get('email'), 'visitor@example.com');
  assert.equal(fields.get('message'), 'What if we built a better knowledge tool?');
  assert.equal(fields.get('_subject'), 'New message from Aditya\u2019s portfolio');
  assert.equal(fields.get('_template'), 'table');
  assert.equal(fields.get('_honey'), '');
  assert.equal(fields.get('_captcha'), null);
  assert.equal(screen.queryAllByRole('button', { name: /draft/i }).length, 0);
  assert(screen.getByRole('button', { name: 'Send message' }));
  cleanup();
});
await check('Contact requires a valid reply email and works in prerendered HTML', async () => {
  render(React.createElement(App, { path: '/' }));
  const email = screen.getByLabelText('Your email');
  assert.equal(email.required, true); assert.equal(email.checkValidity(), false);
  fireEvent.change(email, { target: { value: 'not-an-email' } }); assert.equal(email.checkValidity(), false);
  fireEvent.change(email, { target: { value: 'visitor@example.com' } }); assert.equal(email.checkValidity(), true);
  cleanup();
  const html = await readFile('dist/index.html', 'utf8');
  const staticPage = new JSDOM(html);
  const form = staticPage.window.document.querySelector('form.contact-form');
  assert.equal(form.method, 'post'); assert.equal(form.action, 'https://formsubmit.co/adityamishra3917@gmail.com');
  assert(form.querySelector('input[name="email"][required]'));
  assert.equal(form.querySelector('input[name="_honey"]').style.display, 'none');
  staticPage.window.close();
});
await check('Unavailable local storage does not prevent interaction', async () => {
  const originalGet = dom.window.Storage.prototype.getItem; const originalSet = dom.window.Storage.prototype.setItem;
  dom.window.Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
  dom.window.Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
  render(React.createElement(App, { path: '/' })); fireEvent.click(screen.getByRole('button', { name: /GIVE IT A PULSE/ })); assert(screen.getByText('1 / 3 DISCOVERIES')); cleanup();
  dom.window.Storage.prototype.getItem = originalGet; dom.window.Storage.prototype.setItem = originalSet;
});
await check('Canvas geometry produces finite coordinates and pauses in hidden tabs', async () => {
  const originalContext = dom.window.HTMLCanvasElement.prototype.getContext;
  const originalBounds = dom.window.HTMLElement.prototype.getBoundingClientRect;
  let strokes = 0, coordinates = 0;
  const point = (...values) => { for (const value of values) assert(Number.isFinite(value)); coordinates++; };
  const context = { clearRect() {}, setTransform() {}, beginPath() {}, moveTo: point, lineTo: point, arc: point, stroke() { strokes++; }, fill() {}, createLinearGradient() { return { addColorStop() {} }; } };
  dom.window.HTMLCanvasElement.prototype.getContext = () => context;
  dom.window.HTMLElement.prototype.getBoundingClientRect = function () { return this.classList.contains('signal-canvas') ? { x: 0, y: 0, top: 0, left: 0, right: 720, bottom: 620, width: 720, height: 620, toJSON() {} } : originalBounds.call(this); };
  reduced = true; render(React.createElement(App, { path: '/' }));
  await waitFor(() => assert(strokes >= 100)); assert(coordinates > 6000);
  Object.defineProperty(document, 'hidden', { value: true, configurable: true });
  const before = strokes; await act(async () => { window.dispatchEvent(new Event('signal-pulse')); await new Promise(resolve => setTimeout(resolve, 40)); }); assert.equal(strokes, before);
  delete document.hidden; cleanup(); reduced = false;
  dom.window.HTMLCanvasElement.prototype.getContext = originalContext; dom.window.HTMLElement.prototype.getBoundingClientRect = originalBounds;
});
await check('No React errors occurred in component checks', async () => { assert.deepEqual(errors, []); });
console.error = originalError;
await mkdir('.cache', { recursive: true });
await writeFile('.cache/verification.json', JSON.stringify({ date: new Date().toISOString(), checks: results, limitations: ['DOM simulation checks do not validate visual layout, browser-native focus trapping, touch gesture behavior, Canvas appearance, or color contrast.', 'Browser automation could not run because Windows sandbox restrictions crash Chromium. No further browser launches are attempted.'] }, null, 2));
const failures = results.filter(r => r.status === 'failed'); console.log(`\n${results.filter(r => r.status === 'passed').length} passed; ${failures.length} failed.`);
dom.window.close();
process.exit(failures.length ? 1 : 0);
