"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Drawer({
  open,
  title,
  onClose,
  children,
  side = "left",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[rgba(15,17,17,.7)]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute top-0 flex h-full w-[min(365px,100%)] flex-col bg-white ${side === "right" ? "right-0" : "left-0"}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-mast px-4 py-3 text-white">
          <h2 className="text-[18px] font-bold">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
