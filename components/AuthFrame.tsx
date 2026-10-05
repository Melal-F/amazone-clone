"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { Modal } from "./Modal";

export function AuthFrame({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<"terms" | "privacy" | null>(null);
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[350px] px-4 py-4 pb-10">
        <div className="mb-4 flex justify-center"><Logo /></div>
        {children}
        <div className="mt-6 flex items-center justify-center gap-3 text-[11px]">
          <button type="button" className="text-link hover:text-link-hover hover:underline" onClick={() => setOpen("terms")}>Conditions of Use</button>
          <button type="button" className="text-link hover:text-link-hover hover:underline" onClick={() => setOpen("privacy")}>Privacy Notice</button>
          <Link href="/" className="text-link hover:text-link-hover hover:underline">Help</Link>
        </div>
      </div>
      <Modal open={open != null} title={open === "privacy" ? "Privacy Notice" : "Conditions of Use"} onClose={() => setOpen(null)}>
        <p className="text-[13px] font-normal leading-5">
          This is a local demo. Accounts, carts, and orders stay in your browser. No payment is taken and no data is sent to a server.
        </p>
      </Modal>
    </div>
  );
}

export function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
