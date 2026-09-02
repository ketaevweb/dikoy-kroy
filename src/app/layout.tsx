import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { DemoBadge } from "@/components/site/DemoBadge";

import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PopupSubscribe from "@/components/PopupSubscribe";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  // Концепт магазина для портфолио — честная маркировка в title/description:
  // пришедший из поиска не должен принять демо за работающий магазин.
  title: {
    default: "Дикий крой — концепт магазина спортивной одежды",
    template: "%s · Дикий крой",
  },
  description:
    "Концепт интернет-магазина спортивной одежды для портфолио веб-разработчика: свитшоты, худи, лонгсливы с авторскими принтами, дроп-модель, корзина и оформление заказа — демонстрация интерфейса.",
  keywords: ["спортивная одежда", "дроп", "малые партии", "свитшот", "худи", "Пермь"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${unbounded.variable} min-h-screen antialiased bg-white text-zinc-900 font-sans`}
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <PopupSubscribe />
        </CartProvider>
        <Toaster />
      <DemoBadge />
</body>
      {/* Яндекс Метрика — счётчик ставится только при заданном NEXT_PUBLIC_YM_ID */}
      {process.env.NEXT_PUBLIC_YM_ID && (
        <Script id="ym-counter" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${process.env.NEXT_PUBLIC_YM_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
        </Script>
      )}
    </html>
  );
}
