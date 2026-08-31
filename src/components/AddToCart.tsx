"use client";

// Блок покупки: выбор размера, остатки как маркетинг, таблица размеров.
// Дефицит-баннер, sold-out размеры видны, но зачёркнуты, бейджи ≤3 шт.

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import type { Product, Size } from "@/lib/data";
import { stockOfSize, totalStock } from "@/lib/data";
import SubscribeForm from "./SubscribeForm";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  // Производные значения — не хранятся, а вычисляются
  const total = totalStock(product);
  const selectedStock = size ? stockOfSize(product, size) : null;
  const soldOut = total === 0;

  function handleAdd() {
    if (!size) {
      setError("Выберите размер");
      return;
    }
    if (stockOfSize(product, size) === 0) {
      setError("Этого размера нет в партии");
      return;
    }
    setError("");
    addItem(
      { productId: product.id, size, price: product.price },
      stockOfSize(product, size)
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <section className="mt-8 space-y-6 border-t border-zinc-200 pt-8">
      {/* Дефицит-баннер */}
      {total > 0 && total <= 10 && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Партия заканчивается — осталось {total} шт. Следующий дроп с этой
          моделью не скоро.
        </p>
      )}
      {soldOut && (
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          Партия распродана. Оставьте почту — напишем, когда модель вернётся в
          одном из следующих дропов.
        </p>
      )}

      {/* Выбор размера */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Размер</h2>
          <details className="relative">
            <summary className="cursor-pointer list-none text-sm text-zinc-500 underline underline-offset-4 hover:text-zinc-900">
              Таблица размеров
            </summary>
            <div className="absolute right-0 top-8 z-10 w-72 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-500">
                    <th className="pb-1">Размер</th>
                    <th className="pb-1">Грудь</th>
                    <th className="pb-1">Талия</th>
                    <th className="pb-1">Бёдра</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(product.sizeChart).map(([s, m]) => (
                    <tr key={s} className="border-t border-zinc-100">
                      <td className="py-1.5 font-semibold">{s}</td>
                      <td>{m.chest}</td>
                      <td>{m.waist}</td>
                      <td>{m.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-zinc-400">Мерки в сантиметрах</p>
            </div>
          </details>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.stock.map((s) => (
            <button
              key={s.size}
              onClick={() => {
                if (s.stock > 0) {
                  setSize(s.size);
                  setError("");
                }
              }}
              disabled={s.stock === 0}
              aria-pressed={size === s.size}
              className={`relative h-14 w-14 rounded-xl border font-semibold transition-colors ${
                s.stock === 0
                  ? "cursor-not-allowed border-zinc-200 text-zinc-300 line-through"
                  : size === s.size
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 text-zinc-900 hover:border-zinc-600"
              }`}
            >
              {s.size}
              {s.stock > 0 && s.stock <= 3 && (
                <span className="absolute -right-1.5 -top-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {s.stock}
                </span>
              )}
            </button>
          ))}
        </div>

        {size && selectedStock !== null && (
          <p className="mt-2 text-sm text-zinc-500">
            {selectedStock > 0
              ? `Доступно к заказу: ${selectedStock} шт.`
              : "Этого размера нет в партии"}
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Цена и кнопка */}
      <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-5">
        <div>
          <p className="text-3xl font-bold">
            {product.price.toLocaleString("ru-RU")} ₽
          </p>
          <p className="mt-0.5 text-sm text-zinc-500">
            Пермь — 300 ₽ · СДЭК по России
          </p>
        </div>

        {total > 0 ? (
          <button
            onClick={handleAdd}
            className="rounded-xl bg-zinc-900 px-8 py-4 font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            {added ? "Добавлено" : "В корзину"}
          </button>
        ) : (
          <button className="cursor-not-allowed rounded-xl bg-zinc-100 px-8 py-4 font-semibold text-zinc-400">
            Sold out
          </button>
        )}
      </div>

      {added && size && (
        <Link
          href="/cart"
          className="block text-center text-sm text-zinc-700 underline underline-offset-4 hover:text-zinc-900"
        >
          Товар в корзине — перейти к оформлению →
        </Link>
      )}

      {soldOut && <SubscribeForm source={`soldout:${product.id}`} />}
    </section>
  );
}
