import { formatMoney } from "@/lib/money";

export function Price({
  price,
  original,
  size = "md",
}: {
  price: number;
  original?: number;
  size?: "sm" | "md" | "lg";
}) {
  const [whole, frac] = formatMoney(price).split(".");
  const onSale = original != null && original > price;
  if (size === "lg") {
    return (
      <span className="inline-flex flex-wrap items-start gap-x-2 text-ink">
        <span>
          <sup className="text-[13px] font-medium">$</sup>
          <span className="text-[28px] leading-none">{whole}</span>
          <sup className="text-[13px] font-medium">{frac}</sup>
        </span>
        {onSale && (
          <span className="pt-1 text-[13px] text-muted line-through">${formatMoney(original)}</span>
        )}
      </span>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
      <span className={size === "sm" ? "text-[14px] font-bold text-ink" : "text-[18px] text-ink"}>
        <sup className="text-[11px]">$</sup>
        {whole}
        <sup className="text-[11px]">{frac}</sup>
      </span>
      {onSale && <span className="text-[12px] text-muted line-through">${formatMoney(original)}</span>}
    </span>
  );
}
