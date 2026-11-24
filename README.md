# UniClean Website

Ny webbplats för UniClean (uniclean.nu). Besökaren ska gå direkt till bokning i appen i stället för att begära offert.

- **Utgångspunkt:** den publicerade sajten på `main`. Äldre issues och PRD:n (#1) är historik.
- **Design:** sajtens nuvarande design gäller. `design/prototyp/index.html` är den ursprungliga prototypen.
- **Arbetsregler för agenter:** se `AGENTS.md`.

Ändringar görs i en egen branch med en liten PR.

## Starta projektet

Kräver Node.js 20.9 eller senare.

```bash
npm install
npm run dev
```

Öppna sedan http://localhost:3000.

Övriga kommandon:

- `npm run lint` kontrollerar koden med ESLint.
- `npm run build` bygger sajten för produktion.
- `npm run start` kör den byggda sajten.
- `npm test` bygger sajten och kör testerna. Nya testfiler läggs till i `test` i `package.json`.

Bilderna skalas om och skickas som AVIF eller WebP av Next.js bildoptimering. Den kräver att sajten körs som Node-server (`npm run start`) och fungerar inte med statisk export.

## Supportformuläret

Formuläret skickar ärendet till `POST /api/support/`, som mejlar det vidare med nodemailer. Sajten måste därför köras som Node-server (`npm run start`), inte som statisk export.

Kopiera `.env.example` till `.env.local` och fyll i värdena. `.env.local` ska aldrig committas.

| Variabel | Beskrivning |
| --- | --- |
| `SMTP_HOST` | Mejlserverns adress. Krävs. |
| `SMTP_PORT` | Mejlserverns port. 587 om inget anges. 465 rekommenderas och ger krypterad anslutning direkt. |
| `SMTP_USER` | Användarnamn hos mejlservern. Lämnas tomt om servern inte kräver inloggning. |
| `SMTP_PASS` | Lösenord hos mejlservern. |
| `SUPPORT_TO` | Adressen som ärendena skickas till. `bokning@uniclean.nu` om inget anges. |
| `SUPPORT_FROM` | Avsändaradressen på mejlen. Ska vara en adress som mejlservern får skicka från. |
| `TRUSTED_PROXY_HOPS` | Antal betrodda proxyer framför sajten. 1 om inget anges. |

### Mejl hos Hostinger

Sätt `SMTP_HOST=smtp.hostinger.com` och `SMTP_PORT=465`. `SMTP_USER` är hela e-postadressen och `SMTP_PASS` är brevlådans lösenord. Låt `SUPPORT_FROM` vara samma adress som `SMTP_USER`.

### Antal betrodda proxyer

Besökarens IP-adress läses från höger i `X-Forwarded-For`. `TRUSTED_PROXY_HOPS` anger vilken plats från höger som gäller:

- `1`: en proxy som lägger till besökarens adress sist. Det är standard.
- `2`: två proxyer, till exempel ett CDN framför värdens egen proxy.
- `0`: ingen proxy är betrodd. Då delar alla besökare en gräns.

Ett för högt värde gör att besökaren kan förfalska sin adress eller att alla delar en gräns. Ett för lågt värde gör att besökare bakom samma proxy delar gräns. Värdet för Hostinger kontrolleras i #46. Servern ska bara gå att nå genom de betrodda proxyerna.

### Gränser

Varje IP-adress får göra fem försök per tio minuter, och ogiltiga försök räknas. IPv6-adresser i samma /64-nät räknas som en adress. Anrop utan giltig adress delar en gräns. Räknaren rymmer 5 000 adresser, och när den är full delar nya besökare samma gräns. Totalt skickas högst 60 ärenden per timme. Räknarna ligger i minnet, nollställs när servern startas om och förutsätter en enda serverprocess.
