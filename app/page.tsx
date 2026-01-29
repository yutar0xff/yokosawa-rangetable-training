import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, Swords, Github } from "lucide-react";
import { RangeGrid } from "@/app/components/RangeGrid";
import { RangeLegend } from "@/app/components/common/RangeLegend";
import { loadRanges } from "@/app/utils/loadRanges";
import { FlashcardCardWithModal } from "@/app/components/flashcard/FlashcardCardWithModal";

const GITHUB_URL = "https://github.com/yutar0xff/yokosawa-rangetable-training";
const X_URL = "https://x.com/yutar0xff";

/** X（旧Twitter）の最新ロゴ */
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  );
}

function SocialIcons({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Link
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="GitHubリポジトリ"
      >
        <Github className="w-6 h-6" />
      </Link>
      <Link
        href={X_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="作者のX"
      >
        <XLogo className="w-5 h-5" />
      </Link>
    </div>
  );
}

function ReferenceVideoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-center">参考動画</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/NDouTGvor-k"
            title="参考動画"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function Home() {
  const ranges = await loadRanges();

  return (
    <div className="container max-w-7xl mx-auto p-4 min-h-screen flex flex-col justify-center space-y-8">
      {/* ヘッダー: タイトル＋横長時は右上に GitHub/X */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-center lg:text-left space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Yokosawa RangeTable Training
          </h1>
          <p className="text-gray-500">
            プリフロップレンジを効率的に暗記しよう（非公式）
          </p>
        </div>
        <div className="hidden lg:flex">
          <SocialIcons />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* 左側: モード選択（横長時は参考動画も） */}
        <div className="space-y-4">
          {/* Flashcard Mode */}
          <FlashcardCardWithModal />

          {/* Grid Fill Mode */}
          <Link href="/training/grid" className="block">
            <Card className="hover:border-black transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">塗り絵モード</CardTitle>
                <Grid3X3 className="w-6 h-6 text-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  レンジ表を自分で塗って、記憶の正確さをチェック。
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Scenario Mode */}
          {process.env.NODE_ENV === "production" ? (
            <div className="block">
              <Card className="opacity-50 cursor-not-allowed relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl">シナリオモード</CardTitle>
                  <Swords className="w-6 h-6 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    状況（人数）に応じて、参加するか降りるかを実践的に判断。
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-2 bg-gray-200 text-gray-600 border-gray-300"
                  >
                    Coming Soon
                  </Badge>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Link href="/training/scenario" className="block">
              <Card className="hover:border-black transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl">シナリオモード</CardTitle>
                  <Swords className="w-6 h-6 text-red-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    状況（人数）に応じて、参加するか降りるかを実践的に判断。
                  </p>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* 横長: 左カラムに参考動画 */}
          <div className="hidden lg:block">
            <ReferenceVideoCard />
          </div>
        </div>

        {/* 右側: レンジテーブルと色・星の対応 */}
        <div className="space-y-4">
          {/* 色と星の対応表 */}

          {/* レンジテーブル */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">レンジテーブル</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="w-full overflow-x-auto">
                <div className="flex justify-center min-w-fit">
                  <RangeGrid ranges={ranges} showLabels={true} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">色と星の対応</CardTitle>
            </CardHeader>
            <CardContent>
              <RangeLegend variant="list" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 縦長のみ: 参考動画＋その下に GitHub/X アイコン */}
      <div className="w-full space-y-6 mt-12 pb-8 lg:hidden">
        <div className="w-full max-w-4xl mx-auto">
          <ReferenceVideoCard />
        </div>
        <div className="flex justify-center gap-4">
          <SocialIcons />
        </div>
      </div>
    </div>
  );
}
