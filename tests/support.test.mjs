import assert from "node:assert/strict";
import http from "node:http";
import { test } from "node:test";
import { startMailServer } from "./helpers/mail-server.mjs";
import { startSite } from "./helpers/site.mjs";

test("ett vanligt ärende skickas krypterat till supporten", async (t) => {
  const mail = await startMailServer();
  t.after(() => mail.stop());
  const site = await startSite({
    ...mail.env,
    SUPPORT_TO: "support@example.test",
    SUPPORT_FROM: "formular@example.test",
  });
  t.after(() => site.stop());

  const response = await fetch(`${site.url}/api/support/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Åsa Öberg",
      email: "asa@example.test",
      message: "Hej!\nJag vill ändra min bokning på måndag.",
    }),
  });

  assert.equal(response.status, 200, site.log());
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(mail.mails.length, 1);
  const [received] = mail.mails;
  assert.equal(received.encrypted, true);
  assert.equal(received.from, "formular@example.test");
  assert.deepEqual(received.to, ["support@example.test"]);
  assert.equal(received.headers["reply-to"], "asa@example.test");
  assert.equal(received.headers.subject, "Supportärende från Åsa Öberg");
  assert.equal(
    received.text.trim(),
    "Namn: Åsa Öberg\nE-post: asa@example.test\n\nHej!\nJag vill ändra min bokning på måndag.",
  );
  assert.deepEqual(mail.auths, [{ encrypted: true }]);
});

const valid = { name: "Åsa", email: "asa@example.test", message: "Hej" };
const agent = new http.Agent({ keepAlive: false, maxSockets: 100 });
let lastAddress = 0;
/** En adress som inget annat test använder, så att testerna inte delar gräns. */
const newAddress = () => `10.0.${(++lastAddress >> 8) & 255}.${lastAddress & 255}`;

/** Skickar en förfrågan och returnerar svarskoden. Med `chunked` skickas kroppen utan Content-Length. */
function send(site, body, { headers = {}, chunked = false } = {}) {
  const payload = typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const request = http.request(`${site.url}/api/support/`, {
      method: "POST",
      agent,
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": newAddress(),
        ...(chunked ? {} : { "content-length": Buffer.byteLength(payload) }),
        ...headers,
      },
    });
    request.setTimeout(20_000, () => request.destroy(new Error("Inget svar i tid")));
    request.on("error", reject);
    request.on("response", (response) => {
      response.on("error", reject);
      response.resume().on("end", () => resolve(response.statusCode));
    });
    if (chunked) request.write(payload);
    else request.end(payload);
    // En separat skrivning före end() gör att Node inte lägger till Content-Length.
    if (chunked) request.end();
  });
}

const from = (address) => ({ headers: { "x-forwarded-for": address } });

async function start(t, env = {}) {
  const mail = await startMailServer();
  t.after(() => mail.stop());
  const site = await startSite({ ...mail.env, TRUSTED_PROXY_HOPS: "", ...env });
  t.after(() => site.stop());
  return { mail, site };
}

/** Skickar ärenden i tur och ordning och returnerar svarskoderna. */
async function statuses(count, next) {
  const result = [];
  for (let index = 0; index < count; index++) result.push(await next(index));
  return result;
}

const fiveThenLimited = [200, 200, 200, 200, 200, 429];

test("fälten kontrolleras på servern", async (t) => {
  const { site, mail } = await start(t);
  const domain = `@${"d".repeat(60)}.${"e".repeat(60)}.${"f".repeat(60)}.test`;
  const longest = "a".repeat(254 - domain.length) + domain;

  const cases = [
    ["namn på 100 tecken", { name: "n".repeat(100) }, 200],
    ["namn på 101 tecken", { name: "n".repeat(101) }, 400],
    ["tomt namn", { name: "  " }, 400],
    ["e-post på 254 tecken", { email: longest }, 200],
    ["e-post på 255 tecken", { email: `a${longest}` }, 400],
    ["meddelande på 2 000 tecken", { message: "å".repeat(2000) }, 200],
    ["meddelande på 2 001 tecken", { message: "å".repeat(2001) }, 400],
    ["meddelande som inte är text", { message: ["hej"] }, 400],
    ...["anna.o'brien+uniclean@mail.example.se", "kund@städ.se", "a_b-c@1-2.example"].map((email) => [
      email,
      { email },
      200,
    ]),
    ...[
      "a@example.se,b@example.se",
      "a@example.se;b@example.se",
      "a@example.se b@example.se",
      "a@example.se\r\nBcc: b@example.se",
      "Anna <a@example.se>",
      "<a@example.se>",
      '"a"@example.se',
      "'a@example.se'",
      "a(b)@example.se",
      "grupp:a@example.se",
      "a@b@example.se",
      "a@example",
      "a@.se",
      "a\u0000@example.se",
    ].map((email) => [email, { email }, 400]),
  ];
  for (const [label, fields, status] of cases) {
    assert.equal(await send(site, { ...valid, ...fields }), status, label);
  }
  assert.equal(mail.mails.length, 6);
});

test("radbrytningar i namnet blir inte egna mejlhuvuden", async (t) => {
  const { site, mail } = await start(t);
  assert.equal(await send(site, { ...valid, name: "Åsa\r\nBcc: annan@example.test" }), 200);
  assert.equal(mail.mails[0].headers.bcc, undefined);
  assert.equal(mail.mails[0].headers.subject, "Supportärende från Åsa Bcc: annan@example.test");
  assert.equal(mail.mails[0].to.length, 1);
});

test("för stora och felaktiga kroppar avvisas snabbt", async (t) => {
  const { site, mail } = await start(t);
  const json = JSON.stringify(valid);
  const atLimit = json + " ".repeat(16 * 1024 - Buffer.byteLength(json));
  for (const chunked of [false, true]) {
    assert.equal(await send(site, atLimit, { chunked }), 200);
    assert.equal(await send(site, `${atLimit} `, { chunked }), 413);
    const started = performance.now();
    const email = `${"a@".repeat(40_000)}.`;
    assert.equal(await send(site, { ...valid, email }, { chunked }), 413);
    assert.ok(performance.now() - started < 1000);
  }
  for (const body of ["", "{", "null", "[]", '"hej"', Buffer.from([0x22, 0xff, 0x22])]) {
    assert.equal(await send(site, body), 400, String(body));
  }
  assert.equal(mail.mails.length, 2);
});

test("servern svarar 413 innan en kropp utan slut är färdigläst", async (t) => {
  const { site } = await start(t);
  const status = await new Promise((resolve, reject) => {
    const request = http.request(`${site.url}/api/support/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      timeout: 5000,
    });
    request.on("timeout", () => request.destroy(new Error("Inget svar i tid")));
    request.on("error", reject);
    request.on("response", (response) => {
      resolve(response.statusCode);
      request.destroy();
    });
    request.write("a".repeat(17 * 1024)); // end() anropas aldrig
  });
  assert.equal(status, 413);
});

