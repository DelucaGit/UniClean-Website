import { Button } from "@/components/ui/Button";
import { bookingUrl, site } from "@/config/site";

/**
 * Tillfälligt utan fält för tjänst och postnummer, eftersom appen inte tar emot
 * dem.
 */
export function HeroForm() {
  return (
    <div>
      <h1 className="text-[clamp(38px,4.6vw,58px)] font-black leading-[1.08] tracking-[-0.02em]">
        Städning när du behöver den
      </h1>
      <p className="mt-[18px] mb-[28px] max-w-[440px] text-[19px]">
        Välj tjänst, se vad det kostar efter RUT och boka direkt i appen. Du behöver inte begära
        offert.
      </p>
      <div className="flex flex-wrap gap-[12px]">
        <Button variant="accent" href={bookingUrl()} track="boka-startvy">
          Boka städning
        </Button>
        <Button href={site.links.partner} track="partner-startvy">
          Bli partner
        </Button>
      </div>
    </div>
  );
}
