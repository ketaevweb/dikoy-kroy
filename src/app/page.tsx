import Link from "next/link";
import Image from "next/image";
import {
  currentDrop,
  productsByDrop,
  getProduct,
  BRAND,
} from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const drop = currentDrop();
  const items = productsByDrop(drop.id);
  const example = getProduct("kolibri");

  return (
    <div>
      {/* Хиро: текущий дроп */}
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              {drop.name} · уже в продаже
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              Спортивная одежда малыми партиями
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-600">
              {drop.description} Каждая партия — мини-коллекция: распродали — не
              повторяем. Поэтому решение принимается сейчас, а не «подумаю и
              куплю потом».
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/drops/${drop.id}`}
                className="rounded-xl bg-zinc-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
              >
                Смотреть дроп
              </Link>
              <Link
                href="/drops"
                className="rounded-xl border border-zinc-300 px-7 py-3.5 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-900"
              >
                История дропов
              </Link>
            </div>
            <p className="mt-5 text-sm text-zinc-500">
              {BRAND.city} · самовывоз и курьер · СДЭК по России · предоплата по
              СБП
            </p>
          </div>
          {example && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200">
                <Image
                  src={example.mainPhoto}
                  alt={example.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              {example.fitPhotos[1] && (
                <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200">
                  <Image
                    src={example.fitPhotos[1].src}
                    alt={example.fitPhotos[1].alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-700">
                    одна вещь — разные фигуры
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Товары текущего дропа */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight sm:text-2xl">
            {drop.name}
          </h2>
          <Link
            href={`/drops/${drop.id}`}
            className="text-sm text-zinc-500 underline underline-offset-4 hover:text-zinc-900"
          >
            вся коллекция →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Механика дроп-модели */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight sm:text-2xl">
            Почему малые партии
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="font-display text-3xl font-bold text-amber-600">01</p>
              <h3 className="mt-3 font-semibold">Дефицит — не маркетинг, а факт</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Партия — 15–20 штук на размерную сетку. Счётчик на карточке
                показывает реальные остатки; распродано — модель не повторяется.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="font-display text-3xl font-bold text-amber-600">02</p>
              <h3 className="mt-3 font-semibold">Каждый дроп — мини-коллекция</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Модели объединены историей: акварельные звери, цветы, надписи.
                Вещи сочетаются между собой внутри капсулы.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="font-display text-3xl font-bold text-amber-600">03</p>
              <h3 className="mt-3 font-semibold">Быстрая обратная связь</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Партия распродана за неделю — шьём похожее. Зависла — меняем
                фасон. Поэтому каждый следующий дроп точнее попадает в спрос.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI-посадка */}
      {example && example.fitPhotos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="grid grid-cols-2 gap-3">
              {example.fitPhotos.map((f) => (
                <div
                  key={f.src}
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200"
                >
                  <Image
                    src={f.src}
                    alt={f.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-700">
                    {f.sizeLabel}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                Как сядет на тебя?
              </p>
              <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-tight sm:text-2xl">
                Каждая вещь на разных фигурах — до покупки
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                Леггинсы и свитшоты сидят по-разному на фигуре 44 и фигуре 50 —
                и лучше увидеть это до заказа, чем на примерке. На карточке
                каждой модели — фото посадки на двух типах фигур с подписью
                размера. Изображения сгенерированы ИИ по фотографиям реальной
                вещи, сам товар едет к вам ровно таким, как на первом фото.
              </p>
              <Link
                href={`/product/${example.id}`}
                className="mt-5 inline-block rounded-xl border border-zinc-900 px-6 py-3 text-sm font-semibold transition-colors hover:bg-zinc-900 hover:text-white"
              >
                Пример: свитшот «Колибри» →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
