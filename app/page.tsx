import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Grid3X3, Swords } from "lucide-react";
import path from "path";
import { promises as fs } from "fs";
import { RangeGrid } from "@/app/components/RangeGrid";
import { RangeTable, STAR_TO_RANGE, RANGE_COLORS } from "@/app/data/types";

export default async function Home() {
  // Load ranges data
  const jsonPath = path.join(process.cwd(), "public", "data", "ranges.json");
  const fileContents = await fs.readFile(jsonPath, "utf8");
  const ranges: RangeTable = JSON.parse(fileContents);

  return (
    <div className="container max-w-7xl mx-auto p-4 min-h-screen flex flex-col justify-center space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Yokosawa Range Training
        </h1>
        <p className="text-gray-500">プリフロップレンジを効率的に暗記しよう</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側: モード選択 */}
        <div className="space-y-4">
          {/* Flashcard Mode */}
          <Link href="/training/flashcard" className="block">
            <Card className="hover:border-black transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">単語帳モード</CardTitle>
                <Brain className="w-6 h-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  ハンドを見て、その強さ（色・星）を即座に答えるトレーニング。
                </p>
              </CardContent>
            </Card>
          </Link>

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
              <div className="space-y-2">
                {Object.entries(STAR_TO_RANGE)
                  .reverse()
                  .map(([starStr, category]) => (
                    <div
                      key={category}
                      className={`flex items-center gap-3 p-2 rounded text-sm ${RANGE_COLORS[category]}`}
                    >
                      <span className="font-bold w-8">☆{starStr}</span>
                      <span className="font-medium">{category}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400">
        © Worlds Yokosawa RangeTable Training App
      </div>
    </div>
  );
}
