// Клиентская аналитика: внутренние события воронки (/api/track, best-effort)
// + цели Яндекс Метрики (если задан NEXT_PUBLIC_YM_ID). Ничего не бросает и
// не блокирует интерфейс — аналитика не должна ломать покупки.

export function trackEvent(name: string) {
  if (typeof window === "undefined") return;

  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // аналитика не должна ломать UX
  }

  try {
    const w = window as unknown as {
      ym?: (id: number, op: string, goal: string) => void;
    };
    const ymId = process.env.NEXT_PUBLIC_YM_ID;
    if (ymId && typeof w.ym === "function") {
      w.ym(Number(ymId), "reachGoal", name);
    }
  } catch {
    // ignore
  }
}
