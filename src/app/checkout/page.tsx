"use client";

// Чекаут v2: без мерок — поля доставки. Оплата — уровень 1 (предоплата по СБП),
// интеграция ЮKassa — отдельная итерация после запуска.

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { getProduct, BRAND } from "@/lib/data";
import { DELIVERY_OPTIONS } from "@/lib/order-data";
import { cn } from "@/lib/utils";

type OrderResult = {
  ok: boolean;
  orderNumber?: number;
  total?: number;
  error?: string;
};

export default function CheckoutPage() {
  const { items, total, clear, hydrated } = useCart();
  const [deliveryId, setDeliveryId] = useState<
    (typeof DELIVERY_OPTIONS)[number]["id"]
  >("pickup");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    comment: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);

  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId)!;
  const grandTotal = useMemo(
    () => total + (delivery.price ?? 0),
    [total, delivery.price]
  );

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-8 w-40 animate-pulse rounded bg-zinc-100" />
      </div>
    );
  }

  if (result?.ok && result.orderNumber) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <p className="text-4xl">✓</p>
          <h1 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight text-emerald-900">
            Заказ №{result.orderNumber} принят
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-emerald-800">
            Для подтверждения переведите предоплату 100% —{" "}
            <b>{(result.total ?? grandTotal).toLocaleString("ru-RU")} ₽</b> — по
            СБП на {BRAND.sbp} ({BRAND.name}).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            После оплаты отправьте скрин перевода в WhatsApp {BRAND.phone} —
            отправим в тот же день.{" "}
            {deliveryId === "cdek" &&
              "Стоимость СДЭКА менеджер посчитает и согласует отдельным сообщением."}
          </p>
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-xl bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Написать в WhatsApp
          </a>
        </div>
        <p className="mt-4 text-center text-sm text-zinc-500">
          Детали заказа продублированы менеджеру автоматически.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Корзина пуста
        </h1>
        <p className="mt-3 text-zinc-600">
          Сначала выберите вещь — и возвращайтесь.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-xl bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          В каталог
        </Link>
      </div>
    );
  }

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Как к вам обращаться?";
    if (!/^\+?[\d\s()-]{10,}$/.test(form.phone.trim()))
      e.phone = "Телефон в формате +7 900 000-00-00";
    if (deliveryId !== "pickup" && form.city.trim().length < 2)
      e.city = "Укажите город";
    if (deliveryId !== "pickup" && form.address.trim().length < 4)
      e.address = "Адрес или пункт выдачи";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          deliveryId,
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            qty: i.qty,
          })),
        }),
      });
      const data = (await res.json()) as OrderResult;
      if (!res.ok || !data.ok) {
        setResult({
          ok: false,
          error: data.error ?? "Сервер не принял заказ. Попробуйте ещё раз.",
        });
      } else {
        setResult(data);
        clear();
      }
    } catch {
      setResult({
        ok: false,
        error: "Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.",
      });
    } finally {
      setSending(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition-colors focus:border-zinc-900";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Оформление заказа
      </h1>

      <form onSubmit={submit} className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        {/* Левая колонка: данные */}
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Получатель
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <input
                  className={inputCls}
                  placeholder="Имя *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  className={inputCls}
                  placeholder="Телефон *"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Доставка
            </h2>
            <div className="mt-3 space-y-2">
              {DELIVERY_OPTIONS.map((d) => (
                <label
                  key={d.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                    deliveryId === d.id
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 hover:border-zinc-400"
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={d.id}
                    checked={deliveryId === d.id}
                    onChange={() => setDeliveryId(d.id)}
                    className="mt-1"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{d.title}</span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {d.note}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold",
                      d.price === null && "font-medium text-zinc-500"
                    )}
                  >
                    {d.priceLabel}
                  </span>
                </label>
              ))}
            </div>

            {deliveryId !== "pickup" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <input
                    className={inputCls}
                    placeholder="Город *"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                  )}
                </div>
                <div>
                  <input
                    className={inputCls}
                    placeholder="Адрес или пункт выдачи СДЭК *"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                  )}
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Комментарий
            </h2>
            <textarea
              className={cn(inputCls, "mt-3 min-h-24 resize-y")}
              placeholder="«Перезвоните перед отправкой», «подарочная упаковка» и т.п."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </section>
        </div>

        {/* Правая колонка: состав заказа */}
        <aside className="h-fit rounded-2xl border border-zinc-200 bg-zinc-50 p-6 lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
            Ваш заказ
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => {
              const p = getProduct(i.productId);
              if (!p) return null;
              return (
                <li key={`${i.productId}-${i.size}`} className="flex gap-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white">
                    <Image
                      src={p.mainPhoto}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium leading-snug">{p.name}</p>
                    <p className="text-zinc-500">
                      {i.size}
                      {i.qty > 1 && ` · ${i.qty} шт`}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {(i.price * i.qty).toLocaleString("ru-RU")} ₽
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 space-y-1.5 border-t border-zinc-200 pt-4 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Товары</span>
              <span>{total.toLocaleString("ru-RU")} ₽</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>{delivery.title}</span>
              <span>
                {delivery.price === null ? "—" : `${delivery.price} ₽`}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold">
              <span>Итого</span>
              <span>{grandTotal.toLocaleString("ru-RU")} ₽</span>
            </div>
            {delivery.price === null && (
              <p className="text-xs leading-relaxed text-zinc-400">
                СДЭК: менеджер рассчитает стоимость и согласует до оплаты —
                итог может немного измениться.
              </p>
            )}
          </div>

          {result && !result.ok && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {result.error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="mt-5 w-full rounded-xl bg-zinc-900 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
          >
            {sending ? "Отправляем..." : "Подтвердить заказ"}
          </button>
          <p className="mt-3 text-xs leading-relaxed text-zinc-400">
            Нажимая кнопку, вы отправляете заявку менеджеру. Оплата — предоплата
            100% по СБП после подтверждения. Возврат и обмен — по правилам
            раздела «Доставка».
          </p>
        </aside>
      </form>
    </div>
  );
}
