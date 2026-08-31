import Link from "next/link";
import { BRAND } from "@/lib/data";

export const metadata = {
  title: "Доставка, обмен и возврат",
  description:
    "Доставка по Перми и России, предоплата по СБП, обмен и возврат по закону.",
};

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        Доставка, обмен и возврат
      </h1>

      <section className="mt-8">
        <h2 className="font-display text-base font-bold uppercase tracking-wide">
          Способы доставки
        </h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">Самовывоз, {BRAND.city}</h3>
              <span className="font-semibold">0 ₽</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
              Забираете сами из шоурума в центре — время согласовываем в
              WhatsApp. Примерить на месте можно, зеркало есть, чай тоже.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">Курьер по {BRAND.city}</h3>
              <span className="font-semibold">300 ₽</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
              Доставим на следующий рабочий день, интервал согласуем заранее.
              Оплата — предоплата по СБП.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">СДЭК по России</h3>
              <span className="text-sm font-medium text-zinc-500">
                рассчитает менеджер
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
              До пункта выдачи или курьером до двери. Стоимость зависит от
              города и веса — менеджер посчитает после оформления заказа и
              согласует с вами до оплаты. Отправляем в день оплаты, трек
              присылаем в WhatsApp или Telegram.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-base font-bold uppercase tracking-wide">
          Оплата
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Работаем по предоплате 100% переводом по СБП на {BRAND.sbp}. После
          оформления заказа вы получите номер и сумму — переведите и пришлите
          скрин в WhatsApp {BRAND.phone}. Отправляем в день оплаты. Для
          юридических лиц выставим счёт — напишите на {BRAND.email}.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-base font-bold uppercase tracking-wide">
          Обмен и возврат
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600">
          <p>
            Мы продаём готовые изделия, поэтому действует стандартное правило
            обмена и возврата: <b>14 дней</b> с момента получения на обмен и
            возврат товара надлежащего качества — если вещь не подошла по
            размеру или просто не легла.
          </p>
          <p>
            Условия простые: бирки на месте, вещь не носилась, следов стирки и
            запахов нет. Обмен размера — меняем на нужный, если он ещё есть в
            партии; если нет — возвращаем деньги в течение 3 рабочих дней.
            Пересылку при обмене по России оплачивает покупатель, при браке — мы.
          </p>
          <p>
            Брак (швы, принт, ткань) меняем или возвращаем деньги полностью,
            включая доставку, — при наличии фото в течение 3 дней после
            получения. Просто напишите в WhatsApp {BRAND.phone}, спорить не
            любим, решаем быстро.
          </p>
          <p className="text-xs text-zinc-400">
            Возврат перечисляется на тот же счёт, с которого была оплата.
            Положение соответствует Закону «О защите прав потребителей» и
            правилам дистанционной торговли.
          </p>
        </div>
      </section>

      <div className="mt-10 rounded-2xl bg-zinc-50 p-6">
        <p className="text-sm leading-relaxed text-zinc-600">
          Остались вопросы — напишите в{" "}
          <a href={BRAND.whatsapp} className="underline underline-offset-4" target="_blank" rel="noreferrer">
            WhatsApp
          </a>{" "}
          или{" "}
          <a href={BRAND.telegram} className="underline underline-offset-4" target="_blank" rel="noreferrer">
            Telegram
          </a>
          , отвечаем в течение рабочего часа.
        </p>
        <Link
          href="/catalog"
          className="mt-4 inline-block rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Выбрать вещь
        </Link>
      </div>
    </div>
  );
}
