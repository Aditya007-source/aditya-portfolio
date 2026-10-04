import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { minify } from 'terser';
// Pure-JavaScript transforms avoid the Windows restricted-token named-pipe
// limitation in the native esbuild service. No sandbox bypass is needed.
export default defineConfig({
  plugins: [react({ babel: { plugins: [['@babel/plugin-transform-typescript', { isTSX: true, allExtensions: true }], ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]] } }), { name: 'pure-js-build', enforce: 'pre', config: () => ({ esbuild: false }), transform(code, id) { if (/\.[cm]?[jt]sx?$/.test(id) && code.includes('process.env.NODE_ENV')) return { code: code.replaceAll('process.env.NODE_ENV', '"production"'), map: null }; } }, { name: 'pure-js-minify', async renderChunk(code, chunk, options) { if (options.format !== 'es') return null; const result = await minify(code, { module: true, compress: true, mangle: true, format: { comments: /^!/ } }); return { code: result.code, map: null }; } }],
  esbuild: false,
  resolve: { preserveSymlinks: true },
  ssr: { resolve: { conditions: ['node'] } },
  build: { target: 'esnext', minify: false, cssMinify: false, sourcemap: false },
});
