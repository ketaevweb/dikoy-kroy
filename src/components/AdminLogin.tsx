"use client";

// Форма входа в админку (пароль из ADMIN_PASSWORD → HttpOnly-cookie).
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      window.location.reload();
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-display text-xl font-bold uppercase tracking-tight">
        Админка
      </h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          aria-label="Пароль админки"
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition-colors focus:border-zinc-900"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
        >
          {loading ? "Проверяем..." : "Войти"}
        </button>
        {error && (
          <p className="text-sm text-red-600">Неверный пароль</p>
        )}
      </form>
    </div>
  );
}
