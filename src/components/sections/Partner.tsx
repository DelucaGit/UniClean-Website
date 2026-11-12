import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";

export function Partner() {
  return (
    <section id="partner" className="pt-0">
      <Container>
        <div className="relative flex min-h-[500px] items-end overflow-hidden rounded-r p-[32px] max-[560px]:min-h-[520px] max-[560px]:p-[12px]">
          <Image
            src="/img/partner.jpg"
            alt="Städare som torkar av en yta"
            fill
            sizes="(max-width: 1240px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="relative max-w-[500px] rounded-r bg-white p-[34px] max-[560px]:p-[22px]">
            <h2>Jobba som städare hos UniClean</h2>
            <p className="mt-[12px]">
              Som partner tar du emot uppdrag nära dig i appen och bestämmer själv när du jobbar.
            </p>
            <div className="mt-[28px] flex flex-wrap items-center gap-[26px]">
              <Button href={site.links.partner} track="partner-sektion">
                Ansök som partner
              </Button>
              <TextLink href={site.links.partnerLogin}>Logga in</TextLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
