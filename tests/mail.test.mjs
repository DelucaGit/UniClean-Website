import assert from "node:assert/strict";
import { test } from "node:test";
import { startMailServer } from "./helpers/mail-server.mjs";
import { startSite } from "./helpers/site.mjs";

async function sendTicket(t, { mailOptions, env } = {}) {
  const mail = await startMailServer(mailOptions);
  t.after(() => mail.stop());
  const site = await startSite({ ...mail.env, ...env });
  t.after(() => site.stop());

  const response = await fetch(`${site.url}/api/support/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Test", email: "kund@example.test", message: "Hej!" }),
  });
  return { mail, site, response };
}

function assertNothingSent({ mail, site, response }) {
  assert.equal(response.status, 500, site.log());
  assert.deepEqual(mail.auths, []);
  assert.equal(mail.mails.length, 0);
}

test("en mejlserver utan TLS får varken inloggningsuppgifter eller mejl", async (t) => {
  const result = await sendTicket(t, { mailOptions: { startTls: false } });
  assertNothingSent(result);
});

test("STARTTLS används innan inloggning och mejl skickas", async (t) => {
  const { mail, site, response } = await sendTicket(t);
  assert.equal(response.status, 200, site.log());
  assert.deepEqual(mail.auths, [{ encrypted: true }]);
  assert.deepEqual(mail.mails.map(({ encrypted }) => encrypted), [true]);
});

test("en mejlserver med ett certifikat som inte är betrott får ingenting", async (t) => {
  const result = await sendTicket(t, { env: { NODE_EXTRA_CA_CERTS: "" } });
  assertNothingSent(result);
});

test("certifikatkontrollen går inte att stänga av med en miljövariabel", async (t) => {
  const result = await sendTicket(t, {
    env: { NODE_EXTRA_CA_CERTS: "", NODE_TLS_REJECT_UNAUTHORIZED: "0" },
  });
  assertNothingSent(result);
});
