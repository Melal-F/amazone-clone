import type { Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  layout = "grid",
}: {
  products: Product[];
  layout?: "grid" | "list";
}) {
  if (layout === "list") {
    return (
      <div className="divide-y divide-line border-t border-line">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} layout="list" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
