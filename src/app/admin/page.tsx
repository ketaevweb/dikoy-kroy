// Админка: заказы, воронка конверсии, подписчики, заявки на ресток, промокоды.
// Доступ по паролю из ADMIN_PASSWORD (HttpOnly-cookie на 12 часов).
// Статистика берётся из SQLite — на serverless (Vercel) БД недоступна,
// заказы при этом не теряются: они уходят в Telegram (это основной канал).

import { cookies } from "next/headers";
import { createHash } from "crypto";
import type { Metadata } from "next";
import AdminLogin from "@/components/AdminLogin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

function adminToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`dk-admin:${pw}`).digest("hex");
}

type Dashboard = {
  orders: {
    number: number;
    createdAt: Date;
    customerName: string;
    phone: string;
    city: string;
    deliveryTitle: string;
    itemsJson: string;
    itemsTotal: number;
    discount: number;
    promoCode: string;
    grandTotal: number;
    telegramSent: boolean;
  }[];
  ordersCount: number;
  revenue: number;
  subscribers: number;
  restocks: number;
  events: Record<string, number>;
  promoUsage: { code: string; count: number }[];
};

async function loadDashboard(): Promise<Dashboard | null> {
  try {
    const { db } = await import("@/lib/db");
    const [orders, ordersAgg, subscribers, restocks, eventGroups, promoGroups] =
      await Promise.all([
        db.order.findMany({
          orderBy: { id: "desc" },
          take: 30,
          select: {
            number: true,
            createdAt: true,
            customerName: true,
            phone: true,
            city: true,
            deliveryTitle: true,
            itemsJson: true,
            itemsTotal: true,
            discount: true,
            promoCode: true,
            grandTotal: true,
            telegramSent: true,
          },
        }),
        db.order.aggregate({ _count: true, _sum: { grandTotal: true } }),
        db.subscriber.count(),
        db.restockRequest.count(),
        db.event.groupBy({ by: ["name"], _count: { _all: true } }),
        db.order.groupBy({
          by: ["promoCode"],
          where: { promoCode: { not: "" } },
          _count: { _all: true },
        }),
      ]);
    return {
      orders,
      ordersCount: ordersAgg._count,
      revenue: ordersAgg._sum.grandTotal ?? 0,
      subscribers,
      restocks,
      events: Object.fromEntries(
        eventGroups.map((g) => [g.name, g._count._all])
      ),
      promoUsage: promoGroups.map((g) => ({
        code: g.promoCode,
        count: g._count._all,
      })),
    };
  } catch {
    return null;
  }
}

const FUNNEL: { key: string; label: string }[] = [
  { key: "product_view", label: "Просмотрели карточку" },
  { key: "add_to_cart", label: "Добавили в корзину" },
  { key: "begin_checkout", label: "Начали оформление" },
  { key: "purchase_complete", label: "Завершили заказ" },
];

function money(n: number) {
  return n.toLocaleString("ru-RU");
}

