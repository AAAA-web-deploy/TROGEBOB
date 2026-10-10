// Supply a verified Ethereum contract and an official HTTPS swap URL before launch.
// Leave both empty and the buy UI stays disabled. Do not paste another token's contract.
export const TROGEBOB_CONFIG = {
  tokenName: "Vitalik+Anatoly+Raj",
  ticker: "TROGEBOB",
  ethereumContract: "",
  officialBuyUrl: "",
  xUrl: "https://x.com/trogebob",
  telegramUrl: "https://t.me/trogebob",
};

export function isValidAddress(addr: string) {
  return /^0x[a-f\d]{40}$/i.test(addr || "");
}

export function isValidURL(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.length > 3;
  } catch {
    return false;
  }
}

export function isTradeReady() {
  return isValidAddress(TROGEBOB_CONFIG.ethereumContract) && isValidURL(TROGEBOB_CONFIG.officialBuyUrl);
}
