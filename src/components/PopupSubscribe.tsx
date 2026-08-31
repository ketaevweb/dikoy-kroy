"use client";

// Pop-up подписки: через 10 секунд или при уходе курсора за верхнюю границу
// (exit intent). Показываем один раз за сессию, после подписки/закрытия —
// больше не показываем никогда (localStorage). Взамен почты — промокод
// FIRST10 на первый заказ.

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const DONE_KEY = "dk_popup_done";
const SEEN_KEY = "dk_popup_seen";
const SHOW_DELAY_MS = 10_000;
const SKIP_PATHS = ["/checkout", "/cart", "/admin"];

export default function PopupSubscribe() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [copied, setCopied] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DONE_KEY, "1");
    } catch {}
  }, []);

  const tryShow = useCallback(() => {
    try {
      if (localStorage.getItem(DONE_KEY)) return;
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}
    setVisible(true);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (SKIP_PATHS.some((p) => pathname.startsWith(p))) return;

    const timer = setTimeout(tryShow, SHOW_DELAY_MS);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) tryShow();
    };
    document.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [pathname, tryShow]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "popup" }),
      });
      const data = (await res.json()) as { ok: boolean };
      if (!res.ok || !data.ok) throw new Error();
      setState("done");
      trackEvent("email_signup");
      try {
        localStorage.setItem(DONE_KEY, "1");
      } catch {}
    } catch {
      setState("error");
    }
  }

  function copyCode() {
    try {
      navigator.clipboard.writeText("FIRST10").then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {}
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Подписка на анонс дропа"
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
    >
      <button
        onClick={dismiss}
        aria-label="Закрыть"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
      >
        ✕
      </button>

      {state === "done" ? (
        <div>
          <p className="font-display text-lg font-bold uppercase tracking-tight">
            Промокод — ваш
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 rounded-xl border border-dashed border-amber-400 bg-amber-50 px-4 py-3 text-center font-display text-lg font-bold tracking-widest text-amber-700">
              FIRST10
            </code>
            <button
              onClick={copyCode}
              className="shrink-0 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
            >
              {copied ? "✓" : "Копировать"}
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Введите его при оформлении заказа — скидка −10% применится
            автоматически. Анонс следующего дропа придёт на почту.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
            Первым — скидка
          </p>
          <p className="mt-2 font-display text-lg font-bold uppercase leading-snug tracking-tight">
            −10% на первый заказ
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Оставьте почту — пришлём промокод и короткий анонс следующего
            дропа. Один письмец, без спама.
          </p>
          <form onSubmit={submit} className="mt-4 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваша почта"
              aria-label="Email для промокода"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition-colors focus:border-zinc-900"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="shrink-0 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
            >
              {state === "loading" ? "..." : "Получить"}
            </button>
          </form>
          {state === "error" && (
            <p className="mt-2 text-sm text-red-600">
              Проверьте адрес почты и попробуйте ещё раз
            </p>
          )}
        </>
      )}
    </div>
  );
}
