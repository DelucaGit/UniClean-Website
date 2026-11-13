"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { steps } from "@/content/steps";

const INTERVAL_MS = 3500;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    const sync = () => {
      window.clearInterval(timer);
      timer = undefined;
      if (!reduced.matches) {
        timer = window.setInterval(() => {
          setActive((i) => (i + 1) % steps.length);
        }, INTERVAL_MS);
      }
    };

    sync();
    reduced.addEventListener("change", sync);
    return () => {
      window.clearInterval(timer);
      reduced.removeEventListener("change", sync);
    };
  }, [auto]);

  return (
    <section id="sa-funkar-det" className="soft">
      <Container>
        <h2>Så funkar det</h2>
        <div className="mt-[36px] grid grid-cols-[1fr_300px] items-center gap-[84px] max-[960px]:grid-cols-1 max-[960px]:gap-[40px]">
          {/* Fokus stoppar det automatiska bytet, så att den som använder tangentbord hinner läsa. */}
          <div className="grid" onFocus={() => setAuto(false)}>
            {steps.map((step, i) => {
              const on = i === active;
              return (
                <button
                  key={step.title}
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onClick={() => {
                    setAuto(false);
                    setActive(i);
                  }}
                  className={`grid cursor-pointer grid-cols-[40px_1fr] gap-[16px] border-t border-line py-[18px] text-left last:border-b ${
                    on ? "text-ink" : "text-mute hover:text-ink"
                  }`}
                >
                  <span
                    className={`grid h-[40px] w-[40px] place-items-center rounded-full text-[16px] font-black ${
                      on ? "bg-accent text-white" : "bg-white"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[16px]">
                    <b className="block text-[20px] font-extrabold">{step.title}</b>
                    <span className="text-mute">{step.text}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {/* Samma utseende som PhoneFrame, men med alla bilder staplade så att bytet kan tona utan att blinka. */}
          <div className="w-[300px] rounded-[30px] bg-[#0c1620] p-[7px] shadow-[0_24px_60px_rgba(8,20,35,.35)] max-[960px]:order-first max-[960px]:mx-auto max-[960px]:w-[270px]">
            <div className="relative">
              {steps.map((step, i) => {
                const on = i === active;
                return (
                  <Image
                    key={step.image}
                    src={step.image}
                    alt={on ? `Skärmbild från appen: ${step.title}` : ""}
                    aria-hidden={on ? undefined : true}
                    width={600}
                    height={1211}
                    quality={90}
                    className={`block w-full rounded-[24px] transition-opacity duration-[250ms] motion-reduce:transition-none ${
                      i === 0 ? "h-auto" : "absolute inset-0 h-full"
                    } ${on ? "opacity-100" : "opacity-0"}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
