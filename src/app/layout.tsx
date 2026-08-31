import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Дикий крой — спортивная одежда малыми партиями",
    template: "%s · Дикий крой",
  },
  description:
    "Магазин спортивной одежды ограниченными партиями: свитшоты, худи, лонгсливы с авторскими принтами. Каждый дроп — мини-коллекция, распродано — значит распродано. Пермь, доставка по России.",
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
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
