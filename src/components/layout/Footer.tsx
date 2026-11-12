import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";
import { services } from "@/content/services";

// h2 i stället för h4 så att rubriknivåerna inte hoppar. Klasserna behåller utseendet.
const headingClass = "mb-[16px] text-[17px] leading-[1.5] font-extrabold tracking-normal";
const linkClass = "mb-[11px] block text-[15px] opacity-80 hover:opacity-100";

const companyLinks = [
  { label: "Så funkar det", href: "#sa-funkar-det" },
  { label: "Omdömen", href: "#omdomen" },
  { label: "Jobba hos oss", href: "#partner" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark pt-[64px] pb-[40px] text-white">
      <Container>
        <a href="#top" className="text-[26px] font-black tracking-[-0.01em]">
          {site.name}
        </a>
        <div className="mt-[40px] mb-[56px] grid grid-cols-[1.4fr_repeat(3,1fr)] gap-[40px] max-[960px]:grid-cols-2">
          <div>
            <p className="max-w-[290px] text-white/[0.76]">
              UniClean Städtjänster. Hemstäd, storstäd, flyttstäd och fönsterputs som du bokar i
              appen.
            </p>
          </div>
          <div>
            <h2 className={headingClass}>Tjänster</h2>
            {services.map((service) => (
              <a key={service.id} href="#tjanster" className={linkClass}>
                {service.name}
              </a>
            ))}
          </div>
          <div>
            <h2 className={headingClass}>UniClean</h2>
            {companyLinks.map((link) => (
              <a key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </a>
            ))}
          </div>
          <div>
            <h2 className={headingClass}>Hjälp</h2>
            <a href="#kontakt" className={linkClass}>
              Kontakt
            </a>
            <a href="#kontakt" className={linkClass}>
              Support
            </a>
            <a href={`mailto:${site.contact.email}`} className={linkClass}>
              {site.contact.email}
            </a>
            <Link href="/integritetspolicy/" className={linkClass}>
              Integritetspolicy
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-[10px] text-[13.5px] opacity-70">
          <span>
            © {year} {site.name}
          </span>
        </div>
      </Container>
    </footer>
  );
}
