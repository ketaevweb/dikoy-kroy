"use client";

// Корзина v2: уникальность позиции = productId + size.
// Лосины M и лосины L — две разные строки. Количество ограничено остатком.
// Хранилище — модульный стор + useSyncExternalStore: SSR-безопасная
// синхронизация с localStorage без setState в эффектах.

import {
  createContext,
  useContext,
  useSyncExternalStore,
  ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  size: string; // ← вариация
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  hydrated: boolean;
};

const SERVER_STATE: CartState = { items: [], hydrated: false };

// ── Модульный стор ───────────────────────────────────────────────────────────
let state: CartState = SERVER_STATE;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartState {
  return state;
}

function getServerSnapshot(): CartState {
  return SERVER_STATE;
}

function setState(patch: Partial<CartState>, persist = false) {
  state = { ...state, ...patch };
  if (persist && typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }
  listeners.forEach((l) => l());
}

// Первичное чтение localStorage происходит до первого рендера на клиенте,
// но React при гидратации возьмёт SERVER_STATE и бесконфликтно пере-рендерит.
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      const items = JSON.parse(saved) as CartItem[];
      if (Array.isArray(items)) state = { items, hydrated: true };
      else state = { items: [], hydrated: true };
    } catch {
      state = { items: [], hydrated: true }; // повреждённые данные — чистая корзина
    }
  } else {
    state = { items: [], hydrated: true };
  }
}

function addItem(item: Omit<CartItem, "qty">, maxStock = Infinity) {
  const prev = state.items;
  const existing = prev.find(
    (i) => i.productId === item.productId && i.size === item.size
  );
  const items = existing
    ? // Товар в этом размере уже в корзине — увеличиваем qty в пределах остатка
      prev.map((i) =>
        i === existing ? { ...i, qty: Math.min(i.qty + 1, maxStock) } : i
      )
    : [...prev, { ...item, qty: Math.min(1, maxStock) }];
  setState({ items }, true);
}

function removeItem(productId: string, size: string) {
  setState(
    {
      items: state.items.filter(
        (i) => !(i.productId === productId && i.size === size)
      ),
    },
    true
  );
}

function clear() {
  setState({ items: [] }, true);
}

// ── React-обёртка ────────────────────────────────────────────────────────────

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, maxStock?: number) => void;
  removeItem: (productId: string, size: string) => void;
  total: number;
  count: number;
  clear: () => void;
  hydrated: boolean; // localStorage загружен (бейдж корзины не мигает)
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const total = snapshot.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = snapshot.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items: snapshot.items,
        addItem,
        removeItem,
        total,
        count,
        clear,
        hydrated: snapshot.hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart должен быть внутри CartProvider");
  return ctx;
}
