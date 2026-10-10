# PASTE THIS WHOLE PROMPT INTO CURSOR AGENT MODE

You are a principal frontend engineer, experienced creative web designer, and meticulous QA engineer. I need you to **build a complete, production-ready, working website FROM SCRATCH** for my Ethereum meme token. Do the work yourself. Do not stop at a design outline or request a previous version. **My previous project was deleted: assume it does not exist.** Do not ask me for a starter template, more prompts, previous project files, or a hosted backend.

## THE INPUT IS THIS SELF-CONTAINED ZIP PACKAGE

I have extracted `TROGEBOB_From_Scratch.zip` to a NEW, EMPTY WORKSPACE. Everything you are allowed to assume comes from inside THIS package, especially `site/assets`. The ZIP already includes a standalone reference implementation (`site/index.html`, `site/styles.css`, `site/app.js`, `site/config.js`). **You must inspect, run, verify, repair, and polish that implementation, rather than launching a new unrelated framework.** Do not depend on a previous $3OR1 project or any files outside this package. The included site is a real project, not a screenshot. If site source files are missing, **recreate them from scratch using the precise specifications below**; treat missing old-project code as normal, not a blocker. If any isolated art asset is missing, make a tasteful self-contained SVG/CSS placeholder and report which one; do not link to mystery assets.

**Must finish:** A working local website with actual interactions, tested on desktop and mobile. Do not claim completion if clicking an emotion does nothing or a referenced image is missing.

## BRAND AND FACTS (LOCKED)

- Token legal/display name: `Vitalik+Anatoly+Raj` (do NOT rename to Trogebob)
- Ticker: `$TROGEBOB` (replace ALL old `$3OR1` branding in new code; `$3OR1` may occur only inside notes referring to old art and must NOT appear visibly in the app)
- Meme mascot name: `Trogebob`
- Tagline, with this exact capitalization and punctuation: `Three faces. One mind—or Three?!`
- Three founding meme identities: Vitalik = SpongeBob + Ethereum, Anatoly = Trollface + Solana, Raj = Doge + Solana.
- **Story order is non-negotiable:** Anatoly (Trollface) and Raj (Doge) fuse FIRST under the Solana symbol → their weird intermediate Doge-Troll mashup appears → Vitalik (SpongeBob) enters with Ethereum → all three combine into the fictional Trogebob.
- The result is an open question, not a claim that the three minds really united.
- This is an independent joke/parody, NOT an official endorsement/collaboration of those real people, Netflix, or the original meme creators. The allegation about Netflix making a composite character was only a reported interpretation, not a verified Netflix fact.

## BENCHMARK (INSPIRED BY, NOT A COPY)

Primary inspiration: https://apu.io/ . Secondary comparison: https://www.wojakcto.com/ . Research summary is inside `BENCHMARK_AND_CREATIVE_DIRECTION.md`.

Adapt the **experience principles** of APU: an illustrated mascot universe, community creativity, unexpected movement, an image-led gallery, and a useful meme-making tool. Adapt WOJAK's changing-faces emphasis. Do not copy protected logos, exact page geometry, text, copyrighted images, or proprietary code. Keep the Trogebob experience its own comedic universe.

## DESIGN: NO MORE BORING TEMPLATE

The banner image supplied in `site/assets/extras/legacy-banner-not-used-for-hero.webp` is **NOT allowed as a full-width hero/header**. Treat it as archived supporting art only. DO NOT make the first fold a standard nav + huge old banner + four flat statistic cards. DO NOT use a boring Home/Story/How-To-Buy/Community vertical template.

Instead, implement an asymmetric, image-first, hand-cut meme zine / weird internet playground:

