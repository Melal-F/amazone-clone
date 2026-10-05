"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/nav";
import { Drawer } from "./Drawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Navigation } from "./Navigation";

const AUTH = ["/signin", "/signup", "/forgot-password"];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const bare = AUTH.some((item) => path.startsWith(item));
  const slim = path.startsWith("/checkout");

  if (bare) return <>{children}</>;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2 focus:text-ink">
        Skip to main content
      </a>
      <div className="sticky top-0 z-40">
        <Header onMenu={() => setOpen(true)} />
        {!slim && <Navigation onAll={() => setOpen(true)} />}
      </div>
      <Drawer open={open} title="Browse" onClose={() => setOpen(false)}>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="border-b border-line">
              <Link href={link.href} className="block px-5 py-3 text-[16px]" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Drawer>
      <main id="main" className={`flex-1 ${path === "/" ? "bg-floor" : "bg-white"}`}>
        {children}
      </main>
      <Footer compact={slim} />
    </>
  );
}
