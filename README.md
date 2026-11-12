# UniClean Website

Ny webbplats för UniClean (uniclean.nu). Besökaren ska gå direkt till bokning i appen i stället för att begära offert.

- **Plan och krav:** se issue #1 (PRD för version 1). Allt arbete står i GitHub Issues.
- **Design:** `design/prototyp/index.html` är den överenskomna designen. Öppna filen i en webbläsare.
- **Arbetsregler för agenter:** se `AGENTS.md`.

Koden byggs inte förrän respektive issue påbörjas. Bygg i den ordning som issue-numren anger.

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

## Supportformuläret

Formuläret skickar ärendet till `POST /api/support/`, som mejlar det vidare med nodemailer. Sajten måste därför köras som Node-server (`npm run start`), inte som statisk export.

Kopiera `.env.example` till `.env.local` och fyll i värdena. `.env.local` ska aldrig committas.

| Variabel | Beskrivning |
| --- | --- |
| `SMTP_HOST` | Mejlserverns adress. Krävs. |
| `SMTP_PORT` | Mejlserverns port. 587 om inget anges, 465 ger krypterad anslutning direkt. |
| `SMTP_USER` | Användarnamn hos mejlservern. Lämnas tomt om servern inte kräver inloggning. |
| `SMTP_PASS` | Lösenord hos mejlservern. |
| `SUPPORT_TO` | Adressen som ärendena skickas till. `bokning@uniclean.nu` om inget anges. |
| `SUPPORT_FROM` | Avsändaradressen på mejlen. Ska vara en adress som mejlservern får skicka från. |

Varje IP-adress får skicka fem ärenden per tio minuter. Räknaren ligger i minnet och nollställs när servern startas om.