1. **Hero: “WHO'S IN THIS HEAD?”** A giant cutout mascot floating over a pink illustrated splat; slanted caption stickers; huge scribbly condensed lettering; one interactive call to action leads to Face Lab. Ticker `$TROGEBOB` is visible but subordinate to the character. Fresh cream/acid yellow/pink/teal artwork, with dark contrasting ink. The provided transparent character `assets/brand/trogebob-cutout.webp` should dominate, not the old banner.
2. **Comic accident strip:** Four large separate user-approved scene illustrations (`assets/story/chapter-{1..4}.webp`), horizontal swipe/drag rail, collage angles, actual Ethereum and Solana icons. Each panel gets a punchy one-sentence caption and stage number.
3. **Face Lab:** Main entertainment, three founder-controlled columns, 5 emotion portrait choices each, and a highly visible output stage. On mobile, controls stack in compact rows before the output. All portraits and result images are distinct files inside this ZIP.
4. **Five synchronized emotions:** Illustrated matching-mood art tiles, each clickable to set Happy×3, Shocked×3, Angry×3, Sad×3, Smug×3.
5. **Meme wall:** Offset polaroid / handmade zine image collection, not a sterile 3-column corporate portfolio. Click thumbnails to open accessible modal; include separate mixed-mood showcase images.
6. **Token/exit section:** Token name and ticker, source of meme, clear independently fictional nature, disabled buy buttons until verified contract and URL are entered.

Target at least **70% visual content in story and gallery areas**; paragraphs short and punchy. Mobile layout must be excellent, not just squeezed desktop. Respect `prefers-reduced-motion`. Use accessible buttons, proper labels, and keyboard focus.

## EXACT FACE-LAB BEHAVIOR — MUST WORK

Founders are in **this exact order** everywhere: Vitalik, Anatoly, Raj. Five options per person, exactly: `happy`, `shocked`, `angry`, `sad`, `smug`.

Required sources:

```text
site/assets/moods/v-happy.webp ... v-smug.webp  (5)
site/assets/moods/a-happy.webp ... a-smug.webp  (5)
site/assets/moods/r-happy.webp ... r-smug.webp  (5)
site/assets/results/aaa-happy.webp
site/assets/results/aaa-shocked.webp
site/assets/results/aaa-angry.webp
site/assets/results/aaa-sad.webp
site/assets/results/aaa-smug.webp
site/assets/samples/mixed-happy-angry-smug.webp
site/assets/samples/mixed-shocked-sad-happy.webp
site/assets/samples/mixed-smug-happy-sad.webp
site/assets/samples/mixed-angry-smug-happy.webp
site/assets/samples/mixed-sad-shocked-smug.webp
```

The 5 matching choices must instantly show **their own corresponding illustrated Trogebob result**: `happy/happy/happy`, `shocked/shocked/shocked`, `angry/angry/angry`, `sad/sad/sad`, `smug/smug/smug`.

Exactly 5 additional *mixed* input triples have a corresponding finished illustration:

- Vitalik happy, Anatoly angry, Raj smug → `mixed-happy-angry-smug.webp`
- Vitalik shocked, Anatoly sad, Raj happy → `mixed-shocked-sad-happy.webp`
- Vitalik smug, Anatoly happy, Raj sad → `mixed-smug-happy-sad.webp`
- Vitalik angry, Anatoly smug, Raj happy → `mixed-angry-smug-happy.webp`
- Vitalik sad, Anatoly shocked, Raj smug → `mixed-sad-shocked-smug.webp`

For the other combinations, show the selected 3 individual expression portraits prominently alongside the **nearest finished sample** and explicitly label the sample as an approximation; do **not** pretend it is a generated image or the exact result. Add a punchy, friendly message like: `Our art department is still negotiating with three brain cells. Love this chaos? Come meet $TROGEBOB!` Make clear that **buying tokens does NOT automatically unlock art generation**. Do not gate the ten actual images behind token ownership, do not claim nonexistent tech, and do not promise future art as an investment perk.

Buttons `MIX IT UP` (changes selection), `SAVE MEME` (exports locally using canvas), and `SHARE` (native share or copy text fallback) must have real working handlers. Add five one-click matching-mood preset buttons. The current selected mood must be visually highlighted and exposed via `aria-pressed`.

## TECHNOLOGY + SPEED (CRITICAL)

Use **plain semantic HTML5, hand-authored CSS3, and modern vanilla ES2020 JavaScript**. **No React, Next, Vite, Tailwind, GSAP, Three.js, npm, remote APIs, backend services, big dependencies, bundlers, telemetry, or external fonts.** This is the fastest way to build in Cursor and to load the page. Only add a dependency if there is an unavoidable, measured need (there should be none).

