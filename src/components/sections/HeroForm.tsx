import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";

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
        <Button variant="accent" href={site.links.app} track="boka-startvy">
          Boka städning
        </Button>
        <Button href={site.links.partner} track="partner-startvy">
          Bli partner
        </Button>
      </div>
    </div>
  );
}