export default async function AdminPage() {
  const token = adminToken();
  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-xl font-bold uppercase tracking-tight">
          Админка отключена
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Задайте переменную окружения <code>ADMIN_PASSWORD</code> и
          перезапустите приложение.
        </p>
      </div>
    );
  }

  const jar = await cookies();
  if (jar.get("dk_admin")?.value !== token) {
    return <AdminLogin />;
  }

  const data = await loadDashboard();
  const views = data?.events["product_view"] ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Админка
      </h1>

      {!data && (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          База данных недоступна (serverless-хостинг). Заказы и заявки при этом
          не теряются — они приходят в Telegram. Полная статистика и журнал
          заказов ведутся на копии с SQLite (локально или на VPS).
        </p>
      )}

      {data && (
        <>
          {/* Сводка */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Заказов
              </p>
              <p className="mt-2 font-display text-3xl font-bold">
                {data.ordersCount}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Выручка
              </p>
              <p className="mt-2 font-display text-3xl font-bold">
                {money(data.revenue)} ₽
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Подписчики
              </p>
              <p className="mt-2 font-display text-3xl font-bold">
                {data.subscribers}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Ждут ресток
              </p>
              <p className="mt-2 font-display text-3xl font-bold">
                {data.restocks}
              </p>
            </div>
          </div>

          {/* Воронка */}
          <section className="mt-10">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">
              Воронка
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              События копятся с момента обновления. Внешняя аналитика — в
              Яндекс Метрике (цели с теми же названиями).
            </p>
            <div className="mt-4 space-y-2">
              {FUNNEL.map((step, i) => {
                const value = data.events[step.key] ?? 0;
                const pct = views > 0 ? Math.round((value / views) * 100) : 0;
                const width = views > 0 ? Math.max(2, pct) : 0;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <p className="w-44 shrink-0 text-sm text-zinc-700">
                      {step.label}
                    </p>
                    <div className="h-7 flex-1 overflow-hidden rounded-lg bg-zinc-100">
                      <div
                        className={`h-full rounded-lg ${
                          i === FUNNEL.length - 1
                            ? "bg-emerald-500"
                            : "bg-zinc-900"
                        }`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <p className="w-28 shrink-0 text-right text-sm tabular-nums">
                      {value} {views > 0 && step.key !== "product_view" && `· ${pct}%`}
                    </p>
                  </div>
                );
              })}
              <div className="flex items-center gap-3 border-t border-zinc-100 pt-2 text-sm text-zinc-500">
                <p className="w-44 shrink-0">Подписки на дроп</p>
                <p>{data.events["email_signup"] ?? 0}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <p className="w-44 shrink-0">Заявки на ресток</p>
                <p>{data.events["restock_signup"] ?? 0}</p>
              </div>
            </div>
          </section>

          {/* Промокоды */}
          <section className="mt-10">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">
              Промокоды
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-md text-sm">
                <thead>
                  <tr className="text-left text-zinc-500">
                    <th className="py-2 pr-4">Код</th>
                    <th className="py-2 pr-4">Действие</th>
                    <th className="py-2">Использован</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["FIRST10", "−10% на первый заказ"],
                    ["DROP04VIP", "−15% подписчикам TG"],
                    ["FREESHIP", "Бесплатный курьер по Перми"],
                  ].map(([code, title]) => {
                    const usage = data.promoUsage.find(
                      (u) => u.code === code
                    )?.count;
                    return (
                      <tr key={code} className="border-t border-zinc-100">
                        <td className="py-2 pr-4 font-mono font-bold">{code}</td>
                        <td className="py-2 pr-4 text-zinc-600">{title}</td>
                        <td className="py-2 tabular-nums">
                          {usage ? `${usage} ×` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Журнал заказов */}
          <section className="mt-10">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">
              Последние заказы
            </h2>
            {data.orders.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-500">
                Заказов пока нет — всё впереди.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-500">
                      <th className="py-2 pr-4">№</th>
                      <th className="py-2 pr-4">Дата</th>
                      <th className="py-2 pr-4">Клиент</th>
                      <th className="py-2 pr-4">Состав</th>
                      <th className="py-2 pr-4">Промо</th>
                      <th className="py-2 pr-4">Доставка</th>
                      <th className="py-2 text-right">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map((o) => {
                      let items = "";
                      try {
                        items = (
                          JSON.parse(o.itemsJson) as {
                            name: string;
                            size: string;
                            qty: number;
                          }[]
                        )
                          .map((l) => `${l.name} (${l.size})${l.qty > 1 ? ` ×${l.qty}` : ""}`)
                          .join("; ");
                      } catch {
                        items = o.itemsJson;
                      }
                      return (
                        <tr key={o.number} className="border-t border-zinc-100 align-top">
                          <td className="py-2.5 pr-4 font-semibold">
                            {o.number}
                            {!o.telegramSent && (
                              <span
                                className="ml-1 text-amber-600"
                                title="Telegram не доставлен"
                              >
                                ⚠
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 pr-4 text-zinc-500">
                            {new Date(o.createdAt).toLocaleString("ru-RU", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-2.5 pr-4">
                            {o.customerName}
                            <br />
                            <span className="text-xs text-zinc-500">
                              {o.phone}
                              {o.city && ` · ${o.city}`}
                            </span>
                          </td>
                          <td className="max-w-64 py-2.5 pr-4 text-zinc-600">
                            {items}
                          </td>
                          <td className="py-2.5 pr-4">
                            {o.promoCode ? (
                              <span className="text-emerald-700">
                                {o.promoCode} −{money(o.discount)} ₽
                              </span>
                            ) : (
                              <span className="text-zinc-300">—</span>
                            )}
                          </td>
                          <td className="py-2.5 pr-4 text-zinc-600">
                            {o.deliveryTitle}
                          </td>
                          <td className="py-2.5 text-right font-semibold">
                            {money(o.grandTotal)} ₽
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
