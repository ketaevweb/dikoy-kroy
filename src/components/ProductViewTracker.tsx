"use client";

// Трекер просмотра карточки товара — событие product_view для воронки.
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackEvent("product_view");
  }, [productId]);
  return null;
}
