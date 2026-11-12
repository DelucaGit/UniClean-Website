import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

// Utkast. Lukas ansvarar för att texten stämmer med hur UniClean hanterar personuppgifter.
// Uppgifter som saknas är markerade med texten nedan och listas i PR:en.
const TODO = "[fylls i av Lukas]";

const title = "Integritetspolicy | UniClean";
const description =
  "Så hanterar UniClean de uppgifter du lämnar i supportformuläret på webbplatsen: vilka uppgifter det gäller, varför vi behöver dem och vilka rättigheter du har.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/integritetspolicy/" },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/integritetspolicy/",
    siteName: site.name,
    title,
    description,
  },
};

const h2Class = "mt-[44px] text-[24px]";
const pClass = "mt-[12px]";
const listClass = "mt-[12px] list-disc pl-[22px] text-mute";
const linkClass = "font-bold text-accent underline";

export default function IntegritetspolicyPage() {
  const mail = (
    <a href={`mailto:${site.contact.email}`} className={linkClass}>
      {site.contact.email}
    </a>
  );

  return (
    <main>
      <section>
        <Container>
          <div className="mx-auto max-w-[680px]">
            <h1 className="text-[clamp(32px,4vw,44px)]">Integritetspolicy</h1>
            <p className="mt-[16px] text-[18px]">
              Här står vilka personuppgifter vi hanterar när du använder webbplatsen {site.name},
              varför vi gör det och vilka rättigheter du har. Policyn gäller bara webbplatsen.
              Bokning, konto och betalning sker i {site.name}s app, som har egna villkor.
            </p>

            <h2 className={h2Class}>Vem som ansvarar</h2>
            <p className={pClass}>
              Personuppgiftsansvarig är {TODO} (företagsnamn), organisationsnummer {TODO}, med
              adress {TODO}. Du når oss på {mail}.
            </p>

            <h2 className={h2Class}>Vilka uppgifter vi samlar in</h2>
            <p className={pClass}>
              Vi samlar bara in det du själv skriver i supportformuläret:
            </p>
            <ul className={listClass}>
              <li>ditt namn</li>
              <li>din e-postadress</li>
              <li>ditt meddelande</li>
            </ul>
            <p className={pClass}>
              När du skickar formuläret används din IP-adress en kort stund i serverns minne för
              att begränsa antalet ärenden till fem per tio minuter. IP-adressen sparas inte.
            </p>
            <p className={pClass}>
              Skriv inte känsliga uppgifter i meddelandet, till exempel personnummer eller
              uppgifter om hälsa.
            </p>

            <h2 className={h2Class}>Varför vi behöver uppgifterna</h2>
            <p className={pClass}>
              Vi använder uppgifterna för att kunna läsa ditt ärende och svara dig. Vi använder dem
              inte till reklam och säljer dem inte vidare.
            </p>

            <h2 className={h2Class}>Laglig grund</h2>
            <p className={pClass}>
              Vi behandlar uppgifterna med stöd av en intresseavvägning enligt
              dataskyddsförordningen (GDPR). Vårt intresse är att kunna svara på frågor som du själv
              har valt att skicka till oss.
            </p>

            <h2 className={h2Class}>Hur länge vi sparar uppgifterna</h2>
            <p className={pClass}>
              Ditt ärende skickas som ett mejl till {mail}. Inget sparas i någon databas på
              webbplatsen. Mejlet sparas i vår inkorg i {TODO} och raderas sedan.
            </p>

            <h2 className={h2Class}>Vilka som tar emot uppgifterna</h2>
            <p className={pClass}>
              Uppgifterna hanteras av oss och av de leverantörer som behövs för att webbplatsen och
              mejlen ska fungera:
            </p>
            <ul className={listClass}>
              <li>e-postleverantör: {TODO}</li>
              <li>webbhotell: {TODO}</li>
            </ul>
            <p className={pClass}>
              Leverantörerna får bara hantera uppgifterna för vår räkning. Vi lämnar inte ut dem
              till någon annan, om inte lagen kräver det.
            </p>

            <h2 className={h2Class}>Cookies och mätning</h2>
            <p className={pClass}>
              Webbplatsen sätter inga cookies och mäter inte hur du använder den. Om det ändras
              uppdaterar vi den här sidan.
            </p>

            <h2 className={h2Class}>Dina rättigheter</h2>
            <p className={pClass}>Du har rätt att:</p>
            <ul className={listClass}>
              <li>få veta vilka uppgifter vi har om dig och få en kopia av dem</li>
              <li>få felaktiga uppgifter rättade</li>
              <li>få dina uppgifter raderade</li>
              <li>begära att vi begränsar hur vi använder uppgifterna</li>
              <li>invända mot att vi behandlar uppgifterna</li>
            </ul>
            <p className={pClass}>
              Mejla {mail} om du vill använda någon av rättigheterna. Om du är missnöjd med hur vi
              hanterar dina uppgifter kan du klaga hos Integritetsskyddsmyndigheten (IMY).
            </p>

            <h2 className={h2Class}>Kontakt</h2>
            <p className={pClass}>
              Har du frågor om policyn eller om dina uppgifter? Mejla {mail}.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
