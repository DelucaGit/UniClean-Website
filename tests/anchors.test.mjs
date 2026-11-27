import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { startSite } from "./helpers/site.mjs";

let site;
before(async () => {
  site = await startSite();
});
after(() => site?.stop());

async function html(path) {
  const response = await fetch(`${site.url}${path}`, { redirect: "manual" });
  assert.equal(response.status, 200, path);
  return response.text();
}

const all = (text, pattern) => [...text.matchAll(pattern)].map((match) => match[1]);

// Typerna i src/content/sections.ts fångar stavfel. Det här fångar en länk till en sektion som inte visas.
for (const path of ["/", "/integritetspolicy/"]) {
  test(`varje ankarlänk på ${path} leder till en sektion på startsidan`, async () => {
    const ids = new Set(all(await html("/"), /\sid="([^"]+)"/g));
    const anchors = all(await html(path), /\shref="\/#([^"]*)"/g);
    assert.ok(anchors.length > 0, "inga ankarlänkar hittades");
    for (const anchor of anchors) assert.ok(ids.has(anchor), `/#${anchor} saknar sektion`);
  });
}

// Gamla WordPress-adresser som pekar på en sektion.
for (const path of ["/hemstadning-info-bokning/", "/bokning/", "/kontakt/"]) {
  test(`omdirigeringen från ${path} leder till en sektion`, async () => {
    const response = await fetch(`${site.url}${path}`, { redirect: "manual" });
    const anchor = response.headers.get("location")?.match(/^\/#(.+)$/)?.[1];
    assert.ok(anchor, `${path} pekar inte på ett ankare`);
    const ids = new Set(all(await html("/"), /\sid="([^"]+)"/g));
    assert.ok(ids.has(anchor), `/#${anchor} saknar sektion`);
  });
}
