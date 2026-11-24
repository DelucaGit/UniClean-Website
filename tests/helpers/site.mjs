import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const running = new Set();

// Skyddsnät om ett test avbryts utan att stop() hinner köras.
process.on("exit", () => {
  for (const child of running) child.kill();
});
for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => process.exit(1));

/**
 * Startar den byggda sajten på en ledig port med egna miljövariabler.
 * Värdena i `env` går före omgivningen och .env-filer. Utan SMTP-värden skickas inga mejl,
 * och SMTP_HOST får bara vara 127.0.0.1.
 *
 * Returnerar { url, log(), stop() }. Anropa alltid stop() i t.after() eller after().
 */
export async function startSite(env = {}) {
  if (!existsSync(path.join(root, ".next", "BUILD_ID"))) {
    throw new Error("Sajten är inte byggd. Kör `npm test`, som bygger först, eller `npm run build`.");
  }
  if (env.SMTP_HOST && env.SMTP_HOST !== "127.0.0.1") {
    throw new Error("Testerna får bara använda en mejlserver på 127.0.0.1.");
  }

  // Tomma värden hindrar Next.js från att läsa riktiga inställningar ur .env-filer.
  const neutralDefaults = {
    SMTP_HOST: "",
    SMTP_PORT: "",
    SMTP_USER: "",
    SMTP_PASS: "",
    SUPPORT_TO: "",
    SUPPORT_FROM: "",
    TRUSTED_PROXY_HOPS: "",
  };
  const inherited = { ...process.env };
  delete inherited.NODE_EXTRA_CA_CERTS;
  delete inherited.NODE_TLS_REJECT_UNAUTHORIZED;

  const next = path.join(root, "node_modules", "next", "dist", "bin", "next");
  const child = spawn(process.execPath, [next, "start", "-H", "127.0.0.1", "-p", "0"], {
    cwd: root,
    env: { ...inherited, ...neutralDefaults, NODE_ENV: "production", ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  running.add(child);
  const closed = new Promise((resolve) => child.once("close", resolve));
  closed.then(() => running.delete(child));
  let output = "";

  async function stop() {
    child.ref();
    if (child.exitCode === null && child.signalCode === null) child.kill();
    await closed;
  }

  try {
    const url = await new Promise((resolve, reject) => {
      const fail = (reason) => {
        clearTimeout(timer);
        reject(new Error(`Sajten startade inte (${reason}).\n${output}`));
      };
      const timer = setTimeout(() => fail("för lång tid"), 30_000);
      const read = (chunk) => {
        output += chunk;
        const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
        if (!address || !output.includes("Ready in")) return;
        clearTimeout(timer);
        resolve(address);
      };
      child.stdout.setEncoding("utf8").on("data", read);
      child.stderr.setEncoding("utf8").on("data", read);
      child.once("error", (error) => fail(error.message));
      child.once("close", (code) => fail(`avslutades med ${code}`));
    });
    // Ett test som glömmer stop() ska inte hänga. Då stoppas sajten när testprocessen avslutas.
    child.unref();
    child.stdout.unref();
    child.stderr.unref();
    return { url, log: () => output, stop };
  } catch (error) {
    await stop();
    throw error;
  }
}
