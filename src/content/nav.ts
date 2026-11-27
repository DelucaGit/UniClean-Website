import { sectionHref, type SectionId } from "./sections";

export type NavLink = {
  label: string;
  href: string;
};

// Menyns etiketter, i menyns ordning.
const labels = {
  "sa-funkar-det": "Så funkar det",
  tjanster: "Tjänster",
  omdomen: "Omdömen",
  partner: "Jobba hos oss",
  kontakt: "Hjälp",
} satisfies Partial<Record<SectionId, string>>;

type MenuSection = keyof typeof labels;

/** Samma etikett och länk som i menyn, för sidfoten och andra ställen. */
export function menuLink(id: MenuSection): NavLink {
  return { label: labels[id], href: sectionHref(id) };
}

export const navLinks: readonly NavLink[] = (Object.keys(labels) as MenuSection[]).map(menuLink);
