import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  products,
  getProduct,
  getDrop,
  CATEGORIES,
  totalStock,
} from "@/lib/data";
import ProductGallery from "@/components/ProductGallery";
import AddToCart from "@/components/AddToCart";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "Товар не найден" };
  return {
    title: `${product.name} — ${product.price.toLocaleString("ru-RU")} ₽`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const drop = getDrop(product.dropId);
  const cat = CATEGORIES.find((c) => c.slug === product.category);
  const stock = totalStock(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-zinc-500">
        <Link href="/catalog" className="hover:text-zinc-900">
          Каталог
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/catalog/${product.category}`}
          className="hover:text-zinc-900"
        >
          {cat?.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Левая колонка: галерея */}
        <ProductGallery product={product} />

        {/* Правая колонка: информация + покупка */}
        <div>
          {drop && (
            <Link
              href={`/drops/${drop.id}`}
              className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 hover:underline"
            >
              {drop.name}
            </Link>
          )}
          <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            {product.description}
          </p>

          <AddToCart product={product} />

          {/* Ткань и уход */}
          <section className="mt-8 space-y-4 border-t border-zinc-200 pt-8">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
                Ткань
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {product.fabric}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
                Уход
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {product.careNote}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
                Доставка
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                Самовывоз в Перми — бесплатно, курьер по Перми — 300 ₽, СДЭК по
                России — рассчитает менеджер. Отправляем в день оплаты.{" "}
                <Link href="/delivery" className="underline underline-offset-4">
                  Подробно о доставке и возврате →
                </Link>
              </p>
            </div>
          </section>

          {/* Полная размерная таблица */}
          <section className="mt-8 border-t border-zinc-200 pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Размерная сетка, см
            </h2>
            <table className="mt-3 w-full max-w-md text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th className="py-1.5">Размер</th>
                  <th className="py-1.5">Грудь</th>
                  <th className="py-1.5">Талия</th>
                  <th className="py-1.5">Бёдра</th>
                  <th className="py-1.5">В наличии</th>
                </tr>
              </thead>
              <tbody>
                {product.stock.map((s) => (
                  <tr key={s.size} className="border-t border-zinc-100">
                    <td className="py-1.5 font-semibold">{s.size}</td>
                    <td>{product.sizeChart[s.size].chest}</td>
                    <td>{product.sizeChart[s.size].waist}</td>
                    <td>{product.sizeChart[s.size].hips}</td>
                    <td
                      className={
                        s.stock === 0
                          ? "text-zinc-400 line-through"
                          : s.stock <= 3
                            ? "font-semibold text-amber-600"
                            : "text-zinc-600"
                      }
                    >
                      {s.stock === 0 ? "нет" : `${s.stock} шт`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stock > 0 && stock <= 10 && (
              <p className="mt-3 text-xs text-amber-700">
                Партия {stock} шт — когда закончится, модель не повторится в
                этом виде.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
