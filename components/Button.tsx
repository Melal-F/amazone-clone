import { ButtonHTMLAttributes } from "react";

const styles = {
  primary: "border-primary bg-primary text-ink hover:bg-primary-hover",
  buy: "border-[#ff8f00] bg-buy text-ink hover:bg-buy-hover",
  secondary: "border-line-strong bg-white text-ink shadow-[0_2px_5px_rgba(213,217,217,.5)] hover:bg-soft",
  link: "h-auto border-transparent bg-transparent px-0 text-link hover:text-link-hover hover:underline",
};

export function Button({
  variant = "primary",
  block = false,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles;
  block?: boolean;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-[7px] border px-2.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-50 ${block ? "h-8 w-full" : "h-[29px]"} ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
