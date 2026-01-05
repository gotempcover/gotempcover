"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh() {
  const router = useRouter();
  const tries = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tries.current += 1;
      if (tries.current > 6) {
        clearInterval(id);
        return;
      }
      router.refresh();
    }, 2500);

    return () => clearInterval(id);
  }, [router]);

  return null;
}
