# Arbetsregler

1. Läs PRD:n (issue #1) och den issue du ska bygga innan du börjar. Bygg inget som inte står i en issue.
2. En issue = en branch = en liten PR. Skriv `Closes #<nummer>` i PR:en och merga så fort den är klar.
3. Bygg tasks i nummerordning. Börja inte på en task förrän de som står under "Beror på" är mergade.
4. Rör bara filerna som står under "Filer" i din issue. Då krockar inte PR:erna.
5. En uppgift får inte kräva mer än 100 000 tokens. Blir den större: stanna och dela upp issuen.
6. Designen är `design/prototyp/index.html`. Följ den i färg, typsnitt, avstånd, texter och ordning. Avvik bara om issuen säger det.
7. Designregler: inga emojier, inga AI-genererade bilder, inga toningar eller glaseffekter, inga påhittade siffror eller omdömen, inga tankstreck i löptext. Varumärket skrivs "UniClean".
8. Länkar, telefonnummer och e-post hämtas alltid från `src/config/site.ts`, aldrig hårdkodat i komponenter.
9. Kör `npm run lint` och `npm run build` innan du öppnar en PR.
