import { sendSupportMail } from "@/lib/mail";
import { allowAttempt, clientAddress, countTicket, ticketLimitReached } from "@/lib/rateLimit";
import { validateSupport } from "@/lib/support";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function reply(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status });
}

/** Jämför Origin med värden som besökaren ser. Bakom en proxy står den i X-Forwarded-Host. */
function isOwnOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin === null) return true;
  const host = request.headers.get("x-forwarded-host")?.split(",")[0].trim() || request.headers.get("host");
  if (!host) return false;
  try {
    const { protocol, host: originHost } = new URL(origin);
    if (protocol !== "https:" && protocol !== "http:") return false;
    // URL tar bort standardporten på båda sidor.
    return originHost === new URL(`${protocol}//${host}`).host;
  } catch {
    return false;
  }
}

function isJson(request: Request): boolean {
  const type = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  return type === "application/json";
}

/** Läser kroppen och slutar så fort den blir för stor. Ger då null. */
async function readBody(request: Request): Promise<Uint8Array | null> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return null;
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return Buffer.concat(chunks);
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      // Vänta inte på resten av kroppen.
      reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isOwnOrigin(request)) return reply(403, { error: "Förfrågan kommer från en annan sajt." });
  if (!isJson(request)) return reply(415, { error: "Förfrågan ska vara JSON." });

  let body: unknown;
  try {
    const bytes = await readBody(request);
    if (!bytes) return reply(413, { error: "Förfrågan är för stor." });
    body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return reply(400, { error: "Ogiltig förfrågan." });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return reply(400, { error: "Ogiltig förfrågan." });
  }
  const fields = body as Record<string, unknown>;

  // Härifrån till countTicket() får inget await finnas, annars kan samtidiga ärenden gå förbi det totala taket.
  if (!allowAttempt(clientAddress(request)) || ticketLimitReached()) {
    return reply(429, { error: "För många ärenden. Försök igen om en stund." });
  }

  // Honeypot: robotar får ett vanligt svar men inget skickas.
  if (text(fields.company)) return reply(200, { ok: true });

  const values = { name: text(fields.name), email: text(fields.email), message: text(fields.message) };
  if (Object.keys(validateSupport(values)).length > 0) {
    return reply(400, { error: "Kontrollera namn, e-post och meddelande." });
  }

  try {
    await countTicket(() => sendSupportMail(values));
  } catch (error) {
    // Logga bara felet, aldrig meddelandets innehåll.
    console.error("Supportärendet kunde inte skickas:", error instanceof Error ? error.message : "okänt fel");
    return reply(500, { error: "Det gick inte att skicka ärendet." });
  }

  return reply(200, { ok: true });
}
