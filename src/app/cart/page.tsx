"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { getProduct } from "@/lib/data";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, total, count, hydrated } = useCart();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-8 w-40 animate-pulse rounded bg-zinc-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Корзина пуста
        </h1>
        <p className="mx-auto mt-3 max-w-md text-zinc-600">
          Партии маленькие и разбирают быстро — загляните в текущий дроп, пока
          есть ваши размеры.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-xl bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Корзина
      </h1>

      <ul className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
        {items.map((item) => {
          const product = getProduct(item.productId);
          if (!product) return null;
          return (
            <li
              key={`${item.productId}-${item.size}`}
              className="flex gap-4 py-5"
            >
              <Link
                href={`/product/${product.id}`}
                className="relative h-28 w-[84px] shrink-0 overflow-hidden rounded-xl border border-zinc-200"
              >
                <Image
                  src={product.mainPhoto}
                  alt={product.name}
                  fill
                  sizes="84px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${product.id}`}
                      className="font-semibold hover:underline hover:underline-offset-4"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-500">
                      Размер {item.size}
                      {item.qty > 1 && ` · ${item.qty} шт`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    aria-label="Убрать из корзины"
                    className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-auto text-lg font-bold">
                  {(item.price * item.qty).toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-baseline justify-between">
        <p className="text-zinc-600">
          Позиций: {count}
          <span className="ml-2 text-sm text-zinc-400">
            (один размер — одна строка)
          </span>
        </p>
        <p className="text-2xl font-bold">{total.toLocaleString("ru-RU")} ₽</p>
      </div>
      <p className="mt-1 text-right text-sm text-zinc-500">
        Доставка рассчитывается при оформлении
      </p>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <Link
          href="/catalog"
          className="rounded-xl border border-zinc-300 px-6 py-3.5 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-900"
        >
          Продолжить покупки
        </Link>
        <Link
          href="/checkout"
          className="rounded-xl bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          Оформить заказ
        </Link>
      </div>
    </div>
  );
}
