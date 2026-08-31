"use client";

// Галерея товара: реальное фото + AI-фото посадки на разных фигурах.
// Подпись честности: «Изображения посадки сгенерированы ИИ».

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function ProductGallery({ product }: { product: Product }) {
  const photos = [
    { src: product.mainPhoto, alt: `${product.name} — товар на манекене`, sizeLabel: "Товар" },
    ...product.fitPhotos.map((f) => ({
      src: f.src,
      alt: f.alt,
      sizeLabel: `AI · ${f.sizeLabel}`,
    })),
  ];

  const [active, setActive] = useState(0);
  const current = photos[active];
  const isAI = active > 0;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={active === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {isAI && (
          <span className="absolute left-3 top-3 rounded-full bg-zinc-900/85 px-3 py-1 text-[11px] font-semibold text-white">
            AI-изображение посадки
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {photos.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setActive(i)}
            aria-label={p.alt}
            className={cn(
              "relative h-20 w-[60px] overflow-hidden rounded-lg border-2 transition-colors sm:h-24 sm:w-[72px]",
              active === i
                ? "border-zinc-900"
                : "border-transparent opacity-70 hover:opacity-100"
            )}
          >
            <Image src={p.src} alt="" fill sizes="72px" className="object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-zinc-900/70 py-0.5 text-[9px] font-medium text-white">
              {p.sizeLabel}
            </span>
          </button>
        ))}
      </div>

      {product.fitPhotos.length > 0 && (
        <p className="text-xs leading-relaxed text-zinc-400">
          Изображения посадки сгенерированы ИИ, чтобы показать вещь на разных
          фигурах. Реальную вещь отправляем в день оплаты — при получении можно
          примерить и обменять по правилам раздела «Доставка».
        </p>
      )}
    </div>
  );
}
