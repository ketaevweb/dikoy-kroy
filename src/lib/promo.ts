// Промокоды — статический конфиг (как остатки в data.ts): работает на любой
// площадке без БД, владелец правит список в одном файле. Лимиты использований
// на serverless не считаем — при переезде на БД/CMS добавляется таблица.

export type PromoType = "percent" | "freeship";

export type PromoCode = {
  code: string;
  type: PromoType;
  value?: number; // % для type: "percent"
  title: string; // человекочитаемое описание
  active: boolean;
};

export const PROMO_CODES: PromoCode[] = [
  {
    code: "FIRST10",
    type: "percent",
    value: 10,
    title: "−10% на первый заказ",
    active: true,
  },
  {
    code: "DROP04VIP",
    type: "percent",
    value: 15,
    title: "−15% для подписчиков Telegram-канала",
    active: true,
  },
  {
    code: "FREESHIP",
    type: "freeship",
    title: "Бесплатная доставка курьером по Перми",
    active: true,
  },
];

export function findPromo(raw: string): PromoCode | undefined {
  const code = raw.trim().toUpperCase();
  return PROMO_CODES.find((p) => p.code === code && p.active);
}

export type PromoResult = {
  ok: boolean;
  code?: string;
  title?: string;
  itemsDiscount: number; // ₽ скидки на товары
  deliveryDiscount: number; // ₽ скидки на доставку
  note?: string;
};

// Считаем скидку по промокоду. deliveryPrice === null (СДЭК) — точная цена
// неизвестна, менеджер учтёт промокод при подтверждении.
export function applyPromo(
  raw: string,
  itemsTotal: number,
  deliveryPrice: number | null
): PromoResult {
  const promo = findPromo(raw);
  if (!promo) {
    return {
      ok: false,
      itemsDiscount: 0,
      deliveryDiscount: 0,
      note: "Промокод не найден или больше не активен",
    };
  }
  if (promo.type === "percent") {
    return {
      ok: true,
      code: promo.code,
      title: promo.title,
      itemsDiscount: Math.round((itemsTotal * (promo.value ?? 0)) / 100),
      deliveryDiscount: 0,
    };
  }
  // freeship
  if (deliveryPrice === null) {
    return {
      ok: true,
      code: promo.code,
      title: promo.title,
      itemsDiscount: 0,
      deliveryDiscount: 0,
      note: "Менеджер посчитает СДЭК уже с бесплатной доставкой",
    };
  }
  return {
    ok: true,
    code: promo.code,
    title: promo.title,
    itemsDiscount: 0,
    deliveryDiscount: deliveryPrice,
    note:
      deliveryPrice === 0 ? "Доставка и так бесплатная — скидка не добавляет" : undefined,
  };
}
