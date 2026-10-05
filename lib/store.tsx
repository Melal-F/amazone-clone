"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { money } from "./money";
import { getProduct } from "./catalog";

export type Session = { name: string; email: string };
export type CartLine = { productId: string; qty: number; color?: string };
export type Address = {
  name: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};
export type Order = {
  id: string;
  email: string;
  createdAt: string;
  items: { productId: string; title: string; price: number; qty: number; image: string; color?: string }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  method: "standard" | "expedited";
  estimate: string;
  address: Address;
};

type User = { name: string; email: string; phone?: string; password: string };
type Location = { city: string; zip: string };

type State = {
  session: Session | null;
  location: Location;
  cart: CartLine[];
  saved: CartLine[];
  orders: Order[];
};

const EMPTY: State = {
  session: null,
  location: { city: "San Francisco", zip: "94102" },
  cart: [],
  saved: [],
  orders: [],
};

const KEYS = {
  users: "amazone.users",
  state: "amazone.state",
};

const RESET_CODE = "482913";

type Store = State & {
  ready: boolean;
  cartCount: number;
  signup: (input: { name: string; email: string; phone?: string; password: string }) => string | null;
  signin: (id: string, password: string) => string | null;
  signout: () => void;
  resetPassword: (email: string, code: string, password: string) => string | null;
  setLocation: (city: string, zip: string) => void;
  addToCart: (productId: string, qty?: number, color?: string) => void;
  setQty: (productId: string, color: string | undefined, qty: number) => void;
  remove: (productId: string, color?: string) => void;
  saveForLater: (productId: string, color?: string) => void;
  moveToCart: (productId: string, color?: string) => void;
  removeSaved: (productId: string, color?: string) => void;
  placeOrder: (input: { address: Address; method: "standard" | "expedited"; estimate: string; subtotal: number; shipping: number; tax: number; total: number }) => Order | null;
};

const Ctx = createContext<Store | null>(null);

function readUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.users) || "[]") as User[];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

function lineKey(line: CartLine) {
  return `${line.productId}::${line.color || ""}`;
}

function upsert(lines: CartLine[], line: CartLine) {
  const key = lineKey(line);
  const existing = lines.find((item) => lineKey(item) === key);
  if (!existing) return [...lines, line];
  return lines.map((item) => (lineKey(item) === key ? { ...item, qty: Math.min(10, item.qty + line.qty) } : item));
}

function without(lines: CartLine[], productId: string, color?: string) {
  const key = `${productId}::${color || ""}`;
  return lines.filter((item) => lineKey(item) !== key);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEYS.state);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as State) });
    } catch {
      /* keep defaults */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEYS.state, JSON.stringify(state));
  }, [ready, state]);

  const cartCount = state.cart.reduce((sum, line) => sum + line.qty, 0);

  const store: Store = {
    ...state,
    ready,
    cartCount,
    signup(input) {
      const users = readUsers();
      const email = input.email.trim().toLowerCase();
      if (users.some((user) => user.email === email)) return "An account with that email already exists.";
      const user = { name: input.name.trim(), email, phone: input.phone?.trim(), password: input.password };
      writeUsers([...users, user]);
      setState((prev) => ({ ...prev, session: { name: user.name, email } }));
      return null;
    },
    signin(id, password) {
      const key = id.trim().toLowerCase();
      const user = readUsers().find((item) => item.email === key || item.phone === id.trim());
      if (!user || user.password !== password) return "Your email or password was incorrect.";
      setState((prev) => ({ ...prev, session: { name: user.name, email: user.email } }));
      return null;
    },
    signout() {
      setState((prev) => ({ ...prev, session: null }));
    },
    resetPassword(email, code, password) {
      if (code.trim() !== RESET_CODE) return "That code is not valid. Use 482913 for this mock.";
      const users = readUsers();
      const index = users.findIndex((user) => user.email === email.trim().toLowerCase());
      if (index < 0) return "No account uses that email.";
      users[index] = { ...users[index], password };
      writeUsers(users);
      return null;
    },
    setLocation(city, zip) {
      setState((prev) => ({ ...prev, location: { city: city.trim(), zip: zip.trim() } }));
    },
    addToCart(productId, qty = 1, color) {
      const product = getProduct(productId);
      if (!product || product.availability === "Currently unavailable") return;
      setState((prev) => ({
        ...prev,
        cart: upsert(prev.cart, { productId, qty, color: color || product.colors?.[0] }),
        saved: without(prev.saved, productId, color || product.colors?.[0]),
      }));
    },
    setQty(productId, color, qty) {
      const next = Math.max(1, Math.min(10, qty));
      setState((prev) => ({
        ...prev,
        cart: prev.cart.map((line) => (lineKey(line) === `${productId}::${color || ""}` ? { ...line, qty: next } : line)),
      }));
    },
    remove(productId, color) {
      setState((prev) => ({ ...prev, cart: without(prev.cart, productId, color) }));
    },
    saveForLater(productId, color) {
      setState((prev) => {
        const line = prev.cart.find((item) => lineKey(item) === `${productId}::${color || ""}`);
        if (!line) return prev;
        return { ...prev, cart: without(prev.cart, productId, color), saved: upsert(prev.saved, line) };
      });
    },
    moveToCart(productId, color) {
      setState((prev) => {
        const line = prev.saved.find((item) => lineKey(item) === `${productId}::${color || ""}`);
        if (!line) return prev;
        return { ...prev, saved: without(prev.saved, productId, color), cart: upsert(prev.cart, line) };
      });
    },
    removeSaved(productId, color) {
      setState((prev) => ({ ...prev, saved: without(prev.saved, productId, color) }));
    },
    placeOrder(input) {
      if (!state.session || state.cart.length === 0) return null;
      const items = state.cart.flatMap((line) => {
        const product = getProduct(line.productId);
        if (!product) return [];
        return [{
          productId: product.id,
          title: product.title,
          price: product.price,
          qty: line.qty,
          image: product.images[0],
          color: line.color,
        }];
      });
      const order: Order = {
        id: `112-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
        email: state.session.email,
        createdAt: new Date().toISOString(),
        items,
        subtotal: money(input.subtotal),
        shipping: input.shipping,
        tax: input.tax,
        total: input.total,
        method: input.method,
        estimate: input.estimate,
        address: input.address,
      };
      setState((prev) => ({ ...prev, cart: [], orders: [order, ...prev.orders] }));
      sessionStorage.setItem("amazone.lastOrder", JSON.stringify(order));
      return order;
    },
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const store = useContext(Ctx);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
