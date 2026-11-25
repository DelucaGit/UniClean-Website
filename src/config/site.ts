import type { ServiceId } from "@/content/services";

/** Värde för länkar och uppgifter som ännu inte är levererade. */
export const PLACEHOLDER = "#";

export function isPlaceholder(value: string): boolean {
  return value === PLACEHOLDER;
}

export type SiteConfig = {
  name: string;
  url: string;
  links: {
    app: string;
    login: string;
    partner: string;
    googleReviews: string;
  };
  contact: {
    email: string;
    phone: string;
    phoneHref: string;
  };
};

export const site: SiteConfig = {
  name: "UniClean",
  url: "https://uniclean.nu",
  links: {
    // TILLFÄLLIGA: app och login ska bytas före lansering (#48). Byt bara här.
    app: "https://uniclean-partner.onrender.com/kund",
    login: "https://uniclean-partner.onrender.com/kund",
    partner: "https://unique-sable-358e98.netlify.app",
    googleReviews: "https://www.google.com/maps?cid=13736541404779941323&hl=sv",
  },
  contact: {
    email: "bokning@uniclean.nu",
    phone: "010-XXX XX XX",
    phoneHref: PLACEHOLDER,
  },
};

export type BookingParams = {
  service?: ServiceId;
  postnummer?: string;
};

/**
 * Länk till bokningen i appen. Returnerar i dag bara `links.app`.
 * Parametrarna läggs till i länken i #48.
 */
export function bookingUrl(params: BookingParams = {}): string {
  void params;
  return site.links.app;
}
