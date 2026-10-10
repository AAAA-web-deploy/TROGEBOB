import { pathMood, type FounderId, type Selection } from "./content";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = src;
    if (img.complete && img.naturalWidth) resolve(img);
  });
}

export async function createShareablePNG(current: { image: string; exact: boolean; title: string }, state: Selection) {
  const img = await loadImage(current.image);
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1080;
  const ctx = cv.getContext("2d");
  if (!ctx) throw new Error("Image export unavailable");
  ctx.fillStyle = "#fff8db";
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = "#17112e";
  ctx.fillRect(0, 0, 1080, 140);
  ctx.fillStyle = "#f2ff39";
  ctx.font = "bold 70px Impact,Arial Black,sans-serif";
  ctx.fillText("TROGEBOB", 52, 95);
  ctx.font = "bold 27px sans-serif";
  ctx.fillStyle = "#fff";
  ctx.fillText("THREE FACES. ONE MIND — OR THREE?!", 52, 128);
  const sx = 64;
  const sy = 170;
  const sw = 952;
  const sh = 728;
  const r = Math.min(sw / img.width, sh / img.height);
  const w = img.width * r;
  const h = img.height * r;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(sx, sy, sw, sh);
  ctx.drawImage(img, sx + (sw - w) / 2, sy + (sh - h) / 2, w, h);
  if (!current.exact) {
    ctx.fillStyle = "rgba(23,17,46,.88)";
    ctx.fillRect(sx, sy + sh - 185, sw, 185);
    const ids: FounderId[] = ["v", "a", "r"];
    const images = await Promise.all(ids.map((id) => loadImage(pathMood(id, state[id])).catch(() => null)));
    images.forEach((p, i) => {
      if (p) ctx.drawImage(p, 145 + i * 295, sy + sh - 178, 150, 133);
    });
    ctx.fillStyle = "#edff40";
    ctx.font = "bold 29px Impact,sans-serif";
    ctx.fillText("UNRELEASED COMBO · SAMPLE IMAGE ABOVE", 115, sy + sh - 13);
  }
  ctx.fillStyle = "#17112e";
  ctx.fillRect(0, 916, 1080, 164);
  ctx.fillStyle = "#edff40";
  ctx.font = "bold 50px Impact,sans-serif";
  ctx.fillText(current.title.slice(0, 34), 52, 990);
  ctx.fillStyle = "white";
  ctx.font = "bold 23px sans-serif";
  ctx.fillText("$TROGEBOB · INDEPENDENT PARODY", 52, 1035);
  return new Promise<Blob | null>((resolve) => cv.toBlob(resolve, "image/png"));
}
