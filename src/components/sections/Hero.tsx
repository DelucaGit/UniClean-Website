import Image from "next/image";
import { HeroForm } from "@/components/sections/HeroForm";
import { Container } from "@/components/ui/Container";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

export function Hero() {
  return (
    <section id="top" className="!pt-[64px] !pb-[76px] max-[960px]:!pt-[36px] max-[960px]:!pb-[56px]">
      <Container className="grid grid-cols-[1fr_1.12fr] items-center gap-[72px] max-[960px]:grid-cols-1 max-[960px]:gap-[40px]">
        <HeroForm />

        <div className="relative">
          <div className="relative aspect-[1/1.02] overflow-hidden rounded-r">
            <Image
              src="/img/hero.jpg"
              alt="Ljust och rent vardagsrum"
              fill
              priority
              sizes="(max-width: 960px) 100vw, 600px"
              className="object-cover"
            />
          </div>
          <PhoneFrame
            src="/app/app-hem.jpg"
            alt="UniClean-appens startsida"
            className="absolute bottom-[28px] left-[-46px] w-[216px] max-[960px]:left-[14px] max-[960px]:w-[170px]"
          />
        </div>
      </Container>
    </section>
  );
}
