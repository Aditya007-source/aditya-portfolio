# Verification — 4 October 2026

- Local dependency installation completed. Dependencies are in `node_modules/`; the lockfile is included.
- Production build passed, including TypeScript checking and prerendering of the homepage and all six project routes.
- ESLint passed for the application source.
- All 26 automated verification checks passed. Detailed results are recorded in `.cache/verification.json`.
- Main JavaScript bundle: approximately 90.20 KB gzip; lazy playground chunk: 2.15 KB gzip; stylesheet: approximately 13.4 KB gzip.
- Fonts are local WOFF2 assets; SIL OFL notices and runtime software licenses are included in the distribution.
- The local preview responds successfully at `http://127.0.0.1:4173/`.

## Checked behavior

Project routes and metadata; personal identity, education, interests, and contact links; real vs fictional project labeling; labeled ANPR simulation controls; local asset references; bundle budget; discovery persistence and reset; circuit rotation; keyboard tab controls; spring stiffness; motion settings; terminal commands; concept preview controls; unknown-route recovery; contact POST destination and serialized fields, required reply email validation, CAPTCHA preservation, and no-JavaScript form output; unavailable-storage fallback; reduced-motion preference; finite Canvas coordinates and hidden-tab rendering pause; React errors; axe accessibility structure.

## Limits

Audio checks use a simulated Web Audio context to verify opt-in, scheduling after resume, cue frequencies, a single looping music source, reusable music buffers, muting, suspend/resume, and unsupported-browser feedback. The original Signal Drift waveform is checked for finite samples, nonzero signal level, clipping headroom, and a smooth loop seam. Actual audible output and device volume have not been tested in a browser. The visible sound control requires a visitor click; restored preferences never start playback on page load.

Chromium could not run under the Windows restricted-token sandbox. The testing browser crashed on internal IPC creation and was stopped; it is not the portfolio server. Browser-specific focus trapping, pixels, responsive screenshots, touch gestures, computed contrast, and Lighthouse LCP/CLS measurements remain unverified. DOM simulation checks do not substitute for those results. Playwright scenarios are included for running later in a normal local terminal, but were not marked as passed here.

The external RAG application's implementation was not inspectable through browsing. Its technical description and the ANPR, education, and background details were supplied by the owner. No measured project impact or unprovided employers are claimed. Email, telephone, and GitHub are configured. Contact notifications use FormSubmit and require recipient activation; actual mailbox delivery is not tested. See `CONTACT_SETUP.md`. LinkedIn, résumé, and project repository links are omitted until supplied.
