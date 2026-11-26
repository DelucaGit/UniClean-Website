import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Partner } from "@/components/sections/Partner";
import { Price } from "@/components/sections/Price";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { Trust } from "@/components/sections/Trust";
import { Video } from "@/components/sections/Video";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Price />
      <HowItWorks />
      <Trust />
      <Reviews />
      <Video />
      <Partner />
      <Contact />
    </main>
  );
}
