// Fältregler som formuläret och servern delar. Importeras i webbläsaren, så inget serverberoende här.

export type SupportField = "name" | "email" | "message";
export type SupportValues = Record<SupportField, string>;
export type SupportErrors = Partial<Record<SupportField, string>>;

export const MAX_NAME = 100;
export const MAX_EMAIL = 254;
export const MAX_MESSAGE = 2000;

// En ren adress: bokstäver (även åäö), siffror och vanliga tecken. Punkter skiljer delarna åt,
// så varje tecken kan bara matcha på ett sätt och mönstret blir aldrig långsamt.
const EMAIL_PATTERN =
  /^[\p{L}\p{M}\p{N}!#$%&'*+/=?^_`{|}~-]+(?:\.[\p{L}\p{M}\p{N}!#$%&'*+/=?^_`{|}~-]+)*@[\p{L}\p{M}\p{N}-]+(?:\.[\p{L}\p{M}\p{N}-]+)+$/u;

/** Kontrollerar värden som redan är trimmade. Längden kontrolleras före mönstret. */
export function validateSupport(values: SupportValues): SupportErrors {
  const errors: SupportErrors = {};

  if (!values.name) errors.name = "Fyll i ditt namn.";
  else if (values.name.length > MAX_NAME) errors.name = "Namnet får vara högst 100 tecken.";

  if (!values.email) errors.email = "Fyll i din e-post.";
  else if (values.email.length > MAX_EMAIL) errors.email = "E-postadressen får vara högst 254 tecken.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Fyll i en giltig e-postadress.";

  if (!values.message) errors.message = "Skriv vad det gäller.";
  else if (values.message.length > MAX_MESSAGE) errors.message = "Meddelandet får vara högst 2 000 tecken.";

  return errors;
}
