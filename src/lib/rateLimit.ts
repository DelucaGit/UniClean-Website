import { isIP } from "node:net";

// Allt ligger i minnet och nollställs vid omstart. Det förutsätter en enda serverprocess.

const ATTEMPTS_PER_ADDRESS = 5;
const ADDRESS_WINDOW_MS = 10 * 60 * 1000;
const MAX_ADDRESSES = 5000;

const SENT_TOTAL = 60;
const SENT_WINDOW_MS = 60 * 60 * 1000;

/** Monoton klocka, så att gränserna inte påverkas om serverns klocka ställs om. */
const now = () => performance.now();

/**
 * Tidpunkter för de senaste försöken per adress, högst fem per adress.
 * Ordnad efter senaste försök, så att utgångna adresser alltid ligger först.
 */
const attempts = new Map<string, number[]>();
/** Gemensam gräns för anrop utan giltig adress och för nya adresser när räknaren är full. */
let sharedAttempts: number[] = [];

function trustedProxyHops(): number {
  const value = process.env.TRUSTED_PROXY_HOPS?.trim() ?? "";
  return /^\d+$/.test(value) ? Number(value) : 1;
}

/** En adress ska räknas lika oavsett skrivsätt. IPv6 räknas per /64, som är ett enda abonnemang. */
function normalizeAddress(address: string): string | null {
  const version = isIP(address);
  if (version === 4) return address;
  if (version !== 6 || address.includes("%")) return null;

  // URL ger IPv6 i kort, enhetlig form med högst ett "::".
  const [head, tail] = new URL(`http://[${address}]/`).hostname.slice(1, -1).split("::");
  const start = head ? head.split(":") : [];
  const end = tail ? tail.split(":") : [];
  const groups = [...start, ...Array<string>(8 - start.length - end.length).fill("0"), ...end];

  // IPv4 skriven som IPv6 (::ffff:a.b.c.d).
  if (groups.slice(0, 6).join(":") === "0:0:0:0:0:ffff") {
    const [high, low] = groups.slice(6).map((group) => parseInt(group, 16));
    return [high >> 8, high & 255, low >> 8, low & 255].join(".");
  }
  return `${groups.slice(0, 4).join(":")}::/64`;
}

/**
 * Besökarens adress, räknad från höger i X-Forwarded-For. Det längst till vänster kan besökaren skriva själv.
 * Saknas huvudet fyller Next.js i adressen för själva anslutningen.
 */
export function clientAddress(request: Request): string | null {
  const hops = trustedProxyHops();
  if (hops === 0) return null;
  const chain = request.headers.get("x-forwarded-for")?.split(",") ?? [];
  const address = chain[chain.length - hops]?.trim();
  return address ? normalizeAddress(address) : null;
}

/** Räknar ett försök från adressen. Ger false om gränsen redan är nådd. */
export function allowAttempt(address: string | null): boolean {
  const time = now();
  const isRecent = (attempt: number) => time - attempt < ADDRESS_WINDOW_MS;

  for (const [key, times] of attempts) {
    if (isRecent(times[times.length - 1])) break;
    attempts.delete(key);
  }

  // En full räknare släpper aldrig en aktiv adress. Annars kunde någon tränga ut sin egen spärr.
  const own = address !== null && (attempts.has(address) || attempts.size < MAX_ADDRESSES);
  const recent = (own ? (attempts.get(address) ?? []) : sharedAttempts).filter(isRecent);
  if (recent.length >= ATTEMPTS_PER_ADDRESS) return false;

  recent.push(time);
  if (own) {
    attempts.delete(address);
    attempts.set(address, recent);
  } else {
    sharedAttempts = recent;
  }
  return true;
}

let sentTimes: number[] = [];
let sending = 0;

/** Sant om det totala taket är nått. Ärenden som håller på att skickas räknas med. */
export function ticketLimitReached(): boolean {
  const time = now();
  sentTimes = sentTimes.filter((sent) => time - sent < SENT_WINDOW_MS);
  return sentTimes.length + sending >= SENT_TOTAL;
}

/**
 * Skickar ett ärende och räknar det mot det totala taket. Ett misslyckat ärende räknas inte.
 * Platsen tas direkt, så anropa i samma steg som ticketLimitReached(), utan await emellan.
 */
export async function sendAndCountTicket(send: () => Promise<void>): Promise<void> {
  sending++;
  try {
    await send();
    sentTimes.push(now());
  } finally {
    sending--;
  }
}
