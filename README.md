# UniClean Website

Det här är koden till [uniclean.nu](https://uniclean.nu), där besökaren kan läsa om våra städtjänster och gå vidare till appen för att boka. Tidigare fick man begära en offert. Nu ska det gå att komma direkt till bokningen i stället.

Själva bokningen, priserna och inloggningen sköts av appen. Den här sajten visar vägen dit.

## Kom igång på din dator

Du behöver [Node.js](https://nodejs.org) 20.9 eller senare. Öppna en terminal i projektmappen och kör:

```bash
npm install
npm run dev
```

Öppna sedan http://localhost:3000 i webbläsaren. När du sparar en ändring i koden syns den direkt på sidan.

Du behöver inga lösenord eller inställningar för att se och ändra sajten.

## Var ändrar jag vad?

| Jag vill ändra | Öppna |
| --- | --- |
| Länkar, e-post eller telefonnummer | `src/config/site.ts` |
| Tjänsterna, till exempel priset för fönsterputs | `src/content/services.ts` |
| Stegen under "Så funkar det" | `src/content/steps.ts` |
| Google-omdömen och betyg | `src/content/reviews.ts` |
| Menyn | `src/content/nav.ts` |
| Videon | `src/content/video.ts` |
| Övriga texter på startsidan | `src/components/sections/`, en fil per avsnitt |
| I vilken ordning avsnitten kommer | `src/app/page.tsx` |
| Integritetspolicyn | `src/app/integritetspolicy/page.tsx` |
| Bilder | `public/img/` och `public/app/` (skärmbilder från appen) |

Några saker är bra att veta:

- Länkar och kontaktuppgifter skrivs bara i `src/config/site.ts`. Då räcker det att ändra på ett ställe.
- Omdömena är riktiga och ska stå precis som kunden skrev dem.
- Videoavsnittet visas först när det finns en video, och telefonnumret först när det är ifyllt.
- Byter du ett foto, skriv upp var det kommer från i [docs/bildkallor.md](docs/bildkallor.md).

## Så gör du en ändring

1. Skapa en egen branch från `main`.
2. Gör en sak i taget, så att ändringen blir lätt att granska.
3. Kör `npm run lint`, som letar efter fel i koden.
4. Kör `npm test`, som bygger sajten och testar den.
5. Öppna en pull request och vänta på klartecken innan du mergar. En merge till `main` kan publicera sajten.

Är något trasigt, eller har du ett önskemål? Skriv en [issue](https://github.com/DelucaGit/UniClean-Website/issues). Där ser du också vad som är kvar att göra.

## Läs mer

- [Drift](docs/drift.md): hur sajten körs hos Hostinger, hur supportformuläret fungerar och vad du gör när något går fel.
- [Gamla adresser](docs/gamla-adresser.md): vart länkarna från den gamla sajten leder.
- [Bildkällor](docs/bildkallor.md): var bilderna kommer från.
- [AGENTS.md](AGENTS.md): regler för AI-agenter som arbetar i projektet.

Den första prototypen finns kvar i `design/prototyp/index.html`. Den är bara historik. Det är den publicerade sajten som gäller.
