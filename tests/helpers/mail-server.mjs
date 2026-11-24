import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import net from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import tls from "node:tls";
import { createCertificate } from "./certificate.mjs";

function decodeQuoted(value) {
  return value.replace(/=([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function decodeHeader(value) {
  const bytes = value
    .replace(/(=\?[^?]+\?[bq]\?[^?]*\?=)\s+(?==\?)/gi, "$1")
    .replace(/=\?utf-8\?([bq])\?([^?]*)\?=/gi, (_, kind, data) =>
      kind.toLowerCase() === "b"
        ? Buffer.from(data, "base64").toString("latin1")
        : decodeQuoted(data.replaceAll("_", " ")),
    );
  return Buffer.from(bytes, "latin1").toString("utf8");
}

function parseMail(raw) {
  const split = raw.indexOf("\r\n\r\n");
  const headers = {};
  for (const line of raw.slice(0, split).replace(/\r\n(?=[ \t])/g, "").split("\r\n")) {
    const colon = line.indexOf(":");
    headers[line.slice(0, colon).toLowerCase()] = decodeHeader(line.slice(colon + 1).trim());
  }
  const body = raw.slice(split + 4);
  const encoding = headers["content-transfer-encoding"]?.toLowerCase();
  let bytes = Buffer.from(body, "latin1");
  if (encoding === "base64") bytes = Buffer.from(body, "base64");
  if (encoding === "quoted-printable") bytes = Buffer.from(decodeQuoted(body.replace(/=\r\n/g, "")), "latin1");
  return { headers, text: bytes.toString("utf8").replaceAll("\r\n", "\n") };
}

/**
 * Startar en låtsas-mejlserver på 127.0.0.1. Den skickar aldrig något vidare.
 * `startTls: false` ger en server som inte erbjuder kryptering.
 *
 * Returnerar:
 * - env: miljövariabler till startSite(). Sätt NODE_EXTRA_CA_CERTS till "" för att sajten inte ska lita på certifikatet.
 * - mails: mottagna mejl som { from, to, encrypted, raw, headers, text }, med headers i gemener.
 * - auths: alla AUTH-försök som { encrypted }. `encrypted: false` betyder att lösenordet kan ha läckt.
 * - stop(): stänger servern. Anropa alltid i t.after() eller after().
 */
export async function startMailServer({ startTls = true } = {}) {
  const { key, cert } = createCertificate();
  const secureContext = tls.createSecureContext({ key, cert });
  const mails = [];
  const auths = [];
  const sockets = new Set();

  function converse(socket, encrypted) {
    let buffer = "";
    let inData = false;
    let authReplies = [];
    let mail = { from: "", to: [] };
    const send = (line) => socket.write(`${line}\r\n`);

    function command(line) {
      if (authReplies.length > 0) return send(authReplies.shift());

      const [verb, method = "", initial] = line.split(" ");
      const address = line.match(/<([^>]*)>/)?.[1] ?? "";
      switch (verb.toUpperCase()) {
        case "EHLO":
          // AUTH erbjuds även okrypterat, så att testerna kan upptäcka en klient som läcker.
          send("250-localhost");
          if (startTls && !encrypted) send("250-STARTTLS");
          return send("250 AUTH PLAIN LOGIN");
        case "STARTTLS": {
          if (!startTls || encrypted) return send("502 not supported");
          send("220 ready");
          socket.off("data", onData);
          const secure = new tls.TLSSocket(socket, { isServer: true, secureContext });
          secure.on("error", () => socket.destroy());
          return converse(secure, true);
        }
        case "AUTH":
          auths.push({ encrypted });
          // LOGIN frågar efter användarnamn och lösenord, PLAIN högst en gång.
          authReplies = ["334 VXNlcm5hbWU6", "334 UGFzc3dvcmQ6", "235 ok"];
          if (method.toUpperCase() === "PLAIN") authReplies.shift();
          if (initial) authReplies.shift();
          return send(authReplies.shift());
        case "MAIL":
          mail.from = address;
          return send("250 ok");
        case "RCPT":
          mail.to.push(address);
          return send("250 ok");
        case "DATA":
          inData = true;
          return send("354 go");
        case "QUIT":
          return socket.end("221 bye\r\n");
        default:
          return send("250 ok");
      }
    }

    function onData(chunk) {
      buffer += chunk.toString("latin1");
      for (;;) {
        const separator = inData ? "\r\n.\r\n" : "\r\n";
        const end = buffer.indexOf(separator);
        if (end < 0) return;
        const content = buffer.slice(0, end);
        buffer = buffer.slice(end + separator.length);
        if (inData) {
          inData = false;
          const raw = content.replace(/^\.\./gm, ".");
          mails.push({ ...mail, encrypted, raw, ...parseMail(raw) });
          mail = { from: "", to: [] };
          send("250 ok");
        } else {
          command(content);
        }
      }
    }

    socket.on("data", onData);
  }

  const server = net.createServer((socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.on("error", () => {});
    socket.write("220 localhost ESMTP\r\n");
    converse(socket, false);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const directory = mkdtempSync(path.join(tmpdir(), "uniclean-test-"));
  const certFile = path.join(directory, "cert.crt");
  writeFileSync(certFile, cert);

  return {
    env: {
      SMTP_HOST: "127.0.0.1",
      SMTP_PORT: String(server.address().port),
      SMTP_USER: "test",
      SMTP_PASS: "test",
      NODE_EXTRA_CA_CERTS: certFile,
    },
    mails,
    auths,
    async stop() {
      for (const socket of sockets) socket.destroy();
      await new Promise((resolve) => server.close(resolve));
      rmSync(directory, { recursive: true, force: true });
    },
  };
}
