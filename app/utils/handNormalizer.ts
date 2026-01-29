/**
 * ハンドの正規化とスート付きハンド生成
 * localStorageではスートを無視して正規化ハンドで保存し、
 * 出題時は適切なスートをランダムに選択する
 */

const RANK_ORDER: Record<string, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};

const SUITS = ["s", "h", "d", "c"] as const;

function rankToChar(r: number): string {
  const entry = Object.entries(RANK_ORDER).find(([, v]) => v === r);
  return entry ? entry[0] : "2";
}

/**
 * ハンドを正規化する（スートを無視、ランクのみで表現）
 * 例: "2D3S" → "32o", "AsKs" → "AKs", "AA" → "AA"
 */
export function normalizeHand(hand: string): string {
  if (!hand || hand.length < 2) {
    return hand;
  }

  const h = hand.trim();

  // すでに正規形（ペア2文字、または ランク+ランク+s/o の3文字）
  if (h.length === 2) {
    const r1 = h[0].toUpperCase();
    const r2 = h[1].toUpperCase();
    if (r1 === r2) return `${r1}${r2}`;
    // 2文字でペアでない場合は不正（一応ランク順にしておく）
    const o1 = RANK_ORDER[r1] ?? 0;
    const o2 = RANK_ORDER[r2] ?? 0;
    return o1 >= o2 ? `${r1}${r2}` : `${r2}${r1}`;
  }

  if (h.length === 3) {
    const r1 = h[0].toUpperCase();
    const r2 = h[1].toUpperCase();
    const type = h[2].toLowerCase();
    if (
      (type === "s" || type === "o") &&
      RANK_ORDER[r1] !== undefined &&
      RANK_ORDER[r2] !== undefined
    ) {
      const o1 = RANK_ORDER[r1];
      const o2 = RANK_ORDER[r2];
      const high = o1 >= o2 ? r1 : r2;
      const low = o1 >= o2 ? r2 : r1;
      return `${high}${low}${type}`;
    }
    return h;
  }

  // 4文字: ランク+スート+ランク+スート (例: AsKs, 2D3S)
  if (h.length === 4) {
    const r1 = h[0].toUpperCase();
    const s1 = h[1].toLowerCase();
    const r2 = h[2].toUpperCase();
    const s2 = h[3].toLowerCase();
    if (
      !["s", "h", "d", "c"].includes(s1) ||
      !["s", "h", "d", "c"].includes(s2)
    ) {
      return h;
    }
    const o1 = RANK_ORDER[r1] ?? 0;
    const o2 = RANK_ORDER[r2] ?? 0;
    const highRank = o1 >= o2 ? o1 : o2;
    const lowRank = o1 >= o2 ? o2 : o1;
    const high = rankToChar(highRank);
    const low = rankToChar(lowRank);
    if (high === low) {
      return `${high}${low}`; // ペア
    }
    const suited = s1 === s2;
    return `${high}${low}${suited ? "s" : "o"}`;
  }

  return hand;
}

/**
 * 正規化されたハンドからランダムなスートでハンド文字列を生成
 * オフスイート: 異なるスート、スイテッド: 同じスート、ペア: 異なるスート
 */
export function generateHandWithRandomSuits(normalizedHand: string): string {
  if (!normalizedHand || normalizedHand.length < 2) {
    return normalizedHand;
  }

  const n = normalizedHand.trim();

  if (n.length === 2) {
    // ペア: 異なるスートを2つ選ぶ
    const [s1, s2] = pickTwoDifferentSuits();
    return `${n[0]}${s1}${n[1]}${s2}`;
  }

  if (n.length === 3) {
    const r1 = n[0];
    const r2 = n[1];
    const type = n[2].toLowerCase();

    if (type === "s") {
      const suit = pickRandomSuit();
      return `${r1}${suit}${r2}${suit}`;
    }
    if (type === "o") {
      const [s1, s2] = pickTwoDifferentSuits();
      return `${r1}${s1}${r2}${s2}`;
    }
  }

  return normalizedHand;
}

function pickRandomSuit(): string {
  return SUITS[Math.floor(Math.random() * SUITS.length)];
}

function pickTwoDifferentSuits(): [string, string] {
  const idx1 = Math.floor(Math.random() * SUITS.length);
  let idx2 = Math.floor(Math.random() * (SUITS.length - 1));
  if (idx2 >= idx1) idx2 += 1;
  return [SUITS[idx1], SUITS[idx2]];
}
