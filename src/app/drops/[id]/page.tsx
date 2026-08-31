import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { drops, getDrop, productsByDrop, totalStock } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return drops.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const drop = getDrop(id);
  if (!drop) return { title: "Дроп не найден" };
  return { title: drop.name, description: drop.description };
}

export default async function DropPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drop = getDrop(id);
  if (!drop) notFound();

  const items = productsByDrop(drop.id);
  const stock = items.reduce((s, p) => s + totalStock(p), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="text-sm text-zinc-500">
        <Link href="/drops" className="hover:text-zinc-900">
          Дропы
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{drop.name}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            {drop.name}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              drop.status === "current"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {drop.status === "current" ? "в продаже" : "архив"}
          </span>
        </div>
        <p className="mt-4 text-base leading-relaxed text-zinc-600">
          {drop.description}
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          Вышел{" "}
          {new Date(drop.releasedAt).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {" · "}
          {items.length} моделей
          {" · "}
          {stock === 0
            ? "полностью распродан"
            : `осталось ~${stock} шт по всем размерам`}
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
