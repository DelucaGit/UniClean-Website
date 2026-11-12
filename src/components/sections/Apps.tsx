import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

type AppCard = {
  title: string;
  text: string;
  href: string;
  track: string;
  iconBg: string;
  icon: ReactNode;
};

const cards: AppCard[] = [
  {
    title: "För kunder",
    text: "Boka städning i mobilen. Du behöver inte ladda ner något.",
    href: site.links.app,
    track: "app-kund",
    iconBg: "bg-dark",
    icon: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
  },
  {
    title: "För städare",
    text: "Ansök som partner och ta uppdrag nära dig.",
    href: site.links.partner,
    track: "app-partner",
    iconBg: "bg-accent",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
      </>
    ),
  },
];

export function Apps() {
  return (
    <section id="appar" className="soft">
      <Container>
        <h2>Öppna appen</h2>
        <div className="mt-[30px] grid grid-cols-2 gap-[20px] max-[960px]:grid-cols-1">
          {cards.map((card) => (
            <a
              key={card.track}
              href={card.href}
              data-track={card.track}
              className="flex items-center gap-[20px] rounded-r border border-line bg-white p-[24px] hover:border-ink max-[560px]:flex-wrap"
            >
              <div
                className={`grid h-[64px] w-[64px] flex-none place-items-center rounded-[16px] ${card.iconBg}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-[30px] w-[30px] fill-none stroke-white [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]"
                >
                  {card.icon}
                </svg>
              </div>
              <div>
                <h3 className="text-[21px]">{card.title}</h3>
                <p className="mt-[2px] text-[15.5px]">{card.text}</p>
              </div>
              <span className="ml-auto text-[15px] font-extrabold whitespace-nowrap max-[560px]:ml-[84px]">
                Öppna
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
