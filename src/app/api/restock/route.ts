// «Узнать о поступлении»: email + товар → БД (best effort) + Telegram
// владельцу. Каждая заявка — замер спроса под будущую партию.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { PrismaClient } from "@prisma/client";
import { getProduct } from "@/lib/data";

const bodySchema = z.object({
  productId: z.string().trim().min(1).max(64),
  email: z.string().trim().email(),
});

async function loadDb(): Promise<PrismaClient | null> {
  try {
    const mod = await import("@/lib/db");
    return mod.db;
  } catch (e) {
    console.warn("db unavailable, restock request goes to Telegram:", e);
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
  const { productId, email } = parsed.data;
  const product = getProduct(productId);

  const db = await loadDb();
  let saved = false;
  if (db) {
    try {
      await db.restockRequest.upsert({
        where: {
          productId_email: { productId, email: email.toLowerCase() },
        },
        create: { productId, email: email.toLowerCase() },
        update: {},
      });
      saved = true;
    } catch (e) {
      console.error("restock save failed (falling back to telegram):", e);
    }
  }

  // Telegram — основной канал на serverless; локально это дубль-уведомление
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  let sent = false;
  if (token && chatId) {
    try {
      const text = [
        "🔔 Заявка на ресток",
        product ? product.name : productId,
        email,
        saved ? "(сохранена в БД)" : "(БД недоступна — только здесь)",
      ].join("\n");
      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text }),
        }
      );
      sent = res.ok;
    } catch (e) {
      console.error("telegram notify failed:", e);
    }
  }

  if (!saved && !sent) {
    return NextResponse.json(
      { ok: false, error: "Сервер не смог записать заявку" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
