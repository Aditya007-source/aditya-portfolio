import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import App from './App';
export { App };
export { profile, projects } from './data';
export { InteractionAudio } from './audio';
export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({ write(chunk, _encoding, callback) { html += chunk.toString(); callback(); } });
    sink.on('finish', () => resolve(html));
    const { pipe } = renderToPipeableStream(<App path={path} />, { onAllReady() { pipe(sink); }, onError: reject });
  });
}
