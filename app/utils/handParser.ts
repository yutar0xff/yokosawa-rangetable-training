import { VALID_RANKS } from "@/app/data/constants";

/**
 * ハンド文字列をカード配列に変換する
 * @param hand - ハンド文字列（例: "AA", "AKs", "T9o"）
 * @returns カードのタプル [card1, card2]
 * @throws {Error} 無効なハンド形式の場合
 */
export function parseHandToCards(hand: string): [string, string] {
  if (!hand || hand.length < 2) {
    throw new Error(`Invalid hand format: ${hand}`);
  }

  // hand: "AA", "AKs", "T9o"
  const rank1 = hand[0];
  const rank2 = hand[1];
  const type = hand.length > 2 ? hand[2] : ""; // 's' or 'o' or empty (pair)

  // ランクの検証
  if (!VALID_RANKS.includes(rank1) || !VALID_RANKS.includes(rank2)) {
    throw new Error(`Invalid rank in hand: ${hand}`);
  }

  // タイプの検証（ペアの場合は空文字、スイテッドは's'、オフスイートは'o'）
  if (hand.length > 2 && type !== "s" && type !== "o") {
    throw new Error(`Invalid hand type in: ${hand}`);
  }

  // Assign suits for display
  // Pair: different suits (e.g. s, h)
  // Suited: same suit (e.g. s, s)
  // Offsuit: different suits (e.g. s, h)

  let s1 = "s";
  let s2 = "h";

  if (type === "s") {
    s2 = "s";
  } else if (type === "") {
    // Pair
    s2 = "h";
  } else {
    // Offsuit
    s2 = "h";
  }

  return [`${rank1}${s1}`, `${rank2}${s2}`];
}

const DEFAULT_CARDS: [string, string] = ["As", "Ah"];

/**
 * 任意のハンド文字列をカード配列に変換する
 * 4文字（AsKs）、2文字（AA）、3文字（AKs）のいずれにも対応
 * @param hand - ハンド文字列
 * @returns カードのタプル [card1, card2]。無効な場合はデフォルト値を返す
 */
export function handToCards(hand: string): [string, string] {
  if (!hand || hand.length < 2) {
    return DEFAULT_CARDS;
  }
  const h = hand.trim();
  try {
    if (h.length === 4) {
      return [h.slice(0, 2), h.slice(2, 4)] as [string, string];
    }
    if (h.length === 2) {
      return [h[0] + "s", h[1] + "h"] as [string, string];
    }
    return parseHandToCards(h);
  } catch {
    return DEFAULT_CARDS;
  }
}
