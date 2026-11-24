// Fältregler som formuläret och servern delar. Importeras i webbläsaren, så inget serverberoende här.

type SupportField = "name" | "email" | "message";
type SupportValues = Record<SupportField, string>;
export type SupportErrors = Partial<Record<SupportField, string>>;

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 2000;

/** Skriver 2000 som "2 000", med vanligt mellanslag. */
const formatLimit = (limit: number) => limit.toLocaleString("sv-SE").replace(/\s/g, " ");

// En ren adress: bokstäver (även åäö), siffror och vanliga tecken. Punkter skiljer delarna åt,
// så varje tecken kan bara matcha på ett sätt och mönstret blir aldrig långsamt.
const EMAIL_PATTERN =
  /^[\p{L}\p{M}\p{N}!#$%&'*+/=?^_`{|}~-]+(?:\.[\p{L}\p{M}\p{N}!#$%&'*+/=?^_`{|}~-]+)*@[\p{L}\p{M}\p{N}-]+(?:\.[\p{L}\p{M}\p{N}-]+)+$/u;

/** Kontrollerar värden som redan är trimmade. Längden kontrolleras före mönstret. */
export function validateSupport(values: SupportValues): SupportErrors {
  const errors: SupportErrors = {};

  if (!values.name) errors.name = "Fyll i ditt namn.";
  else if (values.name.length > MAX_NAME) errors.name = `Namnet får vara högst ${formatLimit(MAX_NAME)} tecken.`;

  if (!values.email) errors.email = "Fyll i din e-post.";
  else if (values.email.length > MAX_EMAIL) errors.email = `E-postadressen får vara högst ${formatLimit(MAX_EMAIL)} tecken.`;
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Fyll i en giltig e-postadress.";

  if (!values.message) errors.message = "Skriv vad det gäller.";
  else if (values.message.length > MAX_MESSAGE) errors.message = `Meddelandet får vara högst ${formatLimit(MAX_MESSAGE)} tecken.`;

  return errors;
}
