# Arbetsregler

1. Utgångspunkten är koden på `main`, som är den publicerade sajten. De stängda issues till och med #107, PRD:n (#1) och `design/prototyp/index.html` är historik, inte krav.
2. Bygg det som användaren ber om, inget mer. En ändring = en branch från `main` = en liten PR. Finns en issue, skriv `Closes #<nummer>`.
3. Merga bara när användaren säger till. En merge till `main` kan publicera sajten.
4. Följ sajtens nuvarande design i färg, typsnitt och avstånd. Avvik bara om användaren ber om det.
5. Inga emojier, inga AI-genererade bilder, inga toningar eller glaseffekter, inga påhittade siffror eller omdömen, inga tankstreck i löptext. Varumärket skrivs "UniClean".
6. Länkar, telefonnummer och e-post hämtas alltid från `src/config/site.ts`, aldrig hårdkodat i komponenter.
7. Kör `npm run lint` och `npm test` (som också bygger) innan du öppnar en PR.
8. Sajten byggs med webpack. Ta inte bort `--webpack` i `package.json`, eftersom Turbopack kraschar hos Hostinger.
