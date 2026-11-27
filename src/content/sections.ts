// Sektionerna på startsidan. Ankaret syns i adressen (/#tjanster) och kan finnas i gamla länkar
// och bokmärken, så tänk efter innan ett ankare byts. Ordningen på sidan styrs av src/app/page.tsx.

export const sectionIds = [
  "top",
  "sa-funkar-det",
  "tjanster",
  "pris",
  "trygghet",
  "omdomen",
  "video",
  "partner",
  "kontakt",
] as const;

export type SectionId = (typeof sectionIds)[number];

/** Länk till en sektion på startsidan, som fungerar även från undersidor. */
export function sectionHref(id: SectionId): string {
  return `/#${id}`;
}

/** Ankaret för en sektion, till id på sektionens element. Typen fångar stavfel. */
export function sectionId(id: SectionId): SectionId {
  return id;
}
