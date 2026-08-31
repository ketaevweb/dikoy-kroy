// Приём событий воронки (product_view, add_to_cart, begin_checkout,
// purchase_complete, email_signup, restock_signup). Пишем best-effort:
// аналитика никогда не мешает покупке — ответ всегда ok.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { PrismaClient } from "@prisma/client";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(64),
  path: z.string().trim().max(200).default(""),
});

async function loadDb(): Promise<PrismaClient | null> {
  try {
    const mod = await import("@/lib/db");
    return mod.db;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: true });
  }
  if (!parsed.success) return NextResponse.json({ ok: true });

  const db = await loadDb();
  if (db) {
    try {
      await db.event.create({
        data: { name: parsed.data.name, path: parsed.data.path },
      });
    } catch (e) {
      console.warn("event save skipped:", e);
    }
  }
  return NextResponse.json({ ok: true });
}
