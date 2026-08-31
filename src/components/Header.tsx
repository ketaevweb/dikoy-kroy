"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/drops", label: "Дропы" },
  { href: "/delivery", label: "Доставка" },
  { href: "/about", label: "О бренде" },
];

export default function Header() {
  const { count, hydrated } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-display text-lg font-bold uppercase tracking-tight text-zinc-900"
          onClick={() => setOpen(false)}
        >
          Дикий&nbsp;крой
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900",
                pathname.startsWith(n.href) && "text-zinc-900 underline underline-offset-8"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="Корзина"
            className="relative rounded-full p-2 transition-colors hover:bg-zinc-100"
          >
            <ShoppingBag className="h-5 w-5" />
            {hydrated && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className="rounded-full p-2 hover:bg-zinc-100 md:hidden"
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-zinc-100 bg-white px-4 py-3 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-base font-medium text-zinc-700 hover:bg-zinc-50"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
