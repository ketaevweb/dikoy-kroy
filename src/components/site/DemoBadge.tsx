"use client";

import { usePathname } from "next/navigation";

/**
 * Плашка «Демо → kataevweb.ru»: этот сайт — демо-кейс из портфолио
 * веб-разработчика Егора Катаева. Клик ведёт на kataevweb.ru.
 * В админ-панели не показывается.
 */
export function DemoBadge() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href="https://kataevweb.ru"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Демо-сайт. Разработка сайтов — kataevweb.ru"
      className="fixed bottom-3 right-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-zinc-950/85 px-3.5 py-2 text-xs font-semibold text-zinc-100 shadow-[0_4px_16px_rgba(0,0,0,0.25)] backdrop-blur transition-colors hover:border-emerald-400/50 hover:text-emerald-300"
    >
      Демо
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      kataevweb.ru
    </a>
  );
}