test("bara JSON från den egna sajten tas emot", async (t) => {
  const { site } = await start(t);
  const host = new URL(site.url).host;
  const cases = [
    [{ "content-type": "text/plain" }, 415],
    [{ "content-type": "application/jsonp" }, 415],
    [{ "content-type": "application/json; charset=utf-8" }, 200],
    [{ origin: `http://${host}` }, 200],
    [{ origin: "https://annan.example" }, 403],
    [{ origin: "https://annan.example", "content-type": "text/plain" }, 403],
    [{ origin: "null" }, 403],
    [{ origin: "http://127.0.0.1:1" }, 403],
    [{ origin: "https://test.uniclean.example", host: "test.uniclean.example" }, 200],
    [{ origin: "https://uniclean.nu", host: "uniclean.nu:443" }, 200],
    [{ origin: "https://uniclean.nu", "x-forwarded-host": "uniclean.nu" }, 200],
    [{ origin: "https://uniclean.nu.annan.example", "x-forwarded-host": "uniclean.nu" }, 403],
  ];
  for (const [headers, status] of cases) {
    assert.equal(await send(site, valid, { headers }), status, JSON.stringify(headers));
  }
});

test("honeypot-fältet ger ett vanligt svar men inget mejl", async (t) => {
  const { site, mail } = await start(t);
  assert.equal(await send(site, { ...valid, company: "Robot AB" }), 200);
  assert.equal(mail.mails.length, 0);
});

test("gränsen per IP räknar ogiltiga försök och går inte att förfalska", async (t) => {
  const { site, mail } = await start(t);
  const bodies = [valid, valid, { name: "" }, { ...valid, company: "x" }, valid, valid, { name: "" }];
  assert.deepEqual(
    await statuses(7, (index) => send(site, bodies[index], from(`198.51.100.${index}, 203.0.113.7`))),
    [200, 200, 400, 200, 200, 429, 429],
  );
  assert.equal(mail.mails.length, 3);
  assert.equal(await send(site, valid, from("203.0.113.8")), 200, "en annan besökare påverkas inte");
});

test("samtidiga förfrågningar går inte förbi gränsen per IP", async (t) => {
  const { site, mail } = await start(t);
  const result = await Promise.all(Array.from({ length: 20 }, () => send(site, valid, from("203.0.113.7"))));
  assert.equal(result.filter((status) => status === 200).length, 5);
  assert.equal(mail.mails.length, 5);
});

