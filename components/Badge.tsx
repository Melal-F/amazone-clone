import type { Badge as BadgeName } from "@/lib/catalog";

const styles: Record<BadgeName, string> = {
  "Best Seller": "bg-[#c45500] text-white",
  Deal: "bg-deal text-white",
  Limited: "bg-[#b12704] text-white",
};

export function Badge({ name }: { name: BadgeName }) {
  return (
    <span className={`inline-block rounded-[2px] px-1.5 py-0.5 text-[12px] font-bold leading-none ${styles[name]}`}>
      {name}
    </span>
  );
}
