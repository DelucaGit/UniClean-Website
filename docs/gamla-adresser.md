# Gamla adresser

Adresserna på den gamla WordPress-sajten och vart de pekas om på nya sajten.
Omdirigeringarna ligger i `next.config.ts` under `redirects()` och är permanenta (308).

## Källa

Hämtat 2026-11-12 från `https://uniclean.nu/sitemap.xml`, som leder vidare till `wp-sitemap.xml` med två undersitemaps:

- `wp-sitemap-posts-page-1.xml` (sidor)
- `wp-sitemap-users-1.xml` (författarsidor)

`sitemap_index.xml` finns inte (404). Startsidans interna länkar gav inga adresser utöver sitemapen. Bilder, `wp-admin`, `wp-json`, `wp-content` och flöden (`/feed/`) är inte med.

## Adresser och mål

| Gammal adress | Vad sidan var | Nytt mål |
| --- | --- | --- |
| `/` | Startsida | `/` (ingen omdirigering) |
| `/hemstadning-info-bokning/` | Tjänstesida, hemstädning | `/#tjanster` |
| `/fonsterputs-info-bokning/` | Tjänstesida, fönsterputs | `/#tjanster` |
| `/flyttstadning-info-bokning/` | Tjänstesida, flyttstädning | `/#tjanster` |
| `/bokning/` | Bokning, formulär för snabbegäran | `/#sa-funkar-det` |
| `/kontakt/` | Kontakt | `/#kontakt` |
| `/vi-aterkommer-med-offert-inom-kort/` | Tacksida efter offertförfrågan | `/` |
| `/author/admin/` | Författarsida från WordPress | `/` |

Sju adresser pekas om: tre till `/#tjanster`, en till `/#sa-funkar-det`, en till `/#kontakt` och två till `/`.

Gamla startsidan hade också ankarlänkarna `/#tjanster` och `/#hur-jag-bokar`. Det som står efter `#` skickas aldrig till servern och kan därför inte pekas om. `/#tjanster` finns kvar på nya sajten, `/#hur-jag-bokar` hamnar överst på startsidan.

## Med och utan avslutande snedstreck

Sajten har `trailingSlash: true`. En gammal adress utan snedstreck, till exempel `/kontakt`, får först Next.js egna 308 till `/kontakt/` och sedan 308 till målet. Båda formerna hamnar alltså rätt, utan snedstreck tar det två hopp.

Reglerna matchar bara de exakta adresserna ovan. De fångar inte `/`, `/integritetspolicy/`, `/api/*`, `/_next/*` eller filer i `public/`, och inget mål är själv en gammal adress, så ingen loop kan uppstå.

## www

På gamla sajten sköter WordPress omdirigeringen från `www.uniclean.nu` till `uniclean.nu` (301). Den försvinner när WordPress stängs av, och vilken värd nya sajten får är inte bestämt. Därför finns omdirigeringen också i `next.config.ts`:

- `www.uniclean.nu` + gammal adress går direkt till slutmålet på `https://uniclean.nu`.
- Allt annat på `www.uniclean.nu` går till samma sökväg på `https://uniclean.nu`.

Regeln gäller bara när besökaren kommer in med värdnamnet `www.uniclean.nu`, så den kan inte gå i loop. För att den ska göra nytta måste `www.uniclean.nu` vara kopplad till nya sajten i DNS och hos värden. Om värden själv pekar om www gör regeln ingen skada.
