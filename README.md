# Yokosawa RangeTable Training

ポーカーのプリフロップレンジを効率的に暗記するためのトレーニングアプリです。

## 機能

### 1. 単語帳モード (Flashcard)
ハンドを見て、その強さ（色・星）を即座に答えるトレーニングです。正解・不正解が記録され、苦手なハンドを重点的に復習できます。

### 2. 塗り絵モード (Grid Fill)
レンジ表を自分で塗って、記憶の正確さをチェックするモードです。色を選択してグリッドを塗りつぶし、正解と比較して採点できます。

### 3. シナリオモード (Scenario)
具体的な状況（リングゲームやトーナメント）とハンドが提示され、参加（Play）するか降りる（Fold）かを実践的に判断するモードです。

## 技術スタック

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## セットアップ手順

```bash
# リポジトリのクローン
git clone https://github.com/yutar0xff/yokosawa-rangetable-training.git

# ディレクトリへの移動
cd yokosawa-rangetable-training

# 依存関係のインストール
npm install
# または
pnpm install
# または
yarn install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## リンク

- **GitHubリポジトリ**: [https://github.com/yutar0xff/yokosawa-rangetable-training](https://github.com/yutar0xff/yokosawa-rangetable-training)
- **参考動画**: [https://youtu.be/NDouTGvor-k?si=YsoZK_5_55azBu05](https://youtu.be/NDouTGvor-k?si=YsoZK_5_55azBu05)

## ライセンス

このプロジェクトは非公式のトレーニングアプリです。世界のヨコサワチャンネルおよび関連する公式プロジェクトとは関係ありません。
