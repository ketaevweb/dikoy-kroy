// Подписка на анонс дропа: email → SQLite (best effort), иначе → Telegram
// владельцу. Список подписчиков не теряется ни на одной площадке.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { PrismaClient } from "@prisma/client";

const bodySchema = z.object({
  email: z.string().trim().email(),
  source: z.string().trim().max(100).default(""),
});

async function loadDb(): Promise<PrismaClient | null> {
  try {
    const mod = await import("@/lib/db");
    return mod.db;
  } catch (e) {
    console.warn("db unavailable, subscriber goes to Telegram:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Проверьте адрес почты" },
      { status: 400 }
    );
  }
  const email = parsed.data.email.toLowerCase();

  const db = await loadDb();
  if (db) {
    try {
      await db.subscriber.upsert({
        where: { email },
        create: { email, source: parsed.data.source },
        update: { source: parsed.data.source },
      });
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("subscribe save failed (falling back to telegram):", e);
    }
  }

  // Фолбэк: подписка уходит владельцу в Telegram
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    try {
      const text = [
        "📩 Новая подписка на анонс дропа",
        email,
        parsed.data.source && `Источник: ${parsed.data.source}`,
      ]
        .filter(Boolean)
        .join("\n");
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      if (res.ok) return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("telegram notify failed:", e);
    }
  }

  return NextResponse.json(
    { ok: false, error: "Сервер не смог сохранить подписку" },
    { status: 500 }
  );
}
