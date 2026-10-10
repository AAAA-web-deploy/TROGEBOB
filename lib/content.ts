export const MOODS = ["happy", "shocked", "angry", "sad", "smug"] as const;
export type Mood = (typeof MOODS)[number];
export type FounderId = "v" | "a" | "r";

export type Selection = Record<FounderId, Mood>;

export const FOUNDERS: {
  id: FounderId;
  num: string;
  name: string;
  label: string;
  role: string;
  icon: string;
  iconW: number;
  iconH: number;
}[] = [
  { id: "v", num: "01", name: "Vitalik", label: "VITALIK", role: "SPONGEBOB / ETH", icon: "/assets/brand/ethereum.svg", iconW: 22, iconH: 35 },
  { id: "a", num: "02", name: "Anatoly", label: "ANATOLY", role: "TROLLFACE / SOL", icon: "/assets/brand/solana.svg", iconW: 36, iconH: 28 },
  { id: "r", num: "03", name: "Raj", label: "RAJ", role: "DOGE / SOL", icon: "/assets/brand/solana.svg", iconW: 36, iconH: 28 },
];

export const MIXED = [
  { key: "happy-angry-smug", name: "HAPPY + ANGRY + SMUG", desc: "Vitalik is vibing, Anatoly wants to argue, and Raj knows something we don’t." },
  { key: "shocked-sad-happy", name: "SHOCKED + SAD + HAPPY", desc: "The emotional equivalent of checking three different price charts." },
  { key: "smug-happy-sad", name: "SMUG + HAPPY + SAD", desc: "A genius idea, a celebration, and a tiny existential crisis." },
  { key: "angry-smug-happy", name: "ANGRY + SMUG + HAPPY", desc: "One face. Three very incompatible group chats." },
  { key: "sad-shocked-smug", name: "SAD + SHOCKED + SMUG", desc: "The market fell. One of them apparently predicted it." },
] as const;

export const ALL3: Record<Mood, string> = {
  happy: "Three founders found the same brain cell. They’re throwing a party.",
  shocked: "All three saw the gas fee at once.",
  angry: "The DAO meeting has been cancelled for emotional reasons.",
  sad: "Three founders crying over one shared portfolio.",
  smug: "All three are convinced the other two copied their homework.",
};

export const GALLERY: [string, string][] = [
  ["confused", "THREE DIFFERENT OPINIONS"],
  ["suspicious", "IS THIS US?!"],
  ["angry", "NOT MY SCENE"],
  ["award", "ACCEPTING OUR OWN AWARD"],
  ["couch", "THREE BRAINS. ONE COUCH."],
];

export const CHAPTERS = [
  {
    src: "/assets/story/chapter-1.webp",
    alt: "Raj's Doge and Anatoly's Trollface approach the Solana symbol",
    n: "01",
    title: "THE SOLANA ENCOUNTER",
    text: "Raj: dog vibes. Anatoly: suspicious grin. Same chain, very different energy.",
    mark: "sol" as const,
  },
  {
    src: "/assets/story/chapter-2.webp",
    alt: "A combined Doge-Trollface being emerges with Solana energy",
    n: "02",
    title: "DOGE + TROLL = TROGE?",
    text: "Solana fusion successful. Personality compatibility: still buffering.",
    mark: "sol" as const,
  },
  {
    src: "/assets/story/chapter-3.webp",
    alt: "Solana fusion encounters Vitalik's SpongeBob next to the Ethereum symbol",
    n: "03",
    title: "VITALIK ENTERS.",
    text: "A sponge arrives via Ethereum. The fusion machine starts making noises.",
    mark: "eth" as const,
  },
  {
    src: "/assets/story/chapter-4.webp",
    alt: "Trogebob appears holding Ethereum and Solana symbols",
    n: "04",
    title: "TROGEBOB EXISTS!",
    text: "Three faces. One body. Exactly how many minds? That's your experiment.",
    mark: "seal" as const,
  },
];

export function pathMood(founder: FounderId, mood: Mood) {
  return `/assets/moods/${founder}-${mood}.webp`;
}

export function pathSame(mood: Mood) {
  return `/assets/results/aaa-${mood}.webp`;
}

export function pathMix(key: string) {
  return `/assets/samples/mixed-${key}.webp`;
}

export function nearestMixed(state: Selection) {
  const wanted = [state.v, state.a, state.r];
  let nearest: (typeof MIXED)[number] = MIXED[0];
  let best = -1;
  MIXED.forEach((m, i) => {
    const parts = m.key.split("-");
    let score = parts.reduce((s, mood, ix) => s + (mood === wanted[ix] ? 1 : 0), 0);
    score += (MIXED.length - i) * 0.0001;
    if (score > best) {
      best = score;
      nearest = m;
    }
  });
  return nearest;
}

export function resolveResult(state: Selection) {
  const key = `${state.v}-${state.a}-${state.r}`;
  const allSame = state.v === state.a && state.a === state.r;
  const exactMix = MIXED.find((m) => m.key === key);
  const match = allSame
    ? {
        img: pathSame(state.v),
        title: `${state.v.toUpperCase()} × 3`,
        desc: ALL3[state.v],
        type: "ALL-THREE MATCH · ORIGINAL ARTWORK",
      }
    : exactMix
      ? {
          img: pathMix(exactMix.key),
          title: exactMix.name,
          desc: exactMix.desc,
          type: "MIXED MOOD · PRE-DRAWN SAMPLE",
        }
      : null;
  const nearest = match ? null : nearestMixed(state);
  const title = match ? match.title : `${state.v.toUpperCase()} + ${state.a.toUpperCase()} + ${state.r.toUpperCase()}`;
  return {
    key,
    image: match ? match.img : pathMix(nearest!.key),
    exact: Boolean(match),
    title,
    kind: match ? match.type : "NEW COMBINATION · NEAREST SAMPLE",
    description: match
      ? match.desc
      : `No custom Trogebob artwork exists for this combination yet. Showing the closest finished sample (${nearest!.name}) with your precise selections underneath.`,
    alt: match
      ? `Illustrated Trogebob fusion: ${title}`
      : `Example artwork for ${nearest!.name}; not a drawing of the currently selected expressions`,
  };
}
