import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-display text-6xl font-bold text-zinc-200">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight">
        Такого нет — и уже не будет
      </h1>
      <p className="mx-auto mt-3 max-w-md text-zinc-600">
        Как и вещь из распроданной партии: страница не найдена. Загляните в
        текущий дроп — там всё ещё можно успеть.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/catalog"
          className="rounded-xl bg-zinc-900 px-7 py-3.5 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          В каталог
        </Link>
        <Link
          href="/drops"
          className="rounded-xl border border-zinc-300 px-7 py-3.5 text-sm font-semibold hover:border-zinc-900"
        >
          История дропов
        </Link>
      </div>
    </div>
  );
}
