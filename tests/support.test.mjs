import assert from "node:assert/strict";
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
