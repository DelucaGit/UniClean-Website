# Drift

Den här guiden är för dig som ska publicera sajten eller ta reda på varför något har slutat fungera.

## Så körs sajten

Sajten ligger hos Hostinger och är byggd med Next.js. Den behöver köras som en Node-app, med Node.js 20.9 eller senare. Det går inte att bara ladda upp färdiga HTML-filer, eftersom både bilderna och supportformuläret behöver en server.

Två kommandon används:

1. `npm run build` bygger sajten.
2. `npm run start` startar den byggda sajten.

Bygget använder webpack, därför står det `--webpack` i `package.json`. Ta inte bort det. Utan det används Turbopack, som kraschar när Hostinger bygger sajten.

## Publicera

Räkna med att en merge till `main` kan publicera sajten. Kontrollera därför allt innan du mergar. Titta sedan på uniclean.nu och klicka dig igenom det du ändrade, gärna på både dator och mobil.

## Om något går fel

**Sajten blev fel efter en ändring.** Öppna den mergade pull requesten på GitHub och välj **Revert**. GitHub gör då en ny pull request som tar bort ändringen. När den är mergad, kontrollera att den gamla versionen verkligen har kommit ut.

**Bygget misslyckas.** Läs byggloggen hos Hostinger. Nämner den Turbopack, kontrollera att `--webpack` finns kvar. Annars kan du köra `npm run build` på din egen dator och se om du får samma fel.

**Supportformuläret går inte att skicka.** Kontrollera mejlinställningarna nedan, i första hand att `SMTP_HOST` finns och att lösenordet stämmer.

**En gammal länk fungerar inte.** Se [gamla adresser](gamla-adresser.md).

## Supportformuläret

Formuläret är dolt just nu, eftersom mejlen inte är inställd. Besökarna ser i stället vår e-postadress.

När någon skickar formuläret tar servern emot det på `/api/support/` och skickar det vidare som ett mejl. Svarar du på mejlet går svaret till besökaren. Ingenting sparas i någon databas.

### Slå på formuläret igen

1. Fyll i mejlinställningarna hos Hostinger.
2. Öppna `src/components/sections/Contact.tsx`. Ta bort kommentarstecknen runt importen av `SupportForm` och runt formuläret längre ner.
3. Kontrollera att integritetspolicyn stämmer med att formuläret syns.
4. Skicka ett testärende på sajten och se att mejlet kommer fram.

### Mejlinställningar

Inställningarna läggs in som miljövariabler hos Hostinger. Vill du testa på din egen dator kopierar du `.env.example` till `.env.local` och fyller i värdena där.

Lösenord får aldrig hamna på GitHub. Alla kan läsa det här repot.

| Namn | Vad det är |
| --- | --- |
| `SMTP_HOST` | Mejlserverns adress. Måste fyllas i. För Hostinger: `smtp.hostinger.com`. |
| `SMTP_PORT` | Mejlserverns port. Använd `465` för Hostinger. Lämnas den tom används 587. |
| `SMTP_USER` | Hela e-postadressen som mejlen skickas från. Lämnas tom om servern inte kräver inloggning. |
| `SMTP_PASS` | Lösenordet till den brevlådan. |
| `SUPPORT_TO` | Adressen som ska få ärendena. Lämnas den tom går de till `bokning@uniclean.nu`. |
| `SUPPORT_FROM` | Avsändaren på mejlen. Använd samma adress som i `SMTP_USER`. |
| `TRUSTED_PROXY_HOPS` | Hur många servrar som står mellan besökaren och sajten. Lämnas den tom används 1. Förklaras nedan. |

### Skydd mot skräppost

För att ingen ska kunna överösa oss med mejl finns det gränser:

- Samma besökare kan försöka fem gånger på tio minuter. Även misslyckade försök räknas.
- Totalt skickas högst 60 ärenden i timmen.

Sajten känner igen besökaren på IP-adressen. Det fungerar bara om `TRUSTED_PROXY_HOPS` är rätt:

| Värde | När det ska användas |
| --- | --- |
| `1` | En server står framför sajten. Det är det vanliga. |
| `2` | Två servrar står framför, till exempel ett CDN och sedan Hostingers egen. |
| `0` | Ingen server framför går att lita på. Då delar alla besökare på fem försök. |

Är siffran för hög kan någon låtsas ha en annan adress och komma runt spärren, eller så får alla besökare dela på samma gräns. Är den för låg kan vanliga besökare spärras i onödan. Vi har inte kontrollerat vilket värde som stämmer för Hostinger, så gör det innan formuläret slås på. Sajten ska heller inte gå att nå utan att passera servrarna framför.

Några detaljer för den som felsöker:

- IPv6-adresser i samma /64-nät räknas som en besökare. Anrop utan giltig adress delar på en gräns.
- Spärren håller reda på 5 000 adresser. Blir den full får nya besökare dela på en gräns.
- Räknarna ligger i minnet. De nollställs när servern startas om och fungerar bara om sajten körs som en enda process.
