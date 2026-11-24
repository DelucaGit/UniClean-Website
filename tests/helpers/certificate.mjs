import { createHash, generateKeyPairSync, randomBytes, sign } from "node:crypto";

// Minsta möjliga DER-kodning. Node kan inte skapa certifikat själv, och så slipper testerna kräva OpenSSL.
function der(tag, ...parts) {
  const body = Buffer.concat(parts);
  if (body.length < 128) return Buffer.concat([Buffer.from([tag, body.length]), body]);
  const hex = body.length.toString(16);
  const length = Buffer.from(hex.length % 2 ? `0${hex}` : hex, "hex");
  return Buffer.concat([Buffer.from([tag, 0x80 | length.length]), length, body]);
}

const sequence = (...parts) => der(0x30, ...parts);
const oid = (hex) => der(0x06, Buffer.from(hex, "hex"));
const integer = (...bytes) => der(0x02, Buffer.from(bytes));
const extension = (id, value) => sequence(oid(id), der(0x04, value));

function utcTime(ms) {
  const text = new Date(ms).toISOString().replace(/[-:T]/g, "").slice(2, 14);
  return der(0x17, Buffer.from(`${text}Z`));
}

/**
 * Skapar ett självsignerat certifikat för 127.0.0.1 och localhost, giltigt ett dygn.
 * Nyckeln finns bara i minnet. Returnerar { key, cert } i PEM-format.
 */
export function createCertificate() {
  const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const spki = publicKey.export({ type: "spki", format: "der" });
  const algorithm = sequence(oid("2a8648ce3d040302")); // ecdsa-with-SHA256
  const name = sequence(der(0x31, sequence(oid("550403"), der(0x0c, Buffer.from("UniClean test")))));
  const hour = 60 * 60 * 1000;
  const keyId = createHash("sha1").update(spki).digest();

  const extensions = sequence(
    extension("551d13", sequence(der(0x01, Buffer.from([0xff])))), // basicConstraints: CA
    extension("551d0e", der(0x04, keyId)), // subjectKeyIdentifier
    extension(
      "551d11", // subjectAltName
      sequence(der(0x82, Buffer.from("localhost")), der(0x87, Buffer.from([127, 0, 0, 1]))),
    ),
  );
  const unsigned = sequence(
    der(0xa0, integer(2)), // X.509 v3
    integer(0x01, ...randomBytes(8)),
    algorithm,
    name,
    sequence(utcTime(Date.now() - hour), utcTime(Date.now() + 24 * hour)),
    name,
    spki,
    der(0xa3, extensions),
  );
  const signature = der(0x03, Buffer.from([0]), sign("sha256", unsigned, privateKey));
  const base64 = sequence(unsigned, algorithm, signature).toString("base64").match(/.{1,64}/g).join("\n");

  return {
    key: privateKey.export({ type: "pkcs8", format: "pem" }),
    cert: `-----BEGIN CERTIFICATE-----\n${base64}\n-----END CERTIFICATE-----\n`,
  };
}
