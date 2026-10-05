import { Star } from "lucide-react";

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex" aria-label={`${value} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.min(1, Math.max(0, value - i));
          return (
            <span key={i} className="relative h-[15px] w-[15px]">
              <Star size={15} className="text-[#d5d9d9]" fill="#d5d9d9" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={15} className="text-star" fill="#ffa41c" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </span>
      {count != null && (
        <span className="text-[13px] text-link hover:text-link-hover">{count.toLocaleString()}</span>
      )}
    </span>
  );
}
