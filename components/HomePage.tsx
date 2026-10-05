"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductCard } from "./ProductCard";
import { SectionHeader } from "./SectionHeader";

const slides = [
  {
    title: "Refresh the living room",
    kicker: "Home",
    href: "/products?category=Home",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=70",
  },
  {
    title: "Headphones, speakers, TVs",
    kicker: "Electronics",
    href: "/products?category=Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=70",
  },
  {
    title: "Court sneakers under $90",
    kicker: "Fashion",
    href: "/products?category=Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=70",
  },
];

function Row({ title, href, products }: { title: string; href: string; products: typeof PRODUCTS }) {
  return (
    <section className="bg-white px-4 py-4">
      <SectionHeader title={title} href={href} />
      <div className="nav-scroll flex gap-3 overflow-x-auto pb-1">
        {products.map((product) => (
          <div key={product.id} className="w-[168px] shrink-0 sm:w-[200px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  const { session } = useStore();
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const deals = PRODUCTS.filter((product) => product.discount >= 15).slice(0, 4);
  const categories = CATEGORIES.slice(0, 4).map((category) => ({
    category,
    product: PRODUCTS.find((item) => item.category === category)!,
  }));

  return (
    <div>
      <div className="relative">
        <div className="relative h-[280px] overflow-hidden bg-mast sm:h-[360px] lg:h-[420px]">
          <img src={slide.image} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute top-4 left-12 max-w-[220px] bg-white/95 p-3 sm:top-6 sm:left-16 sm:max-w-xs">
            <p className="text-[12px] text-muted">{slide.kicker}</p>
            <p className="text-[21px] font-bold leading-6">{slide.title}</p>
            <Link href={slide.href} className="text-[13px] text-link hover:text-link-hover hover:underline">Shop now</Link>
          </div>
          <button
            type="button"
            aria-label="Previous slide"
            className="absolute top-24 left-0 grid h-12 w-8 place-items-center bg-white/80 text-ink sm:top-28 sm:h-16 sm:w-9"
            onClick={() => setIndex((value) => (value + slides.length - 1) % slides.length)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="absolute top-24 right-0 grid h-12 w-8 place-items-center bg-white/80 text-ink sm:top-28 sm:h-16 sm:w-9"
            onClick={() => setIndex((value) => (value + 1) % slides.length)}
          >
            <ChevronRight />
          </button>
        </div>
        <div className="relative z-10 mx-auto -mt-24 grid max-w-[1500px] grid-cols-1 gap-4 px-3 sm:-mt-32 sm:grid-cols-2 xl:grid-cols-4 xl:px-4">
          <article className="bg-white p-4">
            <h2 className="mb-3 text-[21px] font-bold leading-6">Shop by category</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(({ category, product }) => (
                <Link key={category} href={`/products?category=${category}`} className="text-[12px]">
                  <span className="mb-1 block h-24 bg-soft">
                    <img src={product.images[0]} alt="" className="h-full w-full object-contain" />
                  </span>
                  {category}
                </Link>
              ))}
            </div>
            <Link href="/products" className="mt-3 inline-block text-[13px] text-link hover:text-link-hover hover:underline">See all departments</Link>
          </article>
          <article className="bg-white p-4">
            <h2 className="mb-3 text-[21px] font-bold leading-6">Deals under $100</h2>
            <div className="grid grid-cols-2 gap-3">
              {deals.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="text-[12px]">
                  <span className="relative mb-1 block h-24 bg-white">
                    <img src={product.images[0]} alt="" className="h-full w-full object-contain" />
                    <span className="absolute top-1 left-1 bg-deal px-1 text-[11px] font-bold text-white">-{product.discount}%</span>
                  </span>
                  <span className="line-clamp-2">{product.title}</span>
                </Link>
              ))}
            </div>
            <Link href="/products?deals=1" className="mt-3 inline-block text-[13px] text-link hover:text-link-hover hover:underline">See all deals</Link>
          </article>
          <article className="bg-white p-4">
            <h2 className="mb-3 text-[21px] font-bold leading-6">Gaming gear</h2>
            <Link href="/products?category=Gaming">
              <img src={PRODUCTS.find((item) => item.id === "g1")?.images[0]} alt="Wireless controller" className="h-40 w-full object-contain" />
            </Link>
            <Link href="/products?category=Gaming" className="mt-2 inline-block text-[13px] text-link hover:text-link-hover hover:underline">Shop gaming</Link>
          </article>
          <article className="bg-white p-4">
            <h2 className="mb-3 text-[21px] font-bold leading-6">
              {session ? `Hello, ${session.name.split(" ")[0]}` : "Sign in for the best experience"}
            </h2>
            {session ? (
              <p className="text-[14px] text-muted">Your cart and orders stay on this device.</p>
            ) : (
              <Link href="/signin" className="flex h-8 items-center justify-center rounded-[7px] border border-primary bg-primary text-[13px] text-ink hover:bg-primary-hover">
                Sign in securely
              </Link>
            )}
            <Link href="/signup" className="mt-4 block text-[13px] text-link hover:text-link-hover hover:underline">
              {session ? "Manage your account" : "Create an account"}
            </Link>
          </article>
        </div>
      </div>
      <div className="mx-auto mt-4 max-w-[1500px] space-y-4 px-3 pb-8 xl:px-4">
        <Row title="Today's deals" href="/products?deals=1" products={PRODUCTS.filter((product) => product.discount >= 15).slice(0, 10)} />
        <section className="grid gap-4 md:grid-cols-2">
          <Link href="/products?category=Kitchen" className="relative block h-40 overflow-hidden bg-white">
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=70" alt="" className="h-full w-full object-cover" />
            <span className="absolute bottom-3 left-3 bg-white px-3 py-2 text-[18px] font-bold">Kitchen under $80</span>
          </Link>
          <Link href="/products?category=Books" className="relative block h-40 overflow-hidden bg-white">
            <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=70" alt="" className="h-full w-full object-cover" />
            <span className="absolute bottom-3 left-3 bg-white px-3 py-2 text-[18px] font-bold">Books from $14</span>
          </Link>
        </section>
        <Row title="Recommended for you" href="/products" products={PRODUCTS.slice(0, 10)} />
        <Row title="Best sellers" href="/products?sort=rating" products={[...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 10)} />
      </div>
    </div>
  );
}
