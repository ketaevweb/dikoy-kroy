import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/data";

export const metadata = {
  title: "О бренде",
  description:
    "«Дикий крой» — небольшое производство спортивной одежды малыми партиями из Перми.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
        О бренде
      </h1>

      <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_1.3fr]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200">
          <Image
            src="/images/models/lisa-50.jpg"
            alt="Свитшот «Лиса» на модели"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-5 text-base leading-relaxed text-zinc-600">
          <p>
            «Дикий крой» — это {BRAND.city.toLowerCase()} и небольшое
            производство спортивной одежды, которая не боится быть заметной.
            Мы шьём свитшоты, худи, лонгсливы и футболки с авторскими
            акварельными принтами — звери, цветы, надписи, которые хочется
            рассматривать.
          </p>
          <p>
            Мы сознательно работаем малыми партиями. Каждая коллекция — это
            15–20 экземпляров каждой модели на всю размерную сетку XS–XL. Это
            не «пока не закупили склад», а принцип: партия распродана — модель
            уходит в архив, и мы шьём что-то новое. Так бренд живёт, а не
            пылится на полках.
          </p>
          <p>
            Ткани — плотный хлопковый футер с начёсом и лёгкие кулирки,
            принты — термоперенос, который переживает десятки стирок. Всё
            отшивается небольшими ателье, где каждую вещь проверяют руками, а
            не сканером.
          </p>
          <p className="text-zinc-900">
            Напишите нам:{" "}
            <a href={BRAND.whatsapp} className="underline underline-offset-4" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            {" · "}
            <a href={BRAND.telegram} className="underline underline-offset-4" target="_blank" rel="noreferrer">
              Telegram
            </a>
            {" · "}
            <a href={`mailto:${BRAND.email}`} className="underline underline-offset-4">
              {BRAND.email}
            </a>
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 p-5">
          <p className="font-display text-2xl font-bold">XS–XL</p>
          <p className="mt-1 text-sm text-zinc-600">
            вся размерная сетка в каждой партии — крупные размеры не «допоставка»
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-5">
          <p className="font-display text-2xl font-bold">1–3 дня</p>
          <p className="mt-1 text-sm text-zinc-600">
            от оплаты до отправки — вещи уже сшиты и ждут вас
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 p-5">
          <p className="font-display text-2xl font-bold">0 складов</p>
          <p className="mt-1 text-sm text-zinc-600">
            остатки честные: то, что на карточке, то и существует
          </p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/drops"
          className="inline-block rounded-xl bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Посмотреть дропы
        </Link>
      </div>
    </div>
  );
}
