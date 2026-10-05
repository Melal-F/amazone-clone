"use client";

import { MapPin, Menu, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "./Button";
import { Input } from "./Input";
import { Logo } from "./Logo";
import { Modal } from "./Modal";
import { SearchBar } from "./SearchBar";

export function Header({ onMenu }: { onMenu: () => void }) {
  const path = usePathname();
  const { session, location, cartCount, setLocation, signout } = useStore();
  const [locOpen, setLocOpen] = useState(false);
  const [city, setCity] = useState(location.city);
  const [zip, setZip] = useState(location.zip);
  const accountHref = session ? "/account" : "/signin?next=/account";

  if (path.startsWith("/checkout")) {
    return (
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4">
          <Logo />
          <p className="text-[21px] font-normal text-ink">Checkout</p>
          <p className="text-[13px] text-muted">Secure</p>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-mast text-white">
      <div className="mx-auto flex h-[60px] max-w-[1500px] items-center gap-2 px-2 md:gap-3 md:px-4">
        <button type="button" className="grid h-10 w-10 place-items-center md:hidden" aria-label="Open menu" onClick={onMenu}>
          <Menu size={22} />
        </button>
        <Logo light />
        <button
          type="button"
          className="hidden items-center gap-1 rounded-sm px-1 py-1 text-left hover:outline hover:outline-1 hover:outline-white md:flex"
          onClick={() => {
            setCity(location.city);
            setZip(location.zip);
            setLocOpen(true);
          }}
        >
          <MapPin size={18} className="mt-2 shrink-0" />
          <span className="hidden min-w-0 leading-tight lg:block">
            <span className="block truncate text-[12px] font-normal text-[#ccc]">Delivering to {location.city} {location.zip}</span>
            <span className="block truncate text-[14px] font-bold">Update location</span>
          </span>
        </button>
        <div className="hidden min-w-0 flex-1 md:block">
          <SearchBar />
        </div>
        <div className="ml-auto flex items-center">
          <div className="group relative">
            <Link href={accountHref} className="hidden rounded-sm px-2 py-1 leading-tight hover:outline hover:outline-1 hover:outline-white md:block">
              <span className="block text-[12px] text-[#ccc]">Hello, {session ? session.name.split(" ")[0] : "sign in"}</span>
              <span className="block text-[14px] font-bold">Account & Lists</span>
            </Link>
            <div className="absolute right-0 z-40 hidden pt-1 group-hover:block group-focus-within:block">
              <div className="w-[220px] border border-line bg-white p-3 text-ink shadow-[0_2px_5px_rgba(15,17,17,.15)]">
                {!session && (
                  <Link href="/signin" className="mb-2 flex h-8 items-center justify-center rounded-[7px] border border-primary bg-primary text-[13px] text-ink">
                    Sign in
                  </Link>
                )}
                {!session && <p className="mb-2 text-[12px]">New customer? <Link href="/signup" className="text-link hover:text-link-hover hover:underline">Start here.</Link></p>}
                <Link href="/account" className="block py-1 text-[13px] hover:text-link-hover hover:underline">Your Account</Link>
                <Link href="/orders" className="block py-1 text-[13px] hover:text-link-hover hover:underline">Your Orders</Link>
                {session && (
                  <button type="button" className="mt-1 text-[13px] text-link hover:text-link-hover hover:underline" onClick={signout}>
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </div>
          <Link href={accountHref} className="grid h-10 w-10 place-items-center md:hidden" aria-label="Account">
            <User size={22} />
          </Link>
          <Link href="/orders" className="hidden rounded-sm px-2 py-1 leading-tight hover:outline hover:outline-1 hover:outline-white lg:block">
            <span className="block text-[12px] text-[#ccc]">Returns</span>
            <span className="block text-[14px] font-bold">& Orders</span>
          </Link>
          <Link href="/cart" className="flex items-end gap-1 rounded-sm px-2 py-1 hover:outline hover:outline-1 hover:outline-white" aria-label={`${cartCount} items in cart`}>
            <span className="relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[16px] font-bold leading-none text-cart">{cartCount}</span>
              <ShoppingCart size={34} strokeWidth={1.5} />
            </span>
            <span className="hidden pb-0.5 text-[14px] font-bold sm:inline">Cart</span>
          </Link>
        </div>
      </div>
      <div className="px-2 pb-2 md:hidden">
        <SearchBar />
      </div>
      <Modal open={locOpen} title="Choose your location" onClose={() => setLocOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!city.trim() || !/^\d{5}$/.test(zip.trim())) return;
            setLocation(city, zip);
            setLocOpen(false);
          }}
        >
          <p className="text-[13px] font-normal text-muted">Delivery options and speeds vary for this address. Saved on this device only.</p>
          <Input label="City" value={city} onChange={(event) => setCity(event.target.value)} required />
          <Input label="ZIP code" value={zip} onChange={(event) => setZip(event.target.value)} inputMode="numeric" required pattern="\d{5}" />
          <Button type="submit" block>Done</Button>
        </form>
      </Modal>
    </header>
  );
}
