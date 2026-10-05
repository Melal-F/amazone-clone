"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { flushSync } from "react-dom";
import { getProduct } from "@/lib/catalog";
import { arrival, formatMoney, money, orderTotal, shippingCost, taxAmount } from "@/lib/money";
import { useStore } from "@/lib/store";
import { Button } from "./Button";
import { Input } from "./Input";

export function CheckoutView() {
  const router = useRouter();
  const { cart, session, placeOrder } = useStore();
  const lines = cart.flatMap((line) => {
    const product = getProduct(line.productId);
    return product ? [{ line, product }] : [];
  });
  const subtotal = money(lines.reduce((sum, item) => sum + item.product.price * item.line.qty, 0));
  const [method, setMethod] = useState<"standard" | "expedited">("standard");
  const [name, setName] = useState(session?.name || "");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const shipping = shippingCost(subtotal, method);
  const tax = taxAmount(subtotal);
  const total = orderTotal(subtotal, method);
  const estimate = arrival(method === "expedited" ? 2 : 5);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-[28px] font-normal">Your cart is empty</h1>
        <Link href="/cart" className="text-link hover:underline">Return to cart</Link>
      </div>
    );
  }

  function place(event: React.FormEvent) {
    event.preventDefault();
    if (!session) {
      router.push("/signin?next=/checkout");
      return;
    }
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = "Enter the recipient name.";
    if (line1.trim().length < 4) nextErrors.line1 = "Enter a street address.";
    if (city.trim().length < 2) nextErrors.city = "Enter a city.";
    if (state.trim().length < 2) nextErrors.state = "Enter a state.";
    if (!/^\d{5}$/.test(zip.trim())) nextErrors.zip = "Enter a 5-digit ZIP code.";
    if (phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Enter a phone number.";
    if (card.replace(/\D/g, "").length < 16) nextErrors.card = "Enter a 16-digit card number. Nothing is charged.";
    if (cardName.trim().length < 2) nextErrors.cardName = "Enter the name on the card.";
    if (!/^\d{2}\/\d{2}$/.test(expiry.trim())) nextErrors.expiry = "Use MM/YY.";
    if (!/^\d{3,4}$/.test(cvc.trim())) nextErrors.cvc = "Enter the CVC.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    window.setTimeout(() => {
      const order = flushSync(() => placeOrder({
        address: { name: name.trim(), line1: line1.trim(), city: city.trim(), state: state.trim(), zip: zip.trim(), phone: phone.trim() },
        method,
        estimate,
        subtotal,
        shipping,
        tax,
        total,
      }));
      if (!order) {
        setLoading(false);
        router.push("/signin?next=/checkout");
        return;
      }
      router.push(`/order-confirmation?id=${order.id}`);
    }, 500);
  }

  return (
    <form onSubmit={place} className="mx-auto grid max-w-[1100px] gap-6 px-3 py-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-4">
      <div className="space-y-6">
        {!session && (
          <p className="border border-line bg-[#fef8e8] px-3 py-2 text-[13px]">
            <Link href="/signin?next=/checkout" className="text-link hover:underline">Sign in</Link> to place this order. Your cart will stay here.
          </p>
        )}
        <section>
          <h1 className="text-[21px] font-bold">1  Shipping address</h1>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><Input label="Full name" value={name} onChange={(event) => setName(event.target.value)} error={errors.name} autoComplete="name" /></div>
            <div className="sm:col-span-2"><Input label="Street address" value={line1} onChange={(event) => setLine1(event.target.value)} error={errors.line1} autoComplete="address-line1" /></div>
            <Input label="City" value={city} onChange={(event) => setCity(event.target.value)} error={errors.city} autoComplete="address-level2" />
            <Input label="State" value={state} onChange={(event) => setState(event.target.value)} error={errors.state} autoComplete="address-level1" />
            <Input label="ZIP code" value={zip} onChange={(event) => setZip(event.target.value)} error={errors.zip} inputMode="numeric" autoComplete="postal-code" />
            <Input label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} error={errors.phone} autoComplete="tel" />
          </div>
        </section>
        <section>
          <h2 className="text-[21px] font-bold">2  Delivery method</h2>
          <div className="mt-3 divide-y divide-line border border-line">
            {([
              ["standard", "Standard", shippingCost(subtotal, "standard"), arrival(5)],
              ["expedited", "Expedited", 12.99, arrival(2)],
            ] as const).map(([id, label, cost, when]) => (
              <label key={id} className="flex cursor-pointer items-center gap-3 px-3 py-3">
                <input type="radio" name="delivery" checked={method === id} onChange={() => setMethod(id)} />
                <span className="flex-1">
                  <span className="font-bold">{label}</span>
                  <span className="mt-0.5 block text-[13px] text-muted">Arrives {when}</span>
                </span>
                <span className="text-[14px]">{cost === 0 ? "FREE" : `$${formatMoney(cost)}`}</span>
              </label>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-[21px] font-bold">3  Payment method</h2>
          <p className="mt-1 text-[13px] text-muted">Mock payment. Use any 16-digit number. Nothing is charged.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><Input label="Card number" value={card} onChange={(event) => setCard(event.target.value)} error={errors.card} inputMode="numeric" autoComplete="cc-number" /></div>
            <div className="sm:col-span-2"><Input label="Name on card" value={cardName} onChange={(event) => setCardName(event.target.value)} error={errors.cardName} autoComplete="cc-name" /></div>
            <Input label="Expiry (MM/YY)" value={expiry} onChange={(event) => setExpiry(event.target.value)} error={errors.expiry} autoComplete="cc-exp" placeholder="MM/YY" />
            <Input label="CVC" value={cvc} onChange={(event) => setCvc(event.target.value)} error={errors.cvc} inputMode="numeric" autoComplete="cc-csc" />
          </div>
        </section>
      </div>
      <aside className="h-fit border border-line p-4">
        <Button type="submit" block disabled={loading}>{loading ? "Placing order" : "Place your order"}</Button>
        <p className="mt-2 text-[12px] leading-4 text-muted">By placing your order you agree this is a demo. No charge will be made.</p>
        <h2 className="mt-4 border-t border-line pt-3 text-[18px] font-bold">Order summary</h2>
        <ul className="mt-2 space-y-2">
          {lines.map(({ line, product }) => (
            <li key={`${line.productId}-${line.color || ""}`} className="flex gap-2 text-[13px]">
              <img src={product.images[0]} alt="" className="h-12 w-12 object-contain" />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2">{product.title}</span>
                <span className="text-muted">Qty {line.qty}</span>
              </span>
              <span>${formatMoney(product.price * line.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-line pt-3 text-[14px]">
          <div className="flex justify-between"><dt>Items</dt><dd>${formatMoney(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "FREE" : `$${formatMoney(shipping)}`}</dd></div>
          <div className="flex justify-between"><dt>Estimated tax</dt><dd>${formatMoney(tax)}</dd></div>
          <div className="flex justify-between text-[18px] font-bold text-price"><dt>Order total</dt><dd>${formatMoney(total)}</dd></div>
        </dl>
      </aside>
    </form>
  );
}
