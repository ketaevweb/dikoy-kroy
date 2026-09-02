import Link from "next/link";
import { BRAND } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-base font-bold uppercase tracking-tight text-zinc-900">
            {BRAND.name}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            {BRAND.tagline}. Шьём в {BRAND.city} ограниченными партиями:
            распродано — значит распродано.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">Разделы</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-500">
            <li><Link href="/catalog" className="hover:text-zinc-900">Каталог</Link></li>
            <li><Link href="/drops" className="hover:text-zinc-900">Дропы</Link></li>
            <li><Link href="/delivery" className="hover:text-zinc-900">Доставка и возврат</Link></li>
            <li><Link href="/about" className="hover:text-zinc-900">О бренде</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">Связаться</p>
          <ul className="mt-2 space-y-1.5 text-sm text-zinc-500">
            <li>{BRAND.phone}</li>
            <li>
              <a href={BRAND.whatsapp} className="hover:text-zinc-900" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              {" · "}
              <a href={BRAND.telegram} className="hover:text-zinc-900" target="_blank" rel="noreferrer">
                Telegram
              </a>
            </li>
            <li>{BRAND.email}</li>
            <li className="pt-2 text-xs">Оплата: перевод по СБП · предоплата 100%</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} {BRAND.name}. Все модели выпускаются
        ограниченными партиями. Демо-проект портфолио веб-разработчика —{" "}
        <a
          href="https://kataevweb.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-zinc-600"
        >
          kataevweb.ru
        </a>
        : бренд, товары, контакты и цены — вымышленные.
      </div>
    </footer>
  );
}
