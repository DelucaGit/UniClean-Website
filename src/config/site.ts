export type Phone = {
  /** Som numret visas, till exempel "010-123 45 67". */
  display: string;
  /** Länken, till exempel "tel:+46101234567". */
  href: string;
};

export type SiteConfig = {
  name: string;
  url: string;
  links: {
    app: string;
    partner: string;
    googleReviews: string;
  };
  contact: {
    email: string;
    /** null tills det riktiga numret finns. Då visas inget telefonnummer någonstans. */
    phone: Phone | null;
  };
};

export const site: SiteConfig = {
  name: "UniClean",
  url: "https://uniclean.nu",
  links: {
    // TILLFÄLLIG: app ska bytas före lansering (#48). Byt bara här.
    app: "https://uniclean-partner.onrender.com/kund",
    partner: "https://unique-sable-358e98.netlify.app",
    googleReviews: "https://www.google.com/maps?cid=13736541404779941323&hl=sv",
  },
  contact: {
    email: "bokning@uniclean.nu",
    phone: null,
  },
};
