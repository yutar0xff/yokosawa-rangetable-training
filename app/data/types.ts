export type RangeCategory =
  | "rangeA" // ☆8: 最も強い（濃紺色 - 8人(強)相当）
  | "rangeB" // ☆7: 強い（赤色 - 8人(中)相当）
  | "rangeC" // ☆6: やや強い（黄色 - 8人(弱)相当）
  | "rangeD" // ☆5: 中程度（緑色 - 6~7人相当）
  | "rangeE" // ☆4: やや弱い（水色 - 4~5人相当）
  | "rangeF" // ☆3: 弱い（白色 - 3人相当）
  | "rangeG" // ☆2: 特殊条件（紫枠 - 2人相当）
  | "rangeH" // ☆1: 特殊条件（桃色 - BBのみBTNのレイズにコール）
  | "rangeI"; // ☆0: フォールド（灰色）

export const STAR_TO_RANGE: Record<number, RangeCategory> = {
  8: "rangeA",
  7: "rangeB",
  6: "rangeC",
  5: "rangeD",
  4: "rangeE",
  3: "rangeF",
  2: "rangeG",
  1: "rangeH",
  0: "rangeI",
};

export const RANGE_TO_STAR: Record<RangeCategory, number> = {
  rangeA: 8,
  rangeB: 7,
  rangeC: 6,
  rangeD: 5,
  rangeE: 4,
  rangeF: 3,
  rangeG: 2,
  rangeH: 1,
  rangeI: 0,
};

export const RANGE_COLORS: Record<RangeCategory, string> = {
  rangeA: "bg-blue-700 text-white", // 柔らかい濃紺
  rangeB: "bg-rose-500 text-white", // 柔らかい赤
  rangeC: "bg-amber-400 text-black", // 柔らかい黄
  rangeD: "bg-emerald-500 text-white", // 柔らかい緑
  rangeE: "bg-sky-400 text-black", // 柔らかい水色
  rangeF: "bg-gray-50 border border-gray-300 text-gray-700", // 柔らかい白
  rangeG: "bg-gray-50 border-2 border-violet-500 text-violet-700", // 柔らかい紫枠
  rangeH: "bg-pink-200 text-pink-900", // 柔らかい桃色
  rangeI: "bg-gray-300 text-gray-700", // 柔らかい灰
};

export interface HandStat {
  hand: string; // "AA", "AKs" など
  correctCount: number; // 正解数
  totalCount: number; // 出題総数
  lastReviewed: number; // 最終学習日時 (timestamp)
  consecutiveCorrect: number; // 連続正解数
}

export type RangeTable = Record<string, RangeCategory>;

// フラッシュカードモード用の型定義
export type GameState = "playing" | "feedback" | "finished";

export interface Question {
  hand: string;
  correctRange: RangeCategory;
}
