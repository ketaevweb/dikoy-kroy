// Общие данные заказа: варианты доставки одинаковы для чекаута и API.
// Пересчёт цен и остатков — только через data.ts на сервере.

import { getProduct, stockOfSize } from "./data";

export { getProduct, stockOfSize };

export type DeliveryId = "pickup" | "courier" | "cdek";

export const DELIVERY_OPTIONS: {
  id: DeliveryId;
  title: string;
  note: string;
  price: number | null; // null = рассчитает менеджер
  priceLabel: string;
}[] = [
  {
    id: "pickup",
    title: "Самовывоз, Пермь",
    note: "Центр, время согласуем в WhatsApp",
    price: 0,
    priceLabel: "0 ₽",
  },
  {
    id: "courier",
    title: "Курьер по Перми",
    note: "На следующий рабочий день",
    price: 300,
    priceLabel: "300 ₽",
  },
  {
    id: "cdek",
    title: "СДЭК по России",
    note: "Стоимость рассчитает менеджер и согласует с вами",
    price: null,
    priceLabel: "рассчитает менеджер",
  },
];
