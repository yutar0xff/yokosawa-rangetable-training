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
  const validRanks = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];
  if (!validRanks.includes(rank1) || !validRanks.includes(rank2)) {
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
