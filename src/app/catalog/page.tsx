import Link from "next/link";
import { CATEGORIES, products, totalStock } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Каталог",
  description:
    "Все модели «Дикого кроя»: свитшоты, худи, лонгсливы и футболки малыми партиями.",
};

export default function CatalogPage() {
  const inStock = products.filter((p) => totalStock(p) > 0);
  const soldOut = products.filter((p) => totalStock(p) === 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Каталог
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
        Всё, что сейчас существует в природе. Остатки на карточках — реальные:
        партия ограничена, и когда размер выкупят, он исчезнет до следующего
        дропа.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/catalog/${c.slug}`}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
          >
            {c.title}
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-bold uppercase tracking-tight text-zinc-900">
        В наличии
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {inStock.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {soldOut.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-lg font-bold uppercase tracking-tight text-zinc-400">
            Распродано — ждём повтор
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {soldOut.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
