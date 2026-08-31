import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/data";
import { totalStock } from "@/lib/data";

// Карточка в каталоге: бейдж остатков — маркетинг дефицита прямо в сетке
export default function ProductCard({ product }: { product: Product }) {
  const stock = totalStock(product);
  const soldOut = stock === 0;
  const low = !soldOut && stock <= 5;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50">
        <Image
          src={product.mainPhoto}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              Sold out
            </span>
          </div>
        )}
        {!soldOut && low && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            Осталось {stock} шт
          </span>
        )}
        {!soldOut && stock <= 10 && stock > 5 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-amber-700 shadow-sm">
            Партия заканчивается
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline justify-between">
          <p className="text-lg font-bold">{product.price.toLocaleString("ru-RU")} ₽</p>
          <p className={soldOut ? "text-xs text-zinc-400" : "text-xs text-zinc-500"}>
            {soldOut ? "ждём следующий дроп" : `${stock} шт в партии`}
          </p>
        </div>
      </div>
    </Link>
  );
}
