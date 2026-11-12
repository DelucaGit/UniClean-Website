"use client";

import { useEffect, useRef, useState } from "react";
import type { NavLink } from "@/content/nav";

type MobileMenuProps = {
  links: readonly NavLink[];
  loginHref: string;
};

const PANEL_ID = "mobilmeny";

const panelLink =
  "rounded-r px-[12px] py-[12px] text-[16px] font-bold hover:bg-white/[.12]";

export function MobileMenu({ links, loginHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="hidden max-[960px]:block">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-label={open ? "Stäng menyn" : "Öppna menyn"}
        onClick={() => setOpen((value) => !value)}
        className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full hover:bg-white/[.12]"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      <div
        id={PANEL_ID}
        hidden={!open}
        className="absolute top-full right-0 left-0 border-t border-white/[.12] bg-dark px-[20px] pt-[8px] pb-[16px]"
      >
        <nav aria-label="Mobilmeny" className="flex flex-col">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={close} className={panelLink}>
              {link.label}
            </a>
          ))}
          <a href={loginHref} onClick={close} className={panelLink}>
            Logga in
          </a>
        </nav>
      </div>
    </div>
  );
}
