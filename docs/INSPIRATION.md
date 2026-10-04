# Research and original interpretation

References were inspected through their sites, creator descriptions, repositories, and case studies. This is a technique study, not a claim that every current animation was reproduced or browser-audited. No proprietary site code, photos, CGI, personal biographies, audio, or brand identity has been copied.

| Reference | Memorable idea / technique | Source and reuse position | Decision |
| --- | --- | --- | --- |
| [24/7 Artists](https://247artists.com/) | Music visualizers, thematic micro-interactions, tiles expanding in simulated depth. Its [creator case study](https://tympanus.net/codrops/2025/04/16/case-study-24-7-artists/) describes GSAP, CSS perspective, Canvas, and scale transforms. Consistent metaphors connect effects to content. | No permissive license verified for the production site; concepts only. | Primary inspiration for dimensional panel composition, original signal metaphor, and interaction continuity. |
| [Vanguart](https://vanguart.com/) | Precise pacing and immersive luxury product presentation; [creator account](https://hellohumans.agency/work/vanguart/) describes rich animation and responsive implementation. | Proprietary imagery and CGI; no assets reused. | Use deliberate pacing and restrained technical detail around original graphics. |
| [Lusion](https://lusion.co/) | The studio treats interactive 3D as its proof of craft. | No site asset/code license verified. | Make working experiments part of the portfolio's evidence; avoid the heavy world/model payload. |
| [Antoine Wodniack](https://wodniack.dev/) | Personal, playful developer framing with generative imagery and expressive project organization. | Public CodePen links exist, but individual snippets require their own license verification. | Adopt purposeful play; author controls and artwork independently. |
| [Maxime Heckel](https://maximeheckel.com/) | Shader exploration, light effects, and familiar UI patterns combined with surprising creative interactions. | Public experiments and explanations available; no snippets reused or license assumed. | Present interactive experiments as real work. |
| [Henry Heffernan](https://henryheffernan.com/) | A computer environment makes navigation part of the story; React / Three.js. | [Portfolio repo](https://github.com/henryjeff/portfolio-website) declares MIT. A code license does not automatically cover every external asset. | Use an optional command terminal; do not copy the OS, scene, or assets. |
| [Dennis Snellenberg](https://dennissnellenberg.com/) | Cohesive transitions and interaction craft in portfolio presentation. Current homepage fetching was restricted; archive and award references were available. | No first-party permissively licensed production repository verified. | General pacing reference; no copied implementation. |
| [Rauno Freiberg](https://rauno.me/) | Careful, consistent micro-interactions and clear project navigation. | Public craft links; no site reuse license verified. | Quiet controls, immediate feedback, and focus on details. |
| [Josh W. Comeau](https://www.joshwcomeau.com/) | Interactive explanations make technical skill tangible; SVG and animation articles. | Educational material isn't a blanket license for the whole site. | Explain the portfolio's live experiments in the build overlay. |
| [Jhey Tompkins](https://www.jhey.dev/) | Small, approachable UI experiments explore browser capabilities. | Public CodePen demos; licenses vary per material. | Keep experiments bounded and legible. No code copied. |
| [Bruno Simon](https://bruno-simon.com/) | Physics and exploration create memorable discovery; Three.js and a structured game loop. | [2025 repo](https://github.com/brunosimon/folio-2025) declares MIT; creator describes music as CC0. Neither used. | Studied early, then excluded from the selected visual direction at the user's request. |
| [Keita Yamada](https://p5aholic.me/) | Generative GLSL background framed by minimal content. | Creator explicitly states the portfolio code is private and reuse is not permitted. | Excluded at the user's request. No code/assets used. |
| [Takuya Matsuyama](https://www.craftz.dog/) | A personal 3D centerpiece integrated with readable content. | [Repo](https://github.com/craftzdog/craftzdog-homepage) describes MIT plus attribution conditions and excludes its voxel dog. | Excluded at the user's request. No code/assets used. |

## What was actually reused

Only declared open-source dependencies and Google Fonts font files. Runtime notices are included in the built distribution. Space Grotesk, Inter, and IBM Plex Mono have their original SIL Open Font License files in `public/fonts/` and the built output. All geometry algorithms, UI components, concept mockups, text, and synthesized tones were authored for this project.

Codrops downloadable demos generally use MIT unless otherwise specified ([policy](https://tympanus.net/codrops/licensing/)); production case studies do not grant reuse rights to their subjects. No demo code was incorporated.

## Scope adaptations

Use React / TypeScript / Tailwind / Motion with Vite because locally available packages and a static site meet the runtime requirements without a Next.js server. Use Canvas projection and CSS perspective instead of large models, shaders, or a full game engine. Keep native scrolling. Include no fabricated customer statistics, career claims, GitHub activity, or dead social links.
