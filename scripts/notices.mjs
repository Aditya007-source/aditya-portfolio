import { readFile, writeFile } from 'node:fs/promises';
const packages = ['react', 'react-dom', 'scheduler', 'framer-motion', 'motion-dom', 'motion-utils', 'tslib'];
let notices = 'SIGNAL / PLAY — THIRD-PARTY SOFTWARE NOTICES\n\nFont licenses are provided in fonts/*-OFL.txt.\n\n';
for (const name of packages) {
  const metadata = JSON.parse(await readFile(`node_modules/${name}/package.json`, 'utf8'));
  let license = '';
  for (const candidate of ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENSE.MIT', 'CopyrightNotice.txt']) {
    try { license = await readFile(`node_modules/${name}/${candidate}`, 'utf8'); break; } catch { /* try declared package files */ }
  }
  if (!license) throw new Error(`Missing license text for ${name}`);
  notices += `${name} ${metadata.version}\n${'='.repeat(60)}\n${license}\n\n`;
}
await writeFile('dist/THIRD_PARTY_NOTICES.txt', notices);
console.log('Runtime third-party notices preserved.');
