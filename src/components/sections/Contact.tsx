import { sectionId } from "@/content/sections";
import { Container } from "@/components/ui/Container";
// import { SupportForm } from "@/components/sections/SupportForm";
import { site } from "@/config/site";

const itemClass = "border-b border-line py-[18px]";
const labelClass = "block text-[14px] font-bold text-mute";
const valueClass = "text-[22px] font-black";

export function Contact() {
  const { email, phone } = site.contact;

  return (
    <section id={sectionId("kontakt")}>
      <Container className="grid grid-cols-2 gap-[84px] max-[960px]:grid-cols-1 max-[960px]:gap-[40px]">
        <div>
          <h2>Behöver du hjälp?</h2>
          <p className="mt-[12px] text-[18px]">Mejla eller ring oss om din bokning.</p>
          <div className="mt-[22px]">
            <div className={itemClass}>
              <small className={labelClass}>E-post</small>
              <a href={`mailto:${email}`} className={valueClass}>
                {email}
              </a>
            </div>
            {phone && (
              <div className={itemClass}>
                <small className={labelClass}>Telefon</small>
                <a href={phone.href} className={valueClass}>
                  {phone.display}
                </a>
              </div>
            )}
          </div>
        </div>
        {/* TILLFÄLLIGT BORTTAGET (#105): slå på formuläret och importen igen när mejlen är klar.
            Nollar sektionspaddingen så att formuläret linjerar med vänsterkolumnen.
        <div className="[&>section]:p-0">
          <SupportForm />
        </div>
        */}
      </Container>
    </section>
  );
}
