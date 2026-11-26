import { Container } from "@/components/ui/Container";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

export function Price() {
  return (
    <section id="pris">
      <Container className="grid grid-cols-2 items-center gap-[84px] max-[960px]:grid-cols-1 max-[960px]:gap-[40px]">
        <div className="grid aspect-[1/.92] place-items-center overflow-hidden rounded-r bg-soft">
          <PhoneFrame
            src="/app/app-storlek.jpg"
            alt="Appen räknar ut tid och pris"
            className="mt-[60px] w-[250px]"
          />
        </div>
        <div>
          <h2>Du ser priset innan du bokar</h2>
          <p className="mt-[16px] max-w-[480px] text-[18px]">
            Ange hur stort ditt hem är, så räknar appen ut tid och pris efter RUT. Du betalar för
            den tid städningen faktiskt tar och aldrig mer än det pris du fick.
          </p>
        </div>
      </Container>
    </section>
  );
}
