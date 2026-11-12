"use client";

import { useEffect } from "react";

/**
 * Hoppar direkt till ankaret när sidan öppnas med en adress som /#kontakt.
 * Webbläsarens egen mjuka scroll avbryts annars när sidan laddas klart,
 * och besökaren blir kvar högst upp.
 */
export function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const jump = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    jump();
    window.addEventListener("load", jump, { once: true });
    return () => window.removeEventListener("load", jump);
  }, []);
  return null;
}
