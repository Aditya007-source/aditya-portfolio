# Signal / Play

A local, interactive developer portfolio for Aditya Mishra, AI Engineer & Full-Stack Developer. Original projected Canvas geometry, immersive project panels, a working lab, local discoveries, and accessible navigation.

## Run locally

Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm install
npm run dev
```

Open the local address printed in the terminal (normally http://127.0.0.1:4173). `dev` builds and serves the complete prerendered site. After changing source files, restart it to rebuild. To serve an existing build:

```sh
npm run build
npm run preview
```

All dependencies and fonts are local. No hosting service, account, database, analytics, or remote portfolio API is used. The live RAG link opens the supplied Streamlit application; the portfolio's own retrieval illustration is a separate local demo.

## Customize

- `src/data.ts`: identity, biography, education, interests, availability, contact details, and project descriptions. LinkedIn, résumé, and project repository URLs can be added when available.
- `src/styles.css`: visual tokens, layout, responsive rules, and interactions.
- `src/components/SignalCanvas.tsx`: original Canvas sculpture and signal field.

The homepage features the RAG Intelligent PDF Reader, ANPR & Traffic Monitoring, and ongoing Web & AI Experiments. Technical descriptions and background come from the portfolio owner. RAG links to the supplied live application. Pipeline, traffic, and chart previews are original illustrations, not screenshots or measured results. Orbit and Prism remain available at their existing URLs as explicitly fictional concepts.

Email, telephone, and GitHub links are configured. The separate draft form saves a local text file and does not send messages. Settings and discoveries use device-local storage, with an in-memory fallback. Reset discoveries from “Behind the build.”

## Interaction map

- Hero / signal lab: move the pointer or press “Send a pulse.”
- Spring: drag horizontally or use the pull slider and bounce button; adjust stiffness.
- Circuit: rotate four corner tiles into a closed square.
- Menu: motion and opt-in sound controls, terminal, build details.
- Ctrl/Cmd+K: open terminal. Supported commands: `help`, `work`, `lab`, `contact`, `clear`.
- Featured project URLs: `/work/rag/`, `/work/anpr/`, `/work/experiments/`, `/work/portfolio/`.
- Preserved fictional concept URLs: `/work/orbit/`, `/work/prism/`.

Native dialogs support Escape and focus trapping. Tabs support arrow keys, Home, and End. System reduced-motion preferences and the explicit motion switch remove animated responses. Canvas pauses offscreen, in hidden tabs, and when settled. Without JavaScript, prerendered text and navigation remain readable.

## Build notes

Vite uses Babel and Terser rather than esbuild's background service because the local Windows restricted-token environment prevents its named-pipe subprocess creation. The resulting site remains a normal static React build. Prerendering uses React's streaming renderer, including lazy boundaries, to produce complete HTML for every project page.

Build output is `dist/`. Type checking runs as part of the build. Fonts are self-hosted and their OFL licenses are included alongside the assets. Font refresh is optional (`node scripts/fetch-fonts.mjs`) and requires internet access; normal builds do not download anything.

## Verification

`npm test` runs component interaction checks, static-output checks, Canvas geometry checks, storage and reduced-motion checks, and axe accessibility structure checks. It writes `.cache/verification.json`. These DOM simulations do not verify pixels, browser-native focus behavior, touch gestures, or contrast.

`npm run test:browser` contains Playwright checks for responsive widths, keyboard focus, direct routes, downloads, and no-JavaScript rendering. Browser tests could not run in the current Windows sandbox: Chromium's IPC failed and the test browser crashed. No further browser launches are made here. Run this command in a normal local terminal if you want to complete those checks; install Chromium with `npx playwright install chromium` if necessary.

Research and reuse decisions are in `docs/INSPIRATION.md`. Runtime library licenses are copied to `dist/THIRD_PARTY_NOTICES.txt` during the build.
