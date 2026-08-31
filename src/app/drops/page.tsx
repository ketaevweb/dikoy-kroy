import Link from "next/link";
import { drops, productsByDrop, totalStock } from "@/lib/data";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata = {
  title: "Дропы",
  description:
    "История коллекций «Дикого кроя»: что вышло, что распродано, что дораспродаётся.",
};

export default function DropsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Дропы
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
        Мы не держим склад: каждая коллекция выходит ограниченной партией и
        живёт, пока есть размеры. История дропов ниже — это дневник бренда:
        что-то распродано за неделю, что-то дораспродаётся из архива.
      </p>

      <div className="mt-8 space-y-6">
        {drops.map((drop) => {
          const items = productsByDrop(drop.id);
          const stock = items.reduce((s, p) => s + totalStock(p), 0);
          return (
            <Link
              key={drop.id}
              href={`/drops/${drop.id}`}
              className="block rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg sm:p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-bold uppercase tracking-tight sm:text-xl">
                  {drop.name}
                </h2>
                <p className="text-sm text-zinc-500">
                  Вышел {new Date(drop.releasedAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">
                {drop.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700">
                  {items.length} моделей
                </span>
                <span
                  className={`rounded-full px-3 py-1 ${
                    stock === 0
                      ? "bg-zinc-100 text-zinc-500"
                      : stock <= 20
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {stock === 0
                    ? "полностью распродан"
                    : `в наличии ~${stock} шт`}
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-700">
                  {drop.status === "current" ? "текущий дроп" : "архив"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 max-w-md">
        <SubscribeForm source="drops-page" />
        <p className="mt-2 text-xs text-zinc-400">
          Один короткий письмец при выходе нового дропа. Без спама.
        </p>
      </div>
    </div>
  );
}
