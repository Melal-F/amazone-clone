"use client";

import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { formatMoney, money } from "@/lib/money";
import { useStore, type CartLine } from "@/lib/store";
import { Button } from "./Button";
import { Price } from "./Price";

function Line({
  line,
  saved = false,
}: {
  line: CartLine;
  saved?: boolean;
}) {
  const product = getProduct(line.productId);
  const { setQty, remove, saveForLater, moveToCart, removeSaved } = useStore();
  if (!product) return null;
  return (
    <article className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-b border-line py-4 sm:grid-cols-[140px_minmax(0,1fr)_120px]">
      <Link href={`/product/${product.id}`}>
        <img src={product.images[0]} alt="" className="h-24 w-full object-contain sm:h-32" />
      </Link>
      <div className="min-w-0">
        <Link href={`/product/${product.id}`} className="text-[16px] leading-6 hover:text-link-hover hover:underline">
          {product.title}
        </Link>
        {line.color && <p className="text-[13px] text-muted">Color: {line.color}</p>}
        <p className={product.availability === "In Stock" ? "text-[12px] text-stock" : "text-[12px] text-price"}>{product.availability}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
          {!saved && (
            <span className="inline-flex h-8 items-center rounded-[4px] border border-line-strong bg-soft">
              <button type="button" aria-label="Decrease quantity" className="w-8" onClick={() => (line.qty <= 1 ? remove(line.productId, line.color) : setQty(line.productId, line.color, line.qty - 1))}>−</button>
              <span className="w-6 text-center">{line.qty}</span>
              <button type="button" aria-label="Increase quantity" className="w-8" onClick={() => setQty(line.productId, line.color, line.qty + 1)}>+</button>
            </span>
          )}
          {saved ? (
            <>
              <button type="button" className="text-link hover:text-link-hover hover:underline" onClick={() => moveToCart(line.productId, line.color)}>Move to cart</button>
              <span className="text-line">|</span>
              <button type="button" className="text-link hover:text-link-hover hover:underline" onClick={() => removeSaved(line.productId, line.color)}>Delete</button>
            </>
          ) : (
            <>
              <button type="button" className="text-link hover:text-link-hover hover:underline" onClick={() => remove(line.productId, line.color)}>Delete</button>
              <span className="text-line">|</span>
              <button type="button" className="text-link hover:text-link-hover hover:underline" onClick={() => saveForLater(line.productId, line.color)}>Save for later</button>
            </>
          )}
        </div>
      </div>
      <div className="col-span-2 text-right sm:col-span-1">
        <Price price={money(product.price * line.qty)} />
      </div>
    </article>
  );
}

export function CartView() {
  const { cart, saved, session } = useStore();
  const lines = cart.flatMap((line) => {
    const product = getProduct(line.productId);
    return product ? [{ line, product }] : [];
  });
  const count = lines.reduce((sum, item) => sum + item.line.qty, 0);
  const subtotal = money(lines.reduce((sum, item) => sum + item.product.price * item.line.qty, 0));

  return (
    <div className="mx-auto grid max-w-[1500px] gap-4 px-3 py-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-4">
      <div>
        {lines.length === 0 ? (
          <div className="border-b border-line pb-6">
            <h1 className="text-[28px] font-normal">Your amazone Cart is empty</h1>
            <Link href="/products?deals=1" className="text-link hover:text-link-hover hover:underline">Shop today&apos;s deals</Link>
            {!session && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/signin?next=/cart" className="inline-flex h-8 items-center rounded-[7px] border border-primary bg-primary px-3 text-[13px]">Sign in to your account</Link>
                <Link href="/signup?next=/cart" className="inline-flex h-8 items-center rounded-[7px] border border-line-strong bg-white px-3 text-[13px]">Sign up now</Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between border-b border-line pb-1">
              <h1 className="text-[28px] font-normal">Shopping Cart</h1>
              <span className="hidden text-[13px] text-muted sm:inline">Price</span>
            </div>
            {lines.map(({ line }) => <Line key={`${line.productId}-${line.color || ""}`} line={line} />)}
            <p className="py-3 text-right text-[18px]">
              Subtotal ({count} {count === 1 ? "item" : "items"}): <span className="font-bold">${formatMoney(subtotal)}</span>
            </p>
          </>
        )}
        <h2 className="mt-6 text-[21px] font-bold">Saved for later ({saved.length})</h2>
        {saved.length === 0 ? (
          <p className="mt-2 text-[14px] text-muted">No items saved for later.</p>
        ) : (
          saved.map((line) => <Line key={`saved-${line.productId}-${line.color || ""}`} line={line} saved />)
        )}
      </div>
      <aside className="h-fit border border-line p-4">
        <p className="text-[18px]">
          Subtotal ({count} {count === 1 ? "item" : "items"}): <span className="font-bold">${formatMoney(subtotal)}</span>
        </p>
        <p className="mt-1 text-[12px] text-muted">Estimated total includes shipping and tax at checkout.</p>
        {lines.length > 0 ? (
          <Link href="/checkout" className="mt-3 flex h-8 items-center justify-center rounded-[7px] border border-primary bg-primary text-[13px] hover:bg-primary-hover">
            Proceed to checkout
          </Link>
        ) : (
          <Button block className="mt-3" disabled>Proceed to checkout</Button>
        )}
      </aside>
    </div>
  );
}
