"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { bookingUrl, site } from "@/config/site";
import { services, type ServiceId } from "@/content/services";

type Mode = "kund" | "partner";

const modes: readonly { id: Mode; label: string }[] = [
  { id: "kund", label: "Boka städning" },
  { id: "partner", label: "Bli partner" },
];

const copy: Record<Mode, { heading: string; sub: string }> = {
  kund: {
    heading: "Städning när du behöver den",
    sub: "Välj tjänst, se vad det kostar efter RUT och boka direkt i appen. Du behöver inte begära offert.",
  },
  partner: {
    heading: "Jobba som städare när det passar dig",
    sub: "Som partner hos UniClean tar du emot städuppdrag nära dig i appen.",
  },
};

const headingClass =
  "text-[clamp(38px,4.6vw,58px)] font-black leading-[1.08] tracking-[-0.02em]";
const fieldClass =
  "flex h-[54px] items-center gap-[14px] rounded-[10px] border-2 border-transparent bg-soft px-[16px] focus-within:border-ink focus-within:bg-white";
const inputClass =
  "h-full min-w-0 flex-1 border-0 bg-transparent font-bold text-ink outline-none";
const actionsClass = "flex flex-wrap items-center gap-[26px]";

export function HeroForm() {
  const [mode, setMode] = useState<Mode>("kund");
  const [service, setService] = useState<ServiceId>(services[0].id);
  const [postnummer, setPostnummer] = useState("");

  return (
    <div>
      <div className="mb-[26px] inline-flex rounded-full bg-soft p-[4px]">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`cursor-pointer rounded-full border-0 px-[18px] py-[9px] text-[15px] font-extrabold text-ink ${
              mode === m.id ? "bg-white shadow-[0_1px_4px_rgba(0,0,0,.12)]" : "bg-transparent"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Båda lägena ligger i samma ruta så att höjden inte ändras när man växlar. */}
      <div className="grid">
        {modes.map(({ id }) => {
          const active = mode === id;
          const Heading = active ? "h1" : "div";
          return (
            <div
              key={id}
              aria-hidden={!active}
              inert={!active}
              className={`col-start-1 row-start-1 ${active ? "" : "invisible"}`}
            >
              <Heading className={headingClass}>{copy[id].heading}</Heading>
              <p className="mt-[18px] mb-[28px] max-w-[440px] text-[19px]">{copy[id].sub}</p>

              {id === "kund" ? (
                <>
                  <div className="relative grid max-w-[420px] gap-[10px]">
                    <span
                      aria-hidden="true"
                      className="absolute top-[36px] left-[22px] h-[46px] w-px bg-ink opacity-[.55]"
                    />
                    <label className={fieldClass}>
                      <span className="size-[9px] flex-none rounded-full bg-ink" />
                      <select
                        aria-label="Tjänst"
                        value={service}
                        onChange={(e) => setService(e.target.value as ServiceId)}
                        className={inputClass}
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={fieldClass}>
                      <span className="size-[9px] flex-none bg-ink" />
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Postnummer"
                        aria-label="Postnummer"
                        value={postnummer}
                        onChange={(e) => setPostnummer(e.target.value.replace(/\D/g, ""))}
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <div className={`${actionsClass} mt-[28px]`}>
                    <Button
                      variant="accent"
                      href={bookingUrl({ service, postnummer: postnummer || undefined })}
                      track="boka-startvy"
                    >
                      Se pris och boka
                    </Button>
                    <TextLink href={site.links.login}>Logga in för att se dina bokningar</TextLink>
                  </div>
                </>
              ) : (
                <div className={actionsClass}>
                  <Button variant="accent" href={site.links.partner} track="partner-startvy">
                    Ansök som partner
                  </Button>
                  <TextLink href="#partner">Läs mer om att jobba hos oss</TextLink>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
