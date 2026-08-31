"use client";

// Таймер до выхода следующего дропа. Цифры рисуем только после монтирования,
// чтобы SSR и клиент совпали (без hydration-мисматча).

import { useEffect, useState } from "react";

type TimeLeft = { d: number; h: number; m: number; s: number };

function diffToTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff % 86_400_000) / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1000),
  };
}

export default function DropCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const left = diffToTimeLeft(target);
      setTimeLeft(left);
      if (left.d + left.h + left.m + left.s === 0) setExpired(true);
    };
    // Первый кадр — через rAF: без синхронного setState внутри эффекта
    const raf = requestAnimationFrame(tick);
    const timer = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [targetDate]);

  if (expired) {
    return (
      <p className="font-display text-xl font-bold uppercase tracking-tight text-amber-600">
        Дроп уже вышел — ловите размеры!
      </p>
    );
  }

  const cells = [
    { val: timeLeft?.d, label: "дней" },
    { val: timeLeft?.h, label: "часов" },
    { val: timeLeft?.m, label: "минут" },
    { val: timeLeft?.s, label: "секунд" },
  ];

  return (
    <div className="flex gap-3 sm:gap-5" role="timer" aria-label="До выхода дропа осталось">
      {cells.map((t) => (
        <div key={t.label} className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white sm:h-20 sm:w-20">
            <span className="font-display text-2xl font-bold tabular-nums text-zinc-900 sm:text-3xl">
              {t.val === null ? "—" : String(t.val).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {t.label}
          </div>
        </div>
      ))}
    </div>
  );
}