- Static entrypoint `site/index.html`; `site/styles.css`; `site/app.js`; `site/config.js`.
- All assets local, optimized WebP or tiny SVG/PNG.
- Preload the transparent hero mascot; lazy-load noncritical images; explicit image dimensions or stable aspect-ratio; no layout shift; responsive `src` if materially useful.
- Keep CSS effects GPU-friendly (`transform`, `opacity`); do not use hundreds of animated objects; pause unnecessary animation with reduced-motion media queries.
- Avoid JS render loops, giant image sprites, and loading all full-resolution images on initial page paint.
- Use browser-native `loading="lazy"`, `scroll-snap-type`, `<dialog>`, `navigator.share`, `navigator.clipboard`, `<canvas>`, and `prefers-reduced-motion`.
- Aim for very fast first load under normal broadband. No build or install step should be required.

## SECURITY, BUY BUTTONS AND HONESTY

There is **no verified contract address or swap URL** in this brief. You MUST leave `ethereumContract` and `officialBuyUrl` blank in `site/config.js` until I provide them. Buttons should visibly communicate that trading isn't configured; they must not link to a fake pair, send ETH, initiate trades, or use another project's token address. Require a valid `0x...` 40-hex Ethereum contract plus a legitimate HTTPS swap URL before enabling trade buttons. Do not invent a token supply, burn, renunciation, tax, liquidity state, team affiliation, trading volume, or endorsements. Don't imply a token purchase technically creates additional memes.

The site must be transparent that the Netflix fusion concept is a satirical imagining inspired by a reported reaction, not Netflix's official character or three founders collaborating. No copyright clearance is provided for SpongeBob and original meme imagery; add a concise independent parody disclaimer.

## BUILD PROCEDURE — YOU MUST COMPLETE IT, NOT JUST EXPLAIN

1. **Inspect workspace** with directory listing. Ignore deleted earlier projects. Ensure the root of this ZIP contains `site`, `CURSOR_ZERO_TO_COMPLETE.md`, and `BENCHMARK_AND_CREATIVE_DIRECTION.md`.
2. Use included `site/assets/` files; do not rename or create broken paths. Confirm counts: 15 founder expressions, 5 same-emotion results, 5 mixed illustrations, 4 fusion comic images. Confirm hero cutout and 2 chain SVGs.
3. Read the runnable starting implementation and improve any bug, visual issue, or missing accessibility element. If code is missing, create `site/index.html`, `site/styles.css`, `site/app.js`, and `site/config.js` from scratch per these requirements; use the existing locally supplied assets. Never refer to old $3OR1 folders.
4. Start the site using `python -m http.server 4173` from inside `site/` (on Windows use `py -3 -m http.server 4173`). No npm commands.
5. Open localhost:4173 using Cursor's browser or Chromium. **Actually inspect** desktop 1440×900 and mobile 390×844. No uncropped labels, broken images, overflowing buttons, clipped headings, or horizontal body scroll.
6. Click all **five matching presets** and confirm each distinct image. Click the five **mixed triples** and confirm exact matching sample. Choose an unillustrated triple (e.g., shocked, angry, sad) and confirm an explicit `UNRELEASED`/`nearest sample` message with all three selected images.
7. Test: comic scrolling, randomizer, active button state, gallery lightbox and keyboard close, downloaded meme image, share fallback, internal navigation, responsive mobile menu, and disabled buy state. Test JavaScript errors and missing network files.
8. Fix issues and repeat tests. You are finished only when the working site passes these checks. In your final completion note, tell me the exact local preview command and any unresolved legal/contract placeholders; **do not ask for another prompt**.

## ART/FILES PROVIDED IN THIS ZIP

- `site/assets/brand/` — original selected Trogebob mascots and Ethereum/Solana vector marks
- `site/assets/story/` — all four stages of the user-directed fusion sequence
- `site/assets/moods/` — fifteen clickable inputs
- `site/assets/results/` — five synchronised expressions
- `site/assets/samples/` — five truly mixed expressions
- `site/assets/gallery/` — five shareable preexisting character panels
- `site/assets/extras/` — handmade visual textures and archived original 3:1 banner, which is **not** to be used as the hero

**FINAL DIRECTIVE:** Build the website from this new package alone, as if every past codebase was deleted. No blank-page mockup, no generic prebuilt token template, no fake functional controls, no dead asset links, no requests for more files, no dependence on other ChatGPT conversations. Finish the runnable website.
