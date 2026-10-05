import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Get to Know Us",
    links: [
      { label: "About amazone", href: "/" },
      { label: "Your Account", href: "/account" },
      { label: "Careers", href: "/" },
    ],
  },
  {
    title: "Make Money with Us",
    links: [
      { label: "Sell on amazone", href: "/products" },
      { label: "Today's Deals", href: "/products?deals=1" },
      { label: "Best Sellers", href: "/products?sort=rating" },
    ],
  },
  {
    title: "Payment Products",
    links: [
      { label: "Shop with points", href: "/products" },
      { label: "Gift cards", href: "/products?category=Electronics" },
      { label: "Reload your balance", href: "/account" },
    ],
  },
  {
    title: "Let Us Help You",
    links: [
      { label: "Your Account", href: "/account" },
      { label: "Your Orders", href: "/orders" },
      { label: "Shipping rates", href: "/checkout" },
      { label: "Returns", href: "/orders" },
      { label: "Help", href: "/account" },
    ],
  },
];

export function Footer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <footer className="mt-8 border-t border-line bg-white py-6 text-center text-[11px] text-muted">
        <p>Mock checkout. No payment is processed.</p>
      </footer>
    );
  }
  return (
    <footer className="mt-6">
      <a href="#top" className="block bg-nav-hover py-3 text-center text-[13px] text-white hover:bg-[#485769]">
        Back to top
      </a>
      <div className="bg-nav text-white">
        <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-2 text-[16px] font-bold">{column.title}</h2>
              <ul className="space-y-1.5 text-[14px] text-[#ddd]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:underline">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#3a4553] bg-mast py-6 text-center">
          <Logo light href="/" />
          <p className="mt-3 text-[12px] text-[#ccc]">English · United States</p>
          <ul className="mx-auto mt-3 flex max-w-[720px] flex-wrap justify-center gap-x-4 gap-y-1 px-4 text-[12px] text-[#ddd]">
            {NAV_LINKS.slice(0, 8).map((link) => (
              <li key={link.label}><Link href={link.href} className="hover:underline">{link.label}</Link></li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-[#999]">© 2026 amazone. A study storefront. Not affiliated with Amazon.</p>
        </div>
      </div>
    </footer>
  );
}
