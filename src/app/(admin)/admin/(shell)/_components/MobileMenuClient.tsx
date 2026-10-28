"use client";

import { useState } from "react";
import NavLinks from "./NavLinks";
import LogoutButton from "./LogoutButton";

/** Mobile drawer menu for the admin shell. */
export default function MobileMenuClient() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
      >
        <span className="block h-[2.5px] w-6 bg-white" />
        <span className="block h-[2.5px] w-6 bg-white" />
        <span className="block h-[2.5px] w-6 bg-white" />
      </button>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col bg-[#161c24] p-5">
            <div className="flex items-center justify-between px-2 py-3">
              <span className="font-heading text-[16px] font-semibold text-white">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xl text-white"
              >
                ×
              </button>
            </div>
            <div className="mt-2 flex-1">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <LogoutButton />
          </aside>
        </div>
      )}
    </>
  );
}
