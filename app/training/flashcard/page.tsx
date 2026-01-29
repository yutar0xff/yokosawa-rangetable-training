import FlashcardSession from "./FlashcardSession";
import { loadRanges } from "@/app/utils/loadRanges";
import type { FlashcardMode } from "@/app/data/types";

type FlashcardPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function FlashcardPage({
  searchParams,
}: FlashcardPageProps) {
  const ranges = await loadRanges();
  const params = await searchParams;
  const mode: FlashcardMode = params.mode === "weak" ? "weak" : "random";

  return <FlashcardSession ranges={ranges} mode={mode} />;
}
