import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { site } from "@/config/site";

const points = [
  "Du kan boka anonymt",
  "Du får liveuppdateringar under bokningen",
  "Du betalar, bokar om och avbokar i appen",
  "Du kan välja städare själv",
];

export function Trust() {
  return (
    <section id="trygghet" className="dark">
      <Container className="grid grid-cols-2 items-center gap-[84px] max-[960px]:grid-cols-1 max-[960px]:gap-[40px]">
        <div className="order-2 grid aspect-[1/.92] place-items-center overflow-hidden rounded-r bg-[rgba(255,255,255,.07)] max-[960px]:order-none">
          <PhoneFrame
            src="/app/app-soker.jpg"
            alt="Appen söker en städare nära dig"
            className="mt-[60px] w-[250px]"
          />
        </div>
        <div>
          <h2>Alla städare är verifierade med BankID</h2>
          <p className="mt-[16px] max-w-[480px] text-[18px]">
            Din bokning går ut till städare i närheten. Du följer den i appen från att någon tar
            uppdraget tills städningen är klar.
          </p>
          <ul className="mt-[24px] max-w-[480px] list-none border-t border-[rgba(255,255,255,.18)]">
            {points.map((point) => (
              <li
                key={point}
                className="border-b border-[rgba(255,255,255,.18)] py-[13px] font-bold"
              >
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-[28px] flex flex-wrap items-center gap-[26px]">
            <Button variant="white" href={site.links.app} track="boka-trygghet">
              Boka nu
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
