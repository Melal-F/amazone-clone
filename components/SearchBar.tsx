"use client";

import { CATEGORIES, suggest } from "@/lib/catalog";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const matches = suggest(q);

  function go(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    setOpen(false);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={go} className="relative" role="search">
      <div className="flex h-10 overflow-hidden rounded-[4px] bg-white focus-within:shadow-[0_0_0_2px_#ff9900,0_0_0_3px_rgba(255,153,0,.5)]">
        <label className="sr-only" htmlFor="search-category">Department</label>
        <select
          id="search-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="hidden h-full w-16 shrink-0 border-r border-[#cdcdcd] bg-scope px-1 text-[12px] text-ink hover:bg-scope-hover sm:block lg:w-32"
        >
          <option value="">All</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="search-query">Search amazone</label>
        <input
          id="search-query"
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search amazone"
          className="min-w-0 flex-1 px-3 text-[15px] text-ink outline-none"
        />
        <button type="submit" aria-label="Search" className="grid w-11 shrink-0 place-items-center bg-search text-ink hover:bg-search-hover">
          <Search size={22} strokeWidth={2.5} />
        </button>
      </div>
      {open && matches.length > 0 && (
        <ul className="absolute top-full z-30 mt-px w-full border border-line bg-white text-ink shadow-[0_2px_5px_rgba(15,17,17,.15)]">
          {matches.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                className="block w-full truncate px-3 py-2 text-left text-[13px] hover:bg-soft"
                onClick={() => {
                  setOpen(false);
                  router.push(`/product/${product.id}`);
                }}
              >
                {product.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
