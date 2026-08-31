// Заказ → Telegram владельцу (основной канал) + SQLite (best effort).
// На serverless-хостинге (Vercel) файловая БД недоступна — заказ при этом
// не теряется: он уходит в Telegram, номер генерируется из времени.
// Цены пересчитываем на сервере из data.ts: клиенту доверяем только выбор
// товара, размера и количества. Количество режем по остатку — без перепродажи.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { PrismaClient } from "@prisma/client";
import { getProduct, stockOfSize, DELIVERY_OPTIONS } from "@/lib/order-data";

const bodySchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s()-]{10,}$/),
    city: z.string().trim().default(""),
    address: z.string().trim().default(""),
    comment: z.string().trim().max(500).default(""),
  }),
  deliveryId: z.enum(["pickup", "courier", "cdek"]),
  items: z
    .array(
      z.object({
        productId: z.string(),
        size: z.string(),
        qty: z.number().int().min(1).max(20),
      })
    )
    .min(1),
});

// Ленивая загрузка Prisma: на serverless импорт/запрос может упасть —
// это штатная ситуация, а не ошибка заказа.
async function loadDb(): Promise<PrismaClient | null> {
  try {
    const mod = await import("@/lib/db");
    return mod.db;
  } catch (e) {
    console.warn("db unavailable, order goes to Telegram only:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос" },
      { status: 400 }
    );
  }
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Проверьте поля формы — что-то заполнено неверно" },
      { status: 400 }
    );
  }
  const { customer, deliveryId, items } = parsed.data;
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId)!;

  // Пересчёт на сервере + ограничение по остаткам
  const lines = [];
  for (const item of items) {
    const product = getProduct(item.productId);
    if (!product) continue;
    const stock = stockOfSize(product, item.size);
    const qty = Math.min(item.qty, stock);
    if (qty <= 0) continue;
    lines.push({
      productId: product.id,
      name: product.name,
      size: item.size,
      qty,
      price: product.price,
    });
  }
  if (lines.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Выбранные размеры уже распроданы. Обновите страницу товара и проверьте остатки.",
      },
      { status: 409 }
    );
  }

  const itemsTotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const deliveryPrice = delivery.price ?? 0;
  const grandTotal = itemsTotal + deliveryPrice;

  const db = await loadDb();

  // SQLite — best effort: если БД недоступна, продолжаем с запасным номером
  let orderNumber = 1000 + (Date.now() % 90000);
  let savedToDb = false;
  if (db) {
    try {
      orderNumber = await db.$transaction(async (tx) => {
        const count = await tx.order.count();
        const number = 1001 + count;
        await tx.order.create({
          data: {
            number,
            customerName: customer.name,
            phone: customer.phone,
            city: customer.city,
            address: customer.address,
            comment: customer.comment,
            deliveryId,
            deliveryTitle: delivery.title,
            itemsJson: JSON.stringify(lines),
            itemsTotal,
            deliveryPrice,
            grandTotal,
          },
        });
        return number;
      });
      savedToDb = true;
    } catch (e) {
      console.error("order save failed (continuing with telegram):", e);
    }
  }

  // Telegram владельцу — основной канал приёма заказов
  let telegramSent = false;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    try {
      const text = [
        `🧵 Заказ №${orderNumber} — ${(grandTotal).toLocaleString("ru-RU")} ₽`,
        ...lines.map(
          (l) => `• ${l.name} (${l.size}) × ${l.qty} — ${l.price * l.qty} ₽`
        ),
        `Доставка: ${delivery.title}${deliveryPrice ? ` — ${deliveryPrice} ₽` : ""}`,
        `${customer.name}, ${customer.phone}`,
        customer.city && `Город: ${customer.city}`,
        customer.address && `Адрес: ${customer.address}`,
        customer.comment && `Комментарий: ${customer.comment}`,
      ]
        .filter(Boolean)
        .join("\n");
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      telegramSent = res.ok;
      if (!telegramSent) {
        console.error("telegram notify failed:", res.status, await res.text().catch(() => ""));
      }
    } catch (e) {
      console.error("telegram notify failed:", e);
    }
    if (telegramSent && savedToDb) {
      await db!.order
        .update({ where: { number: orderNumber }, data: { telegramSent } })
        .catch(() => {});
    }
  }

  // Заказ принят, если он хотя бы куда-то попал: в БД или в Telegram
  if (!savedToDb && !telegramSent) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Не удалось принять заказ. Напишите нам напрямую — контакты внизу страницы.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, orderNumber, total: grandTotal });
}
