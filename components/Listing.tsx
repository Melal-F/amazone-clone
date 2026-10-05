"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES, queryProducts } from "@/lib/catalog";
import { Breadcrumbs } from "./Breadcrumbs";
import { Button } from "./Button";
import { Drawer } from "./Drawer";
import { ProductGrid } from "./ProductGrid";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Avg. Customer Review" },
  { id: "newest", label: "Newest arrivals" },
];

function Filters({
  category,
  min,
  max,
  rating,
  deals,
  group,
  onChange,
}: {
  category: string;
  min: string;
  max: string;
  rating: string;
  deals: boolean;
  group: string;
  onChange: (changes: Record<string, string | null>) => void;
}) {
  const [minV, setMinV] = useState(min);
  const [maxV, setMaxV] = useState(max);
  useEffect(() => setMinV(min), [min]);
  useEffect(() => setMaxV(max), [max]);

  return (
    <div className="space-y-4 text-[14px]">
      <div>
        <h2 className="mb-2 font-bold">Department</h2>
        <ul className="space-y-1">
          <li>
            <button type="button" className={!category ? "font-bold text-link" : "hover:text-link-hover hover:underline"} onClick={() => onChange({ category: null })}>
              All departments
            </button>
          </li>
          {CATEGORIES.map((item) => (
            <li key={item}>
              <button
                type="button"
                className={category === item ? "font-bold text-link" : "hover:text-link-hover hover:underline"}
                onClick={() => onChange({ category: item })}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-line pt-3">
        <h2 className="mb-2 font-bold">Customer reviews</h2>
        {["4", "3", "2", "1"].map((value) => (
          <label key={value} className="mb-1 flex items-center gap-2">
            <input
              type="radio"
              name={`rating-${group}`}
              checked={rating === value}
              onChange={() => onChange({ rating: value })}
            />
            {value} stars & up
          </label>
        ))}
        {rating && (
          <button type="button" className="text-[13px] text-link hover:underline" onClick={() => onChange({ rating: null })}>
            Clear
          </button>
        )}
      </div>
      <div className="border-t border-line pt-3">
        <h2 className="mb-2 font-bold">Price</h2>
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onChange({ min: minV || null, max: maxV || null });
          }}
        >
          <input value={minV} onChange={(event) => setMinV(event.target.value)} inputMode="decimal" placeholder="Min" aria-label="Minimum price" className="h-8 w-16 rounded-[3px] border border-line-strong px-1" />
          <span className="text-muted">–</span>
          <input value={maxV} onChange={(event) => setMaxV(event.target.value)} inputMode="decimal" placeholder="Max" aria-label="Maximum price" className="h-8 w-16 rounded-[3px] border border-line-strong px-1" />
          <Button type="submit">Go</Button>
        </form>
      </div>
      <div className="border-t border-line pt-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={deals} onChange={(event) => onChange({ deals: event.target.checked ? "1" : null })} />
          Deals
        </label>
      </div>
    </div>
  );
}

export function Listing() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = sp.get("q") || "";
  const category = sp.get("category") || "";
  const min = sp.get("min") || "";
  const max = sp.get("max") || "";
  const rating = sp.get("rating") || "";
  const sort = sp.get("sort") || "featured";
  const deals = sp.get("deals") === "1";
  const view = sp.get("view") === "list" ? "list" : "grid";
  const page = Number(sp.get("page") || "1");

  const result = queryProducts({
    q,
    category,
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
    rating: rating ? Number(rating) : undefined,
    deals,
    sort,
    page,
  });

  function update(changes: Record<string, string | null>, keepPage = false) {
    const params = new URLSearchParams(sp.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    if (!keepPage) params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    setFiltersOpen(false);
  }

  const start = result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1;
  const end = Math.min(result.total, result.page * result.pageSize);
  const filters = (
    <Filters group="side" category={category} min={min} max={max} rating={rating} deals={deals} onChange={update} />
  );

  return (
    <div className="mx-auto max-w-[1500px] px-3 py-4 md:px-4">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category || (q ? "Search" : "All products"), href: category ? `/products?category=${category}` : "/products" },
          ...(q ? [{ label: `"${q}"` }] : []),
        ]}
      />
      <div className="mt-3 flex gap-6">
        <aside className="hidden w-[220px] shrink-0 lg:block">{filters}</aside>
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-2">
            <p className="text-[14px] text-muted">
              {result.total === 0 ? "No results" : `${start}-${end} of ${result.total} results`}
              {q && <span> for <span className="font-bold text-ink">“{q}”</span></span>}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="inline-flex h-8 items-center gap-1 rounded-[7px] border border-line-strong px-2 text-[13px] lg:hidden" onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal size={14} /> Filters
              </button>
              <label className="flex items-center gap-1 text-[13px]">
                Sort by
                <select value={sort} onChange={(event) => update({ sort: event.target.value === "featured" ? null : event.target.value })} className="h-8 rounded-[4px] border border-line-strong bg-soft px-1">
                  {SORTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
              <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} className={`grid h-8 w-8 place-items-center border ${view === "grid" ? "border-ink" : "border-line"}`} onClick={() => update({ view: null }, true)}>
                <LayoutGrid size={16} />
              </button>
              <button type="button" aria-label="List view" aria-pressed={view === "list"} className={`grid h-8 w-8 place-items-center border ${view === "list" ? "border-ink" : "border-line"}`} onClick={() => update({ view: "list" }, true)}>
                <List size={16} />
              </button>
            </div>
          </div>
          {(category || min || max || rating || deals) && (
            <button type="button" className="mb-3 text-[13px] text-link hover:underline" onClick={() => router.push(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname)}>
              Clear filters
            </button>
          )}
          {result.total === 0 ? (
            <div className="py-10">
              <h1 className="text-[24px] font-normal">No matches</h1>
              <p className="mt-2 text-muted">Try a broader search, or clear the filters.</p>
            </div>
          ) : (
            <ProductGrid products={result.items} layout={view} />
          )}
          {result.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button variant="secondary" disabled={result.page <= 1} onClick={() => update({ page: String(result.page - 1) }, true)}>Previous</Button>
              <span className="text-[13px] text-muted">Page {result.page} of {result.pages}</span>
              <Button variant="secondary" disabled={result.page >= result.pages} onClick={() => update({ page: String(result.page + 1) }, true)}>Next</Button>
            </div>
          )}
        </div>
      </div>
      <Drawer open={filtersOpen} title="Filters" onClose={() => setFiltersOpen(false)} side="right">
        <div className="p-4">
          <Filters group="drawer" category={category} min={min} max={max} rating={rating} deals={deals} onChange={update} />
        </div>
      </Drawer>
    </div>
  );
}
