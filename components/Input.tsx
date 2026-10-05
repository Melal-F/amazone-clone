"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function Input({
  label,
  error,
  reveal = false,
  className = "",
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  reveal?: boolean;
}) {
  const [shown, setShown] = useState(false);
  const inputType = reveal ? (shown ? "text" : "password") : type;
  return (
    <label className="block text-[13px] font-bold text-ink">
      {label}
      <span className="relative mt-1 block font-normal">
        <input
          type={inputType}
          className={`h-8 w-full rounded-[3px] border bg-white px-2 text-[13px] outline-none focus:shadow-[0_0_0_3px_#c8f3fa] focus:outline focus:outline-2 focus:outline-[#888c8c] ${error ? "border-price" : "border-line-strong"} ${reveal ? "pr-9" : ""} ${className}`}
          {...props}
        />
        {reveal && (
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted"
            aria-label={shown ? "Hide password" : "Show password"}
            onClick={() => setShown((value) => !value)}
          >
            {shown ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </span>
      {error && <span className="mt-1 block text-[12px] font-normal text-price">{error}</span>}
    </label>
  );
}