test("olika skrivsätt av samma adress delar gräns", async (t) => {
  const { site } = await start(t);
  const network = ["2001:db8::1", "2001:DB8:0:0::2", "2001:0db8::ffff:1:2:3", "2001:db8::9", "2001:db8:0:0:1::", "2001:db8::1"];
  assert.deepEqual(await statuses(6, (index) => send(site, valid, from(network[index]))), fiveThenLimited);
  assert.equal(await send(site, valid, from("2001:db8:0:1::1")), 200, "ett annat nät har egen gräns");
  const mapped = ["203.0.113.7", "::ffff:203.0.113.7", "::ffff:cb00:7107", "203.0.113.7", "203.0.113.7", "203.0.113.7"];
  assert.deepEqual(await statuses(6, (index) => send(site, valid, from(mapped[index]))), fiveThenLimited);
});

test("TRUSTED_PROXY_HOPS anger vilken adress som räknas", async (t) => {
  const { site } = await start(t, { TRUSTED_PROXY_HOPS: "2" });
  assert.deepEqual(
    await statuses(6, (index) => send(site, valid, from(`198.51.100.${index}, 203.0.113.7, 192.0.2.${index}`))),
    fiveThenLimited,
  );
  assert.equal(await send(site, valid, from("203.0.113.8, 192.0.2.1")), 200);
  // En för kort kedja innehåller ingen giltig adress.
  assert.deepEqual(await statuses(6, (index) => send(site, valid, from(`192.0.2.${index}`))), fiveThenLimited);
});

test("utan betrodda proxyer delar alla en gräns", async (t) => {
  const { site } = await start(t, { TRUSTED_PROXY_HOPS: "0" });
  assert.deepEqual(await statuses(6, () => send(site, valid)), fiveThenLimited);
});

test("anrop utan giltig adress delar en gräns, även utan proxyhuvud", async (t) => {
  const { site } = await start(t);
  const invalid = ["unknown", "", "999.1.1.1", "198.51.100.1, ", "<script>", "::g"];
  assert.deepEqual(await statuses(6, (index) => send(site, valid, from(invalid[index]))), fiveThenLimited);

  const bare = () =>
    fetch(`${site.url}/api/support/`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": newAddress() },
      body: JSON.stringify(valid),
    }).then((response) => response.status);
  // Next.js fyller själv i anslutningens adress när X-Forwarded-For saknas.
  assert.deepEqual(await statuses(6, bare), fiveThenLimited);
});

test("den totala gränsen går inte att spränga med samtidiga ärenden", async (t) => {
  const { site, mail } = await start(t);
  // Ogiltiga försök och robotar räknas inte som skickade.
  const unsent = await statuses(65, (index) => send(site, index % 2 ? { name: "" } : { ...valid, company: "x" }));
  assert.ok(!unsent.includes(429));

  const result = await Promise.all(Array.from({ length: 80 }, () => send(site, valid)));
  assert.equal(result.filter((status) => status === 200).length, 60);
  assert.equal(result.filter((status) => status === 429).length, 20);
  assert.equal(mail.mails.length, 60);
  assert.equal(await send(site, { ...valid, company: "x" }), 429, "gränsen kontrolleras före honeypot");
});

test("misslyckade mejl förbrukar inte den totala gränsen", async (t) => {
  const { site, mail } = await start(t);
  await mail.stop();
  const result = await statuses(65, () => send(site, { ...valid, message: "hemligt ärende" }));
  assert.ok(result.every((status) => status === 500), String(result));
  assert.ok(!site.log().includes("hemligt ärende"));
});

test("räknaren har ett tak och glömmer inte en spärrad adress när den är full", async (t) => {
  const { site } = await start(t);
  const invalid = { name: "" };
  const blocked = from("203.0.113.7");
  assert.deepEqual(await statuses(6, () => send(site, invalid, blocked)), [400, 400, 400, 400, 400, 429]);

  // 4 999 adresser till fyller räknaren (5 000).
  let next = 0;
  async function worker() {
    while (next < 4999) {
      const index = next++;
      assert.equal(await send(site, invalid, from(`10.1.${index >> 8}.${index & 255}`)), 400);
    }
  }
  await Promise.all(Array.from({ length: 50 }, worker));

  // Nya adresser delar sedan en gräns i stället för att tränga ut gamla.
  assert.deepEqual(
    await statuses(6, (index) => send(site, invalid, from(`10.2.0.${index}`))),
    [400, 400, 400, 400, 400, 429],
  );
  assert.equal(await send(site, invalid, blocked), 429);
  assert.equal(await send(site, invalid, from("10.1.0.0")), 400, "en känd adress har kvar sin egen gräns");
});
