/**
 * アプリケーション全体で使用する定数
 */

// フラッシュカードモード
export const QUESTIONS_PER_SET = 10;

// カードサイズ
export const CARD_SIZES = {
  SMALL: { width: 60, height: 84 },
  LARGE: { width: 180, height: 252 },
} as const;

// UI関連
export const FEEDBACK_DELAY_MS = 800; // 正解時の自動進行までの遅延時間（ミリ秒）
