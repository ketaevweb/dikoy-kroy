import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, productsByCategory, type Category } from "@/lib/data";
import { categorySeo } from "@/lib/seo";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: "Категория не найдена" };
  const seo = categorySeo(category);
  if (!seo) return { title: cat.title };
  return {
    title: { absolute: seo.title },
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();
  const seo = categorySeo(category);

  const items = productsByCategory(cat.slug as Category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="text-sm text-zinc-500">
        <Link href="/catalog" className="hover:text-zinc-900">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{cat.title}</span>
      </nav>

      <h1 className="mt-6 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        {cat.title}
      </h1>

      {seo && (
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600">
          {seo.intro}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
          <Link
            key={c.slug}
            href={`/catalog/${c.slug}`}
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900"
          >
            {c.title}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="mt-10 text-zinc-500">
          В этой категории пока пусто — загляните в{" "}
          <Link href="/drops" className="underline underline-offset-4">
            историю дропов
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
