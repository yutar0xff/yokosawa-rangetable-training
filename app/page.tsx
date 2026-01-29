import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, Swords, Github } from "lucide-react";
import { RangeGrid } from "@/app/components/RangeGrid";
import { RangeLegend } from "@/app/components/common/RangeLegend";
import { loadRanges } from "@/app/utils/loadRanges";
import { FlashcardCardWithModal } from "@/app/components/flashcard/FlashcardCardWithModal";

export default async function Home() {
  const ranges = await loadRanges();

  return (
    <div className="container max-w-7xl mx-auto p-4 min-h-screen flex flex-col justify-center space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Yokosawa RangeTable Training
        </h1>
        <p className="text-gray-500">プリフロップレンジを効率的に暗記しよう</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側: モード選択 */}
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

      {/* Footer: GitHub & Reference Video */}
      <div className="w-full space-y-6 mt-12 pb-8">
        {/* GitHub Link */}
        <div className="flex justify-center">
          <Link
            href="https://github.com/yutar0xff/yokosawa-rangetable-training"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github className="w-6 h-6" />
            <span className="text-sm font-medium">GitHubリポジトリ</span>
          </Link>
        </div>

        {/* Reference Video */}
        <div className="w-full max-w-4xl mx-auto">
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
        </div>
      </div>
    </div>
  );
}
