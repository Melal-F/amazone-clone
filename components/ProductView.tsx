"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { flushSync } from "react-dom";
import { getProduct, relatedProducts, reviewsFor } from "@/lib/catalog";
import { arrival } from "@/lib/money";
import { useStore } from "@/lib/store";
import { Badge } from "./Badge";
import { Breadcrumbs } from "./Breadcrumbs";
import { Button } from "./Button";
import { Price } from "./Price";
import { ProductCard } from "./ProductCard";
import { Rating } from "./Rating";
import { SectionHeader } from "./SectionHeader";

export function ProductView({ id }: { id: string }) {
  const product = getProduct(id);
  const router = useRouter();
  const { addToCart } = useStore();
  const [photo, setPhoto] = useState(0);
  const [color, setColor] = useState(product?.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-[28px] font-normal">We could not find that product.</h1>
        <Button className="mt-4" onClick={() => router.push("/products")}>Continue shopping</Button>
      </div>
    );
  }

  const unavailable = product.availability === "Currently unavailable";
  const reviews = reviewsFor(product);
  const related = relatedProducts(product.id);

  function add() {
    addToCart(product!.id, qty, color);
    setAdded(true);
  }

  const purchase = () => (
    <div className="border border-line p-4">
      <Price price={product.price} original={product.originalPrice} size="lg" />
      {product.discount > 0 && <p className="mt-1 text-[14px] text-price">-{product.discount}% off list price</p>}
      {product.prime && !unavailable && (
        <p className="mt-2 text-[14px]">
          FREE delivery <span className="font-bold">{arrival(5)}</span>
        </p>
      )}
      <p className={`mt-2 text-[18px] ${unavailable ? "text-price" : "text-stock"}`}>{product.availability}</p>
      {product.colors && (
        <div className="mt-3">
          <p className="text-[14px]">Color: <span className="font-bold">{color}</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setColor(item)}
                className={`h-8 rounded-[4px] border px-3 text-[13px] ${color === item ? "border-[#e77600] ring-1 ring-[#e77600]" : "border-line-strong"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
      <label className="mt-3 flex items-center gap-2 text-[13px]">
        Qty
        <span className="inline-flex h-8 items-center rounded-[4px] border border-line-strong bg-soft">
          <button type="button" className="w-8" aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
          <span className="w-6 text-center">{qty}</span>
          <button type="button" className="w-8" aria-label="Increase quantity" onClick={() => setQty((value) => Math.min(10, value + 1))}>+</button>
        </span>
      </label>
      <div className="mt-3 space-y-2">
        <Button block disabled={unavailable} onClick={add}>Add to Cart</Button>
        <Button
          block
          variant="buy"
          disabled={unavailable}
          onClick={() => {
            flushSync(() => add());
            router.push("/checkout");
          }}
        >
          Buy Now
        </Button>
      </div>
      {added && <p className="mt-2 text-[13px] text-stock">Added to cart</p>}
      <p className="mt-3 text-[12px] text-muted">Ships from amazone · Sold by {product.brand}</p>
    </div>
  );

  return (
    <div className="pb-20 lg:pb-8">
      <div className="mx-auto max-w-[1500px] px-3 py-3 md:px-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: product.category, href: `/products?category=${product.category}` },
            { label: product.title },
          ]}
        />
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)_280px] lg:items-start">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:w-16 sm:flex-col sm:overflow-visible">
                {product.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setPhoto(index)}
                    className={`h-14 w-14 shrink-0 border bg-white p-1 ${photo === index ? "border-[#e77600]" : "border-line"}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
              <div className="order-1 flex min-h-[280px] flex-1 items-center justify-center bg-white sm:order-2">
                <img src={product.images[photo]} alt={product.title} className="max-h-[420px] w-full object-contain" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-[24px] font-normal leading-8">{product.title}</h1>
            <p className="mt-1 text-[14px]">
              Brand: <span className="text-link">{product.brand}</span>
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Rating value={product.rating} count={product.reviewCount} />
              <span className="text-[13px] text-link">ratings</span>
            </div>
            {product.badge && <div className="mt-2"><Badge name={product.badge} /></div>}
            <hr className="my-3 border-line" />
            <div className="lg:hidden">{purchase()}</div>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-[14px] leading-5">
              {product.highlights.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="hidden lg:block lg:sticky lg:top-[110px]">{purchase()}</div>
        </div>

        <section className="mt-8 border-t border-line pt-4">
          <h2 className="text-[21px] font-bold">Product description</h2>
          <p className="mt-2 max-w-3xl text-[14px] leading-6">{product.description}</p>
        </section>
        <section className="mt-6">
          <h2 className="mb-2 text-[21px] font-bold">Specifications</h2>
          <table className="w-full max-w-3xl text-[14px]">
            <tbody>
              {product.specifications.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <th className="w-40 bg-soft px-3 py-2 text-left font-normal text-muted">{row.label}</th>
                  <td className="px-3 py-2">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="mt-6">
          <h2 className="text-[21px] font-bold">Customer reviews</h2>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={product.rating} />
            <span className="text-[18px]">{product.rating} out of 5</span>
          </div>
          <p className="text-[13px] text-muted">{product.reviewCount.toLocaleString()} global ratings</p>
          <ul className="mt-4 max-w-3xl divide-y divide-line">
            {reviews.map((review) => (
              <li key={review.id} className="py-3">
                <p className="font-bold">{review.name}</p>
                <Rating value={review.rating} />
                <p className="font-bold">{review.title}</p>
                <p className="text-[12px] text-muted">Reviewed on {review.date}</p>
                <p className="mt-1">{review.body}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-8">
          <SectionHeader title="Related products" href={`/products?category=${product.category}`} />
          <div className="nav-scroll flex gap-3 overflow-x-auto">
            {related.map((item) => (
              <div key={item.id} className="w-[180px] shrink-0">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-white px-3 py-2 lg:hidden">
        <Price price={product.price} original={product.originalPrice} size="sm" />
        <Button className="ml-auto" disabled={unavailable} onClick={add}>Add to Cart</Button>
      </div>
    </div>
  );
}
