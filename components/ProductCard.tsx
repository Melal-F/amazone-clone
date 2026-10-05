import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { arrival } from "@/lib/money";
import { Badge } from "./Badge";
import { Price } from "./Price";
import { Rating } from "./Rating";

export function ProductCard({
  product,
  layout = "grid",
}: {
  product: Product;
  layout?: "grid" | "list";
}) {
  const image = (
    <img
      src={product.images[0]}
      alt={product.title}
      className={layout === "list" ? "h-36 w-36 object-contain" : "mx-auto h-40 w-full object-contain"}
      loading="lazy"
    />
  );
  const body = (
    <div className="min-w-0">
      {product.badge && (
        <div className="mb-1">
          <Badge name={product.badge} />
        </div>
      )}
      <Link href={`/product/${product.id}`} className="line-clamp-2 text-[14px] leading-5 text-ink hover:text-link-hover hover:underline">
        {product.title}
      </Link>
      <div className="mt-1">
        <Rating value={product.rating} count={product.reviewCount} />
      </div>
      <div className="mt-1">
        <Price price={product.price} original={product.originalPrice} size={layout === "list" ? "md" : "sm"} />
      </div>
      {product.discount > 0 && <p className="text-[12px] text-price">-{product.discount}%</p>}
      {product.prime && product.availability !== "Currently unavailable" && (
        <p className="mt-1 text-[12px] text-ink">
          FREE delivery <span className="font-bold">{arrival(5)}</span>
        </p>
      )}
      {product.availability === "Only a few left" && (
        <p className="text-[12px] text-price">Only a few left in stock</p>
      )}
    </div>
  );

  if (layout === "list") {
    return (
      <article className="flex gap-4 bg-white py-4">
        <Link href={`/product/${product.id}`} className="shrink-0">{image}</Link>
        {body}
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col bg-white p-3">
      <Link href={`/product/${product.id}`} className="mb-2 block">{image}</Link>
      {body}
    </article>
  );
}
