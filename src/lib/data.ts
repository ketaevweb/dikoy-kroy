// ─────────────────────────────────────────────────────────────────────────────
// Данные магазина «Дикий крой» — спортивная одежда малыми партиями (дроп-модель)
// Остатки статические: для MVP достаточно, владелец правит цифры в одном файле.
// ─────────────────────────────────────────────────────────────────────────────

export type Size = "XS" | "S" | "M" | "L" | "XL";

export type SizeStock = {
  size: Size;
  stock: number; // 0 = sold out
};

export type Drop = {
  id: string;
  name: string; // «Drop 04: Дикая природа»
  description: string;
  releasedAt: string; // ISO
  status: "current" | "archive" | "upcoming";
};

export type Category =
  | "sweatshirts"
  | "hoodies"
  | "longsleeves"
  | "t-shirts";

export type FitPhoto = {
  src: string;
  alt: string;
  sizeLabel: string;
};

export type Product = {
  id: string;
  name: string;
  dropId: string; // принадлежность к коллекции
  category: Category;
  price: number; // фиксированная!
  description: string;
  fabric: string;
  careNote: string;
  sizeChart: Record<Size, { chest: string; waist: string; hips: string }>;
  stock: SizeStock[]; // ← остатки по размерам, источник истины
  fitPhotos: FitPhoto[]; // AI: одна вещь на разных фигурах
  detailPhotos: string[]; // реальные фото: швы, крой, ткань крупно
  mainPhoto: string;
};

export const CATEGORIES: { slug: Category; title: string }[] = [
  { slug: "sweatshirts", title: "Свитшоты" },
  { slug: "hoodies", title: "Худи" },
  { slug: "longsleeves", title: "Лонгсливы" },
  { slug: "t-shirts", title: "Футболки" },
];

export const SIZE_ORDER: Size[] = ["XS", "S", "M", "L", "XL"];

// Базовая размерная сетка женской одежды (см)
const BASE_CHART: Product["sizeChart"] = {
  XS: { chest: "80–84", waist: "60–64", hips: "86–90" },
  S: { chest: "84–88", waist: "64–68", hips: "90–94" },
  M: { chest: "88–92", waist: "68–72", hips: "94–98" },
  L: { chest: "92–96", waist: "72–76", hips: "98–102" },
  XL: { chest: "96–100", waist: "76–80", hips: "102–106" },
};

const SWEATSHIRT_FABRIC =
  "Футер трёхнитка с начёсом: 80% хлопок, 20% полиэстер, 320 г/м²";
const SWEATSHIRT_CARE =
  "Стирка 30° наизнанку, без агрессивного отжима — принт и начёс живут дольше";

export const drops: Drop[] = [
  {
    id: "drop-05",
    name: "Drop 05: Северное сияние",
    description:
      "Готовим холодную капсулу: глубокие синие, зелёные и фиолетовые градиенты на плотном футере. Состав покажем здесь ближе к релизу — подпишитесь, чтобы увидеть первым.",
    releasedAt: "2026-10-15T12:00:00+05:00",
    status: "upcoming",
  },
  {
    id: "drop-04",
    name: "Drop 04: Дикая природа",
    description:
      "Акварельные звери и цветы на плотном футере. Шесть моделей, партии по 15–20 штук на размерную сетку. Шьём в Перми, принт — термоперенос, переживает десятки стирок.",
    releasedAt: "2026-08-14",
    status: "current",
  },
  {
    id: "drop-03",
    name: "Drop 03: Цветение",
    description:
      "Летняя капсула: яркие принты, лёгкие ткани. Почти полностью разошлась за три недели — дораспродаются последние размеры.",
    releasedAt: "2026-06-20",
    status: "archive",
  },
];

