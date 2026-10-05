"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/money";
import { useStore, type Order } from "@/lib/store";
import { Button } from "./Button";

function readLastOrder(): Order | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("amazone.lastOrder");
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

export function AccountView() {
  const { ready, session, location, orders, signout } = useStore();
  if (!ready) return <p className="p-6 text-muted">Loading your account…</p>;
  if (!session) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-[28px] font-normal">Your Account</h1>
        <p className="mt-2">Sign in to see orders saved in this browser.</p>
        <Link href="/signin?next=/account" className="mt-4 inline-flex h-8 items-center rounded-[7px] bg-primary px-3 text-[13px]">Sign in</Link>
      </div>
    );
  }
  const mine = orders.filter((order) => order.email === session.email);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-[28px] font-normal">Your Account</h1>
      <p className="mt-2 text-[18px]">{session.name}</p>
      <p className="text-muted">{session.email}</p>
      <p className="mt-2 text-[14px]">Delivering to {location.city} {location.zip}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-[14px]">
        <Link href="/orders" className="text-link hover:text-link-hover hover:underline">Your Orders ({mine.length})</Link>
        <Link href="/cart" className="text-link hover:text-link-hover hover:underline">Your Cart</Link>
      </div>
      <Button className="mt-6" variant="secondary" onClick={signout}>Sign out</Button>
    </div>
  );
}

export function OrdersView() {
  const { ready, session, orders } = useStore();
  if (!ready) return <p className="p-6 text-muted">Loading orders…</p>;
  if (!session) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-[28px] font-normal">Your Orders</h1>
        <Link href="/signin?next=/orders" className="text-link hover:underline">Sign in to view orders</Link>
      </div>
    );
  }
  const mine = orders.filter((order) => order.email === session.email);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-[28px] font-normal">Your Orders</h1>
      {mine.length === 0 ? (
        <p className="mt-3">You have not placed an order yet. <Link href="/" className="text-link hover:underline">Continue shopping</Link></p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-t border-line">
          {mine.map((order) => (
            <li key={order.id} className="py-4">
              <p className="font-bold">Order {order.id}</p>
              <p className="text-[13px] text-muted">Placed {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · Arriving {order.estimate}</p>
              <p className="mt-1">Total ${formatMoney(order.total)}</p>
              <ul className="mt-2 space-y-1 text-[14px]">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.productId}-${item.color || ""}`}>
                    <Link href={`/product/${item.productId}`} className="text-link hover:underline">{item.title}</Link>
                    <span className="text-muted"> × {item.qty}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ConfirmationView() {
  const id = useSearchParams().get("id");
  const { orders } = useStore();
  const [fallback, setFallback] = useState<Order | null>(null);
  useEffect(() => setFallback(readLastOrder()), []);
  const order = orders.find((item) => item.id === id) || (fallback?.id === id ? fallback : null);
  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-[28px] font-normal">Order not found</h1>
        <Link href="/orders" className="text-link hover:underline">View your orders</Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-[18px] text-stock">Order placed, thanks.</p>
      <h1 className="mt-1 text-[28px] font-normal leading-9">Confirmation {order.id}</h1>
      <p className="mt-2">Arriving <span className="font-bold">{order.estimate}</span></p>
      <p className="text-[13px] text-muted">
        {order.address.name}, {order.address.line1}, {order.address.city}, {order.address.state} {order.address.zip}
      </p>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.color || ""}`} className="flex gap-3 py-3">
            <img src={item.image} alt="" className="h-16 w-16 object-contain" />
            <div className="min-w-0 flex-1">
              <Link href={`/product/${item.productId}`} className="hover:text-link-hover hover:underline">{item.title}</Link>
              {item.color && <p className="text-[13px] text-muted">Color: {item.color}</p>}
              <p className="text-[13px] text-muted">Qty {item.qty}</p>
            </div>
            <p>${formatMoney(item.price * item.qty)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-right text-[18px]">Order total <span className="font-bold text-price">${formatMoney(order.total)}</span></p>
      <Link href="/" className="mt-4 inline-flex h-8 items-center rounded-[7px] border border-line-strong bg-white px-3 text-[13px]">Continue shopping</Link>
    </div>
  );
}
