import { useState, useEffect } from "react";

/**
 * クライアントでマウント済みかどうかを返すフック。
 * SSR や createPortal など document が必要な処理の前に使う。
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