export const products: Product[] = [
  // ── Drop 04: Дикая природа (текущий) ──────────────────────────────────────
  {
    id: "kolibri",
    name: "Свитшот «Колибри»",
    dropId: "drop-04",
    category: "sweatshirts",
    price: 3900,
    description:
      "Голубой свитшот с акварельной колибри и цветами на груди. Прямой крой, широкая трикотажная резинка, не задирается при движении. Подходит для зала и на каждый день.",
    fabric: SWEATSHIRT_FABRIC,
    careNote: SWEATSHIRT_CARE,
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 0 },
      { size: "S", stock: 2 },
      { size: "M", stock: 4 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 0 },
    ],
    fitPhotos: [
      {
        src: "/images/models/kolibri-44.jpg",
        alt: "Свитшот «Колибри» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/kolibri-50.jpg",
        alt: "Свитшот «Колибри» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/kolibri.jpg",
  },
  {
    id: "lisa",
    name: "Свитшот «Лиса»",
    dropId: "drop-04",
    category: "sweatshirts",
    price: 3900,
    description:
      "Мятный свитшот с крупным арт-принтом: девочка и рыжий лис. Мягкий начёс внутри, круглый ворот с двойным кантом. Самая «обнимательная» модель дропа.",
    fabric: SWEATSHIRT_FABRIC,
    careNote: SWEATSHIRT_CARE,
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 1 },
      { size: "S", stock: 3 },
      { size: "M", stock: 4 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 0 },
    ],
    fitPhotos: [
      {
        src: "/images/models/lisa-44.jpg",
        alt: "Свитшот «Лиса» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/lisa-50.jpg",
        alt: "Свитшот «Лиса» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/lisa.jpg",
  },
  {
    id: "strekoza",
    name: "Худи «Стрекоза»",
    dropId: "drop-04",
    category: "hoodies",
    price: 4400,
    description:
      "Худи пудрово-розового цвета с меланжевыми рукавами и капюшоном. Принт — стрекоза и цветы. Объёмный капюшон на двойной строчке, карман-кенгуру.",
    fabric: SWEATSHIRT_FABRIC + ". Рукава — меланж 85% хлопок, 15% полиэстер",
    careNote: SWEATSHIRT_CARE,
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 0 },
      { size: "S", stock: 2 },
      { size: "M", stock: 3 },
      { size: "L", stock: 4 },
      { size: "XL", stock: 2 },
    ],
    fitPhotos: [
      {
        src: "/images/models/strekoza-44.jpg",
        alt: "Худи «Стрекоза» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/strekoza-50.jpg",
        alt: "Худи «Стрекоза» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/strekoza.jpg",
  },
  {
    id: "fabulous",
    name: "Свитшот «Fabulous»",
    dropId: "drop-04",
    category: "sweatshirts",
    price: 3700,
    description:
      "Пыльно-розовый свитшот с надписью «Always be Fabulous» на мазках-градиенте. Оверсайз-посадка за счёт спущенной линии плеча. Тот самый «нарядный спортивный».",
    fabric: SWEATSHIRT_FABRIC,
    careNote: SWEATSHIRT_CARE,
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 2 },
      { size: "S", stock: 4 },
      { size: "M", stock: 5 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 1 },
    ],
    fitPhotos: [
      {
        src: "/images/models/fabulous-44.jpg",
        alt: "Свитшот «Fabulous» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/fabulous-50.jpg",
        alt: "Свитшот «Fabulous» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/fabulous.jpg",
  },
  {
    id: "barsy",
    name: "Лонгслив «Полночные барсы»",
    dropId: "drop-04",
    category: "longsleeves",
    price: 3400,
    description:
      "Тёмно-синий лонгслив с принтом двух снежных барсов — снежная ночь и золотые акценты. Ткань тоньше свитшотов: слой под рюкзак или на пробежку в прохладный вечер.",
    fabric: "Футер двухнитка: 95% хлопок, 5% эластан, 260 г/м²",
    careNote: SWEATSHIRT_CARE,
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 1 },
      { size: "S", stock: 2 },
      { size: "M", stock: 3 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 0 },
    ],
    fitPhotos: [
      {
        src: "/images/models/barsy-44.jpg",
        alt: "Лонгслив «Полночные барсы» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/barsy-50.jpg",
        alt: "Лонгслив «Полночные барсы» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/barsy.jpg",
  },
  {
    id: "romashki",
    name: "Свитшот «Ромашки»",
    dropId: "drop-04",
    category: "sweatshirts",
    price: 3900,
    description:
      "Небесно-голубой свитшот с акварельными ромашками и пчелой. Свежий летний принт на плотной тёплой базе — носится и в июле, и в сентябре.",
    fabric: SWEATSHIRT_FABRIC,
    careNote: SWEATSHIRT_CARE,
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 3 },
      { size: "S", stock: 5 },
      { size: "M", stock: 6 },
      { size: "L", stock: 4 },
      { size: "XL", stock: 2 },
    ],
    fitPhotos: [
      {
        src: "/images/models/romashki-44.jpg",
        alt: "Свитшот «Ромашки» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/romashki-50.jpg",
        alt: "Свитшот «Ромашки» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/romashki.jpg",
  },

  // ── Drop 03: Цветение (архив, дораспродаётся) ─────────────────────────────
  {
    id: "wild-spirit",
    name: "Свитшот «Wild Spirit»",
    dropId: "drop-03",
    category: "sweatshirts",
    price: 3600,
    description:
      "Лаванда + мятные рукава, принт с перьями. Партия из 18 штук разошлась за две недели — ждём повтор в одном из следующих дропов.",
    fabric: SWEATSHIRT_FABRIC,
    careNote: SWEATSHIRT_CARE,
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 0 },
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    fitPhotos: [
      {
        src: "/images/models/wild-spirit-44.jpg",
        alt: "Свитшот «Wild Spirit» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/wild-spirit-50.jpg",
        alt: "Свитшот «Wild Spirit» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/wild-spirit.jpg",
  },
  {
    id: "liliya",
    name: "Футболка «Лилия»",
    dropId: "drop-03",
    category: "t-shirts",
    price: 2400,
    description:
      "Синяя футболка оверсайз с крупной акварельной лилией. Лёгкая кулирка — идеальна на тренировку. Остался один размер в дораспродаже архива.",
    fabric: "Кулирка компакт-пенье: 100% хлопок, 180 г/м²",
    careNote: "Стирка 30°, сушить в расправленном виде",
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 0 },
      { size: "S", stock: 0 },
      { size: "M", stock: 1 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    fitPhotos: [
      {
        src: "/images/models/liliya-44.jpg",
        alt: "Футболка «Лилия» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/liliya-50.jpg",
        alt: "Футболка «Лилия» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/liliya.jpg",
  },
  {
    id: "pero",
    name: "Свитшот «Перо и луна»",
    dropId: "drop-03",
    category: "sweatshirts",
    price: 3800,
    description:
      "Фуксия с тёмным пером, месяцем и звёздами. Самый неоднозначный принт дропа — и именно его разобрали первым. Распродан полностью.",
    fabric: SWEATSHIRT_FABRIC,
    careNote: SWEATSHIRT_CARE,
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 0 },
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    fitPhotos: [
      {
        src: "/images/models/pero-44.jpg",
        alt: "Свитшот «Перо и луна» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/pero-50.jpg",
        alt: "Свитшот «Перо и луна» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/pero.jpg",
  },
  {
    id: "enjoy",
    name: "Свитшот «Enjoy»",
    dropId: "drop-03",
    category: "sweatshirts",
    price: 3700,
    description:
      "Кобальтовый свитшот с пастельными мазками и надписью «Enjoy Every Moment of Your Life». Из архива осталось всего три штуки — дальше модель не повторяется.",
    fabric: SWEATSHIRT_FABRIC,
    careNote: SWEATSHIRT_CARE,
    sizeChart: BASE_CHART,
    stock: [
      { size: "XS", stock: 0 },
      { size: "S", stock: 1 },
      { size: "M", stock: 2 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    fitPhotos: [
      {
        src: "/images/models/enjoy-44.jpg",
        alt: "Свитшот «Enjoy» на фигуре 44–46",
        sizeLabel: "Фигура 44–46",
      },
      {
        src: "/images/models/enjoy-50.jpg",
        alt: "Свитшот «Enjoy» на фигуре 50–52",
        sizeLabel: "Фигура 50–52",
      },
    ],
    detailPhotos: [],
    mainPhoto: "/images/products/enjoy.jpg",
  },
];

// ── Хелперы ──────────────────────────────────────────────────────────────────

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getDrop(id: string): Drop | undefined {
  return drops.find((d) => d.id === id);
}

export function productsByDrop(dropId: string): Product[] {
  return products.filter((p) => p.dropId === dropId);
}

export function productsByCategory(cat: Category): Product[] {
  return products.filter((p) => p.category === cat);
}

export function totalStock(p: Product): number {
  return p.stock.reduce((sum, s) => sum + s.stock, 0);
}

export function stockOfSize(p: Product, size: Size): number {
  return p.stock.find((s) => s.size === size)?.stock ?? 0;
}

export function currentDrop(): Drop {
  return drops.find((d) => d.status === "current") ?? drops[0];
}

export function nextUpcomingDrop(): Drop | undefined {
  const now = Date.now();
  return drops.find(
    (d) => d.status === "upcoming" && new Date(d.releasedAt).getTime() > now
  );
}

// «С этим часто берут»: без ML — сначала та же категория, затем тот же дроп,
// затем остальное. На реальных заказах можно заменить на ко-покупки из Order.
export function relatedProducts(p: Product, take = 3): Product[] {
  const sameCategory = products.filter(
    (x) => x.id !== p.id && x.category === p.category
  );
  const sameDrop = products.filter(
    (x) =>
      x.id !== p.id && x.dropId === p.dropId && x.category !== p.category
  );
  const rest = products.filter(
    (x) =>
      x.id !== p.id && x.dropId !== p.dropId && x.category !== p.category
  );
  return [...sameCategory, ...sameDrop, ...rest].slice(0, take);
}

export const BRAND = {
  name: "Дикий крой",
  tagline: "Спортивная одежда малыми партиями",
  city: "Пермь",
  phone: "+7 902 471-23-05",
  whatsapp: "https://wa.me/79024712305",
  telegram: "https://t.me/dikyikroy",
  email: "hello@dikyikroy.ru",
  sbp: "+7 902 471-23-05",
};
