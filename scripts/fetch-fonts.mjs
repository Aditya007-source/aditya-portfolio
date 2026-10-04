import https from 'node:https';
import { mkdir, writeFile } from 'node:fs/promises';
const fetch = (url, headers = {}) => new Promise((resolve, reject) => { const req = https.get(url, { headers }, res => { if (res.statusCode !== 200) return reject(new Error(`${res.statusCode}: ${url}`)); const chunks = []; res.on('data', c => chunks.push(c)); res.on('end', () => resolve(Buffer.concat(chunks))); }); req.on('error', reject); req.setTimeout(15000, () => req.destroy(new Error('Timeout'))); });
await mkdir('public/fonts', { recursive: true });
const families = [['Space Grotesk', 'space-grotesk', 'Space+Grotesk:wght@400;500;600;700', 'spacegrotesk'], ['Inter', 'inter', 'Inter:wght@400;500;600;700', 'inter'], ['IBM Plex Mono', 'ibm-plex-mono', 'IBM+Plex+Mono:wght@400', 'ibmplexmono']];
let css = '';
for (const [name, filename, query, licenseDir] of families) {
  const stylesheet = (await fetch(`https://fonts.googleapis.com/css2?family=${query}&display=swap`, { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' })).toString();
  const blocks = [...stylesheet.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)];
  const urls = new Map();
  for (const match of blocks) {
    const url = match[1].match(/url\(([^)]+)\)/)?.[1];
    if (!url) continue;
    if (!urls.has(url)) { const path = `${filename}-${urls.size}.woff2`; await writeFile(`public/fonts/${path}`, await fetch(url)); urls.set(url, path); }
    css += match[1].replace(url, `/fonts/${urls.get(url)}`) + '\n';
  }
  if (!urls.size) throw new Error(`No latin font found: ${name}`);
  await writeFile(`public/fonts/${filename}-OFL.txt`, await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${licenseDir}/OFL.txt`));
  console.log(`${name}: ${urls.size} local font file(s)`);
}
await writeFile('public/fonts/fonts.css', css);
