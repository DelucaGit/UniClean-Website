import nodemailer from "nodemailer";
import { site } from "@/config/site";

export type SupportMail = {
  name: string;
  email: string;
  message: string;
};

/** Tar bort radbrytningar så att värdet inte kan lägga till egna mejlhuvuden. */
export function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Skickar ett supportärende som mejl. Kastar fel om det inte går att skicka. */
export async function sendSupportMail({ name, email, message }: SupportMail): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SUPPORT_TO, SUPPORT_FROM } = process.env;
  if (!SMTP_HOST) throw new Error("SMTP_HOST saknas");

  const port = Number(SMTP_PORT) || 587;
  const to = SUPPORT_TO || site.contact.email;
  const safeName = singleLine(name);
  const safeEmail = singleLine(email);

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS ?? "" } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  await transport.sendMail({
    from: SUPPORT_FROM || SMTP_USER || to,
    to,
    replyTo: safeEmail,
    subject: `Supportärende från ${safeName}`,
    text: `Namn: ${safeName}\nE-post: ${safeEmail}\n\n${message}\n`,
  });
}
