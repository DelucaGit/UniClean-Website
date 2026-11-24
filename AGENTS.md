# Arbetsregler

1. Utgångspunkten är koden på `main`, som är den publicerade sajten. De stängda issues till och med #107, PRD:n (#1) och `design/prototyp/index.html` är historik, inte krav.
2. Följ Matt Pococks flöde (pluginet `mattpocock-skills`). Är nästa steg oklart, hänvisa till `/ask-matt`. Specar och tickets skrivs som nya GitHub Issues.
3. Bygg det som användaren ber om, inget mer. En ändring = en branch från `main` = en liten PR. Finns en issue, skriv `Closes #<nummer>`.
4. Merga bara när användaren säger till. En merge till `main` kan publicera sajten.
5. Följ sajtens nuvarande design i färg, typsnitt och avstånd. Avvik bara om användaren ber om det.
6. Inga emojier, inga AI-genererade bilder, inga toningar eller glaseffekter, inga påhittade siffror eller omdömen, inga tankstreck i löptext. Varumärket skrivs "UniClean".
7. Länkar, telefonnummer och e-post hämtas alltid från `src/config/site.ts`, aldrig hårdkodat i komponenter.
8. Kör `npm run lint` och `npm test` (som också bygger) innan du öppnar en PR.
9. Sajten byggs med webpack. Ta inte bort `--webpack` i `package.json`, eftersom Turbopack kraschar hos Hostinger.
