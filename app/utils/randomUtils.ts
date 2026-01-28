/**
 * ランダム選択に関するユーティリティ関数
 */

/**
 * 配列からランダムに1つの要素を選択する
 */
export function pickRandom<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("配列が空です");
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 配列から指定された数の要素をランダムに選択する（重複あり）
 */
export function pickRandomMultiple<T>(array: T[], count: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pickRandom(array));
  }
  return result;
}
