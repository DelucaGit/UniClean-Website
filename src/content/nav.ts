export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: readonly NavLink[] = [
  { label: "Så funkar det", href: "/#sa-funkar-det" },
  { label: "Tjänster", href: "/#tjanster" },
  { label: "Omdömen", href: "/#omdomen" },
  { label: "Jobba hos oss", href: "/#partner" },
  { label: "Hjälp", href: "/#kontakt" },
];
