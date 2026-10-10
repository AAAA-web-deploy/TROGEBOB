"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isTradeReady, isValidAddress, isValidURL, TROGEBOB_CONFIG } from "@/lib/config";
import {
  CHAPTERS,
  FOUNDERS,
  GALLERY,
  MIXED,
  MOODS,
  pathMix,
  pathMood,
  pathSame,
  resolveResult,
  type FounderId,
  type Mood,
  type Selection,
} from "@/lib/content";
import { createShareablePNG } from "@/lib/memeCanvas";

const INITIAL: Selection = { v: "happy", a: "happy", r: "happy" };

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function TelegramMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      />
    </svg>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </svg>
  );
}

function SocialMark({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  if (isValidURL(href)) {
    return (
      <a className="mark-button" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {children}
      </a>
    );
  }
  return (
    <a className="mark-button" href="#top" aria-label={label} aria-disabled="true" onClick={(event) => event.preventDefault()}>
      {children}
    </a>
  );
}

function SocialMarks() {
  return (
    <div className="head-social">
      <SocialMark label="Telegram" href={TROGEBOB_CONFIG.telegramUrl}>
        <TelegramMark />
      </SocialMark>
      <SocialMark label="X" href={TROGEBOB_CONFIG.xUrl}>
        <XMark />
      </SocialMark>
    </div>
  );
}

function TradeLink({ className, children }: { className: string; children: React.ReactNode }) {
  const ready = isTradeReady();
  if (ready) {
    return (
      <a className={className} href={TROGEBOB_CONFIG.officialBuyUrl} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <a
      className={className}
      href="#info"
      aria-disabled="true"
      onClick={(event) => {
        event.preventDefault();
        document.getElementById("info")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {children}
    </a>
  );
}

export function TrogebobSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selection, setSelection] = useState<Selection>(INITIAL);
  const [shareLabel, setShareLabel] = useState("↗ SHARE");
  const [copyLabel, setCopyLabel] = useState("COPY ADDRESS");
  const [caLabel, setCaLabel] = useState("COPY CA");
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const result = useMemo(() => resolveResult(selection), [selection]);
  const ready = isTradeReady();
  const publishedAddress = isValidAddress(TROGEBOB_CONFIG.ethereumContract) ? TROGEBOB_CONFIG.ethereumContract : "";

  useEffect(() => {
    const view = viewportRef.current;
    if (!view) return;
    view.classList.remove("bump");
    void view.offsetWidth;
    view.classList.add("bump");
  }, [result.key]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightbox) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [lightbox]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function setMood(id: FounderId, mood: Mood) {
    setSelection((current) => ({ ...current, [id]: mood }));
  }

  function setAll(mood: Mood, alsoLab = false) {
    setSelection({ v: mood, a: mood, r: mood });
    document.getElementById("resultViewport")?.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
    if (alsoLab) document.getElementById("lab")?.scrollIntoView({ behavior: "smooth" });
  }

  function randomize() {
    const pick = MIXED[Math.floor(Math.random() * MIXED.length)];
    const [v, a, r] = pick.key.split("-") as [Mood, Mood, Mood];
    setSelection({ v, a, r });
  }

  function scrollStory(direction: number) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.75, behavior: "smooth" });
  }

  async function saveMeme() {
    try {
      const blob = await createShareablePNG(result, selection);
      if (!blob) throw new Error("Image export unavailable");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `trogebob-${result.key}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch {
      window.alert("Could not export this image. Try a screenshot instead.");
    }
  }

  async function shareMeme() {
    const str = `$TROGEBOB: ${result.title} — Three faces. One mind or three?! (independent parody)`;
    const url = `${location.href.split("#")[0]}#lab`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Trogebob", text: str, url });
        return;
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${str} ${url}`);
        setShareLabel("COPIED! ✓");
        setTimeout(() => setShareLabel("↗ SHARE"), 1200);
        return;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
    }
    window.prompt("Copy this meme caption:", str);
  }

  function goToTop(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  async function writeContract() {
    const text = publishedAddress || "NOT PUBLISHED";
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => setTimeout(() => reject(new Error("clipboard-timeout")), 800)),
      ]);
      return;
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
  }

  async function copyContract() {
    await writeContract();
    setCopyLabel("COPIED ✓");
    setTimeout(() => setCopyLabel("COPY ADDRESS"), 1300);
  }

  async function copyCa() {
    await writeContract();
    setCaLabel("COPIED ✓");
    setTimeout(() => setCaLabel("COPY CA"), 1300);
  }

  return (
    <>
      <a className="skip" href="#lab">
        Skip to Face Lab
      </a>
      <header className="masthead" id="top">
        <a className="wordmark" href="#top" aria-label="Trogebob home" onClick={goToTop}>
          <img className="wordmark-face" src="/assets/brand/logo.jpg" alt="" width={52} height={52} />
          <span>
            troge<span className="wordmark-end">bob!</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          <a href="#accident">THE ACCIDENT</a>
          <a href="#lab">FACE LAB</a>
          <a href="#wall">MEME WALL</a>
          <a href="#info">ABOUT</a>
        </nav>
        <SocialMarks />
        <button className="nav-ca" type="button" onClick={copyCa}>
          {caLabel}
        </button>
        <TradeLink className="nav-buy trading-link">
          <span>GET $TROGEBOB ↗</span>
        </TradeLink>
        <button
          id="menuToggle"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobileMenu"
          aria-label="Toggle menu"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
      </header>
      <nav id="mobileMenu" className="mobile-menu" hidden={!menuOpen} aria-label="Mobile navigation">
        <a href="#accident" onClick={closeMenu}>
          THE ACCIDENT
        </a>
        <a href="#lab" onClick={closeMenu}>
          FACE LAB
        </a>
        <a href="#wall" onClick={closeMenu}>
          MEME WALL
        </a>
        <a href="#info" onClick={closeMenu}>
          ABOUT / TOKEN
        </a>
        <SocialMarks />
        <button className="nav-ca" type="button" onClick={copyCa}>
          {caLabel}
        </button>
      </nav>

      <main>
        <section className="hero section-bleed" aria-labelledby="heroTitle">
          <div className="hero-paper">
            <div className="ticker-column" aria-hidden="true">
              <span>TROGEBOB / TROGEBOB / TROGEBOB / TROGEBOB</span>
            </div>
            <div className="hero-copy">
              <div className="top-stamp">
                A VERY UNOFFICIAL MEME EXPERIMENT <span>↗</span>
              </div>
              <h1 id="heroTitle" className="token-name">
                VITALIK<span>+</span>
                <br />
                ANATOLY<span>+</span>
                <br />
                RAJ
              </h1>
              <p className="hero-kicker">
                WHO&apos;S
                <br />
                IN THIS <em>HEAD?</em>
              </p>
              <p className="hero-question">
                Three faces. <mark>One mind—or Three?!</mark>
              </p>
              <p className="hero-intro">The internet put a sponge, a troll, and a dog in one body. Their shared brain has not returned our calls.</p>
              <div className="hero-actions">
                <a className="rough-button lime" href="#lab">
                  PLAY WITH THE FACE <span>↗</span>
                </a>
                <a className="rough-button black" href="#accident">
                  SEE THE ACCIDENT <span>↓</span>
                </a>
              </div>
              <p className="mini-disclaimer">PARODY / NOT AFFILIATED WITH ANY FOUNDER, MEME OWNER OR NETWORK.</p>
            </div>
            <div className="hero-art" aria-label="Trogebob mascot: a mischievous sponge-dog-troll character">
              <div className="pink-splat" />
              <div className="orbital-caption oc-one">DOGE ENERGY!</div>
              <div className="orbital-caption oc-two">TROLLFACE GRIN!</div>
              <div className="orbital-caption oc-three">SPONGE BRAIN?!</div>
              <img
                className="hero-character"
                src="/assets/brand/trogebob-cutout.webp"
                alt="Trogebob holding Ethereum and Solana symbols"
                width={950}
                height={950}
                fetchPriority="high"
              />
              <div className="hero-scribble" aria-hidden="true">
                ↗
              </div>
            </div>
            <div className="hero-ticket">
              <strong>$TROGEBOB</strong>
              <span>
                NEW FACE
                <br />
                WHO DIS?
              </span>
              <b>3 OR 1?</b>
            </div>
          </div>
        </section>

        <div className="tape-line" aria-hidden="true">
          <div>ONE BODY • THREE BAD IDEAS • ONE BODY • THREE BAD IDEAS • ONE BODY • THREE BAD IDEAS •</div>
        </div>

        <section id="accident" className="story section-bleed" aria-labelledby="storyHeading">
          <div className="story-head">
            <div>
              <p className="eyebrow">THE CANON // ISSUE NO. 001</p>
              <h2 id="storyHeading">
                THE <span>FUSION</span>
                <br />
                ACCIDENT.
              </h2>
            </div>
            <div className="story-note">
              READ LEFT TO RIGHT <span aria-hidden="true">➜ ➜ ➜</span>
              <p>First the Solana boys. Then Vitalik walks in. Nobody read the instructions.</p>
            </div>
          </div>
          <div className="comic-rail" id="comicRail" ref={railRef} tabIndex={0} aria-label="Four panel origin story, scroll horizontally">
            {CHAPTERS.map((chapter) => (
              <article className="comic-panel" key={chapter.n}>
                <div className="comic-image">
                  <img loading="lazy" src={chapter.src} alt={chapter.alt} />
                  <span className="comic-count">{chapter.n}</span>
                </div>
                <div className="comic-legend">
                  <strong>{chapter.title}</strong>
                  <p>{chapter.text}</p>
                  {chapter.mark === "sol" ? (
                    <img src="/assets/brand/solana.svg" alt="Solana" width={36} height={28} />
                  ) : chapter.mark === "eth" ? (
                    <img src="/assets/brand/ethereum.svg" alt="Ethereum" width={26} height={36} />
                  ) : (
                    <span className="mini-seal">?</span>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="comic-controls">
            <button id="storyPrev" type="button" aria-label="Previous comic panel" onClick={() => scrollStory(-1)}>
              ←
            </button>
            <span>DRAG / SWIPE THE COMIC STRIP</span>
            <button id="storyNext" type="button" aria-label="Next comic panel" onClick={() => scrollStory(1)}>
              →
            </button>
          </div>
          <p className="story-fact">
            This is a fictional parody inspired by a reported founder reaction to a Netflix trailer—not a confirmed Netflix character or founder collaboration.
          </p>
        </section>

        <section id="lab" className="lab section-bleed" aria-labelledby="labHeading">
          <div className="lab-heading">
            <div>
              <p className="eyebrow">THE MAIN EVENT • NO LAB COAT REQUIRED</p>
              <h2 id="labHeading">
                MAKE A <span>FACE.</span>
                <br />
                MAKE A MESS.
              </h2>
            </div>
            <div className="wobbly-arrow" aria-hidden="true">
              ↘
            </div>
            <p>Give three founders three moods. Watch one very confused creature attempt to feel them all.</p>
          </div>
          <div className="lab-desk">
            <div className="lab-left">
              <div className="founder-cabinet" id="founderCabinet" aria-label="Choose a mood for each of the three founders">
                {FOUNDERS.map((founder) => (
                  <div className="founder-control" data-founder={founder.id} key={founder.id}>
                    <div className="founder-label">
                      <span className="founder-id">{founder.num}</span>
                      <div>
                        <h3>{founder.label}</h3>
                        <small>{founder.role}</small>
                      </div>
                      <img src={founder.icon} alt="" width={founder.iconW} height={founder.iconH} />
                    </div>
                    <div className="mood-grid" data-mood-grid={founder.id}>
                      {MOODS.map((mood) => (
                        <button
                          type="button"
                          className="mood-button"
                          key={mood}
                          data-founder={founder.id}
                          data-mood={mood}
                          aria-label={`${founder.name}: ${mood}`}
                          aria-pressed={selection[founder.id] === mood}
                          onClick={() => setMood(founder.id, mood)}
                        >
                          <img src={pathMood(founder.id, mood)} alt="" loading="lazy" width={260} height={200} />
                          <span>{mood.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="preset-bar">
                <span>FAST TRACK:</span>
                {MOODS.map((mood) => (
                  <button type="button" className="preset" data-preset={mood} key={mood} onClick={() => setAll(mood)}>
                    {mood.toUpperCase()} ×3
                  </button>
                ))}
              </div>
            </div>
            <div className="result-column">
              <div className="result-topline">
                <span>LIVE FACE FEED</span>
                <span className="live-dot">●</span>
              </div>
              <div className="result-viewport" id="resultViewport" ref={viewportRef}>
                <img id="resultImage" src={result.image} alt={result.alt} width={482} height={576} />
                <div id="unstableOverlay" className="unstable-overlay" hidden={result.exact}>
                  <div className="unstable-portraits">
                    <img id="selectedV" alt="Selected Vitalik expression" src={pathMood("v", selection.v)} />
                    <img id="selectedA" alt="Selected Anatoly expression" src={pathMood("a", selection.a)} />
                    <img id="selectedR" alt="Selected Raj expression" src={pathMood("r", selection.r)} />
                  </div>
                  <p>UNRELEASED FUSION</p>
                </div>
              </div>
              <div className="result-caption">
                <span id="resultKind">{result.kind}</span>
                <h3 id="resultTitle">{result.title}</h3>
                <p id="resultDescription">{result.description}</p>
              </div>
              <div className="result-actions">
                <button type="button" id="randomizeBtn" onClick={randomize}>
                  🎲 MIX IT UP
                </button>
                <button type="button" id="downloadBtn" onClick={saveMeme}>
                  ↓ SAVE MEME
                </button>
                <button type="button" id="shareBtn" onClick={shareMeme}>
                  {shareLabel}
                </button>
              </div>
              <div className="unmade-note" id="unmadeNote" hidden={result.exact}>
                <strong>THIS COMBINATION IS TOO WEIRD FOR OUR ART DEPARTMENT.</strong>
                <p>
                  Your three moods are shown above. The picture behind them is a <b>sample</b>, not an exact custom render. More hand-drawn fusions are on the wishlist. Love the beautiful disaster? Come meet <b>$TROGEBOB</b>. No token purchase is needed for the existing presets, and buying does not automatically unlock new images.
                </p>
                <a href="#info">MEET THE TOKEN ↗</a>
              </div>
            </div>
          </div>
          <div className="lab-disclaimer">
            FIVE MATCHING MOODS + FIVE MIXED MOOD SAMPLES ARE PRE-DRAWN. OTHER COMBINATIONS SHOW A CLEARLY MARKED CLOSEST SAMPLE + YOUR EXACT THREE INPUTS, NOT AN AI-GENERATED NEW IMAGE.
          </div>
        </section>

        <section className="artifacts section-bleed" aria-labelledby="artifactsHeading">
          <div className="artifacts-head">
            <div>
              <p className="eyebrow">FIVE MOODS // THREE TIMES THE TROUBLE</p>
              <h2 id="artifactsHeading">
                THE <span>FIVE</span> STATES
                <br />
                OF TROGEBOB.
              </h2>
            </div>
            <p>Same mood on all three faces. Five portraits. Zero peace.</p>
          </div>
          <div className="result-strip" id="resultStrip">
            {MOODS.map((mood) => (
              <div className="face-print" key={mood}>
                <img loading="lazy" src={pathSame(mood)} alt={`${mood.toUpperCase()} times three illustration`} />
                <h3>{mood.toUpperCase()} ×3</h3>
                <button type="button" onClick={() => setAll(mood, true)}>
                  TRY THIS MOOD ↗
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="wall" className="wall section-bleed" aria-labelledby="wallHeading">
          <div className="wall-head">
            <p className="eyebrow">THE INTERNET IS NOT OKAY</p>
            <h2 id="wallHeading">
              THE <span>MEME WALL.</span>
            </h2>
            <p>Drag your eyes around. Click an image to see it bigger. Screenshot responsibly.</p>
          </div>
          <div className="meme-wall" id="memeWall">
            {GALLERY.map(([key, label]) => (
              <button
                type="button"
                className="meme-card"
                key={key}
                onClick={() => setLightbox({ src: `/assets/gallery/${key}.webp`, caption: label })}
              >
                <img loading="lazy" alt={`Trogebob parody cartoon: ${label}`} src={`/assets/gallery/${key}.webp`} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="mixed-head">
            <h3>
              RARE MIXED FEELINGS <span>↙</span>
            </h3>
            <p>Five pre-drawn accidents available inside the Face Lab.</p>
          </div>
          <div className="mixed-wall" id="mixedWall">
            {MIXED.map((item) => (
              <button type="button" className="mixed-card" key={item.key} onClick={() => setLightbox({ src: pathMix(item.key), caption: item.name })}>
                <img loading="lazy" src={pathMix(item.key)} alt={`Trogebob mixed expression ${item.name}`} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section id="info" className="exit section-bleed" aria-labelledby="exitHeading">
          <div className="exit-left">
            <div className="exit-sticker">UNOFFICIAL. UNHINGED. UNFINISHED.</div>
            <h2 id="exitHeading">
              THREE FACES.
              <br />
              ONE <span>TOKEN.</span>
            </h2>
            <p>
              Real meme question, fictional mashup. The character is Trogebob. The token name is <strong>Vitalik+Anatoly+Raj</strong>. The ticker is <strong>$TROGEBOB</strong>.
            </p>
            <div className="trade-settings">
              <p>
                <strong>ETHEREUM TOKEN ADDRESS:</strong>
              </p>
              <code id="contractDisplay">{publishedAddress || "NOT PUBLISHED"}</code>
              <button id="copyContract" type="button" onClick={copyContract}>
                {copyLabel}
              </button>
              {ready ? <small id="launchStatus">Confirm the contract matches the verified official listing before trading.</small> : null}
            </div>
            <div className="exit-buttons">
              <TradeLink className="rough-button lime trading-link">GET $TROGEBOB ↗</TradeLink>
              <a className="rough-button outline" href="#lab">
                MAKE ANOTHER FACE ↗
              </a>
            </div>
          </div>
          <div className="exit-right">
            <a className="logo-top" href="#top" aria-label="Back to top" onClick={goToTop}>
              <img loading="lazy" src="/assets/brand/logo.jpg" alt="Trogebob circular meme token mascot" width={700} height={700} />
            </a>
            <p>
              THE FACE HAS SPOKEN.
              <br />
              <strong>IT SAID “LOL.”</strong>
            </p>
          </div>
        </section>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#top" onClick={goToTop}>
          troge<span className="wordmark-end">bob!</span>
        </a>
        <p>
          © 2026 Trogebob fan parody. Not affiliated with or endorsed by Vitalik Buterin, Anatoly Yakovenko, Raj Gokal, Netflix, SpongeBob&apos;s rights holders, or the creators of the underlying memes. No investment returns are implied.
        </p>
        <SocialMarks />
        <a href="#top" onClick={goToTop}>
          BACK TO TOP ↑
        </a>
      </footer>
      <dialog
        id="lightbox"
        className="lightbox"
        aria-label="Expanded meme artwork"
        ref={dialogRef}
        onClose={() => setLightbox(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setLightbox(null);
        }}
      >
        <button type="button" id="closeLightbox" className="close-lightbox" aria-label="Close expanded image" onClick={() => setLightbox(null)}>
          ✕
        </button>
        {lightbox ? <img id="lightboxImage" src={lightbox.src} alt={lightbox.caption} /> : null}
        <p id="lightboxCaption">{lightbox?.caption ?? ""}</p>
      </dialog>
    </>
  );
}
