import { sendSupportMail, singleLine } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

/** Tidpunkter för de senaste ärendena per IP-adress. Ligger i minnet och nollställs vid omstart. */
const attempts = new Map<string, number[]>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function allowed(ip: string, now: number): boolean {
  if (attempts.size > 1000) {
    for (const [key, times] of attempts) {
      if (times.every((time) => now - time >= WINDOW_MS)) attempts.delete(key);
    }
  }
  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) {
    attempts.set(ip, recent);
    return false;
  }
  recent.push(now);
  attempts.set(ip, recent);
  return true;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function reply(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply(400, { error: "Ogiltig förfrågan." });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return reply(400, { error: "Ogiltig förfrågan." });
  }
  const fields = body as Record<string, unknown>;

  // Honeypot: robotar får ett vanligt svar men inget skickas.
  if (text(fields.company)) return reply(200, { ok: true });

  const name = singleLine(text(fields.name));
  const email = singleLine(text(fields.email));
  const message = text(fields.message);

  if (!name || !email || !EMAIL_PATTERN.test(email) || !message || message.length > MAX_MESSAGE) {
    return reply(400, { error: "Kontrollera namn, e-post och meddelande." });
  }

  if (!allowed(clientIp(request), Date.now())) {
    return reply(429, { error: "För många ärenden. Försök igen om en stund." });
  }

  try {
    await sendSupportMail({ name, email, message });
  } catch (error) {
    // Logga bara felet, aldrig meddelandets innehåll.
    console.error("Supportärendet kunde inte skickas:", error instanceof Error ? error.message : "okänt fel");
    return reply(500, { error: "Det gick inte att skicka ärendet." });
  }

  return reply(200, { ok: true });
}
