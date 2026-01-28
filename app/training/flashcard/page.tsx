import FlashcardSession from "./FlashcardSession";
import { loadRanges } from "@/app/utils/loadRanges";

export default async function FlashcardPage() {
  const ranges = await loadRanges();

  return <FlashcardSession ranges={ranges} />;
}
