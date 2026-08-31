// Валидация промокода: сервер пересчитывает скидку из статического конфига
// (lib/promo.ts). Финальная перепроверка происходит в /api/order.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { applyPromo } from "@/lib/promo";
import { DELIVERY_OPTIONS } from "@/lib/order-data";

const bodySchema = z.object({
  code: z.string().trim().min(1).max(40),
  itemsTotal: z.number().int().min(0),
  deliveryId: z.enum(["pickup", "courier", "cdek"]),
});

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, itemsDiscount: 0, deliveryDiscount: 0 },
      { status: 400 }
    );
  }
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        itemsDiscount: 0,
        deliveryDiscount: 0,
        note: "Что-то не так с формой — обновите страницу",
      },
      { status: 400 }
    );
  }
  const { code, itemsTotal, deliveryId } = parsed.data;
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId)!;
  const result = applyPromo(code, itemsTotal, delivery.price);
  return NextResponse.json(result);
}
