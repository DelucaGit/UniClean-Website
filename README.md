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
