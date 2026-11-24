import assert from "node:assert/strict";
import { request } from "node:http";
import { after, before, test } from "node:test";
import { startSite } from "./helpers/site.mjs";

let site;
before(async () => {
  site = await startSite();
});
after(() => site?.stop());

// node:http i stället för fetch, så att Host kan sättas och omdirigeringar inte följs.
function ask(path, { method = "GET", headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = request(`${site.url}${path}`, { method, headers }, (res) => {
      let text = "";
      res.setEncoding("utf8").on("data", (chunk) => (text += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, text }));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.end(body);
  });
}

function parsePolicy(policy) {
  return Object.fromEntries(
    policy.split(";").map((part) => {
      const [name, ...values] = part.trim().split(/\s+/);
      return [name, values.join(" ")];
    }),
  );
}

function assertSecurityHeaders({ headers }) {
  assert.match(headers["content-security-policy"] ?? "", /(^|; )frame-ancestors 'none'(;|$)/);
  assert.equal(headers["x-frame-options"], "DENY");
  assert.equal(headers["x-content-type-options"], "nosniff");
  assert.equal(headers["referrer-policy"], "strict-origin-when-cross-origin");
  assert.equal(headers["permissions-policy"], "camera=(), microphone=(), geolocation=()");
  assert.match(headers["strict-transport-security"] ?? "", /^max-age=\d{8,}$/);
  assert.equal(headers["x-powered-by"], undefined);
}

const json = { "content-type": "application/json" };
const responses = [
  ["startsidan", "/", 200],
  ["integritetspolicyn", "/integritetspolicy/", 200],
  ["404", "/finns-inte/", 404],
  ["API-svar", "/api/support/", 400, { method: "POST", headers: json, body: "{" }],
  ["API-svar med fel metod", "/api/support/", 405],
  ["en fil i public", "/og.jpg", 200],
  ["en optimerad bild", "/_next/image/?url=%2Fimg%2Fhero.jpg&w=640&q=75", 200],
];
for (const [name, path, status, options] of responses) {
  test(`säkerhetshuvuden: ${name}`, async () => {
    const response = await ask(path, options);
    assert.equal(response.status, status);
    assertSecurityHeaders(response);
  });
}

test("säkerhetshuvuden: skript och stilmallar i /_next/static", async () => {
  const { text } = await ask("/");
  for (const extension of ["js", "css"]) {
    const file = text.match(new RegExp(`/_next/static/[^"\\\\]+\\.${extension}`))?.[0];
    assert.ok(file, extension);
    const response = await ask(file);
    assert.equal(response.status, 200);
    assertSecurityHeaders(response);
    assert.equal(response.headers["cache-control"], "public, max-age=31536000, immutable");
  }
});

// Next.js skickar inte egna huvuden på omdirigeringar från konfigurationen, så här testas bara målet.
const redirects = [
  ["gammal adress", "/bokning/", undefined, "/#sa-funkar-det"],
  ["avslutande snedstreck", "/integritetspolicy", undefined, "/integritetspolicy/"],
  ["www", "/integritetspolicy/", "www.uniclean.nu", "https://uniclean.nu/integritetspolicy"],
  ["www och gammal adress", "/kontakt/", "www.uniclean.nu", "https://uniclean.nu/#kontakt"],
];
for (const [name, path, host, target] of redirects) {
  test(`omdirigeringen finns kvar: ${name}`, async () => {
    const response = await ask(path, { headers: host ? { host } : {} });
    assert.equal(response.status, 308);
    assert.equal(response.headers.location, target);
  });
}

test("CSP tillåter bara egna resurser och det Next.js behöver", async () => {
  const policy = parsePolicy((await ask("/")).headers["content-security-policy"] ?? "");
  assert.deepEqual(policy, {
    "default-src": "'none'",
    "script-src": "'self' 'unsafe-inline'",
    "style-src": "'self' 'unsafe-inline'",
    "img-src": "'self' data:",
    "font-src": "'self'",
    "connect-src": "'self'",
    "media-src": "'self'",
    "base-uri": "'none'",
    "form-action": "'self'",
    "frame-ancestors": "'none'",
  });
});
