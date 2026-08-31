"use client";

// «Узнать о поступлении» на распроданной модели: email → RestockRequest.
// Это не просто удобство — это замер спроса под будущую партию: владелец
// видит в админке, сколько людей ждут вещь, ещё до того, как шить.

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export default function RestockForm({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMessage("Проверьте адрес почты");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });
      const data = (await res.json()) as { ok: boolean };
      if (!res.ok || !data.ok) throw new Error();
      setState("done");
      trackEvent("restock_signup");
    } catch {
      setState("error");
      setMessage("Не получилось. Попробуйте ещё раз или напишите в WhatsApp.");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Записали! Напишем на почту, когда «{productName}» вернётся в одном из
        следующих дропов.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <label className="text-sm font-medium text-zinc-700">
        Узнать о поступлении
      </label>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ваша почта"
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition-colors focus:border-zinc-900"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 rounded-xl border border-zinc-900 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white disabled:opacity-60"
        >
          {state === "loading" ? "..." : "Записаться"}
        </button>
      </div>
      {state === "error" && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}
