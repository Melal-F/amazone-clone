"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";

export function Navigation({ onAll }: { onAll: () => void }) {
  return (
    <nav className="hidden h-[39px] bg-nav text-white md:block" aria-label="Departments">
      <div className="mx-auto flex h-full max-w-[1500px] items-center gap-0.5 px-2 md:px-3">
        <button
          type="button"
          onClick={onAll}
          className="flex h-full shrink-0 items-center gap-1 px-2 text-[14px] font-bold hover:outline hover:outline-1 hover:outline-white"
        >
          <Menu size={18} />
          All
        </button>
        <div className="nav-scroll flex h-full min-w-0 flex-1 items-center overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex h-full shrink-0 items-center px-2 text-[14px] whitespace-nowrap hover:outline hover:outline-1 hover:outline-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
