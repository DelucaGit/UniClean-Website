"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/config/site";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const MAX_MESSAGE = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldClass =
  "block w-full resize-y rounded-[10px] border-2 border-transparent bg-soft px-[16px] py-[15px] font-semibold text-ink outline-none focus:border-ink focus:bg-white";
const errorClass = "mt-[6px] text-[14px] font-bold text-ink";

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (!values.name) errors.name = "Fyll i ditt namn.";
  if (!values.email) errors.email = "Fyll i din e-post.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Fyll i en giltig e-postadress.";
  if (!values.message) errors.message = "Skriv vad det gäller.";
  else if (values.message.length > MAX_MESSAGE)
    errors.message = "Meddelandet får vara högst 2 000 tecken.";
  return errors;
}

export function SupportForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const { email } = site.contact;
  const sending = status === "sending";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    const found = validate(values);
    setErrors(found);
    const firstInvalid = (["name", "email", "message"] as const).find((field) => found[field]);
    if (firstInvalid) {
      setStatus("idle");
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/support/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: String(data.get("company") ?? "") }),
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form id="support" noValidate onSubmit={handleSubmit} className="grid gap-[10px]">
      <h3 className="mb-[6px] text-[22px]">Skicka ett supportärende</h3>

      <div>
        <label htmlFor="support-name" className="sr-only">
          Namn
        </label>
        <input
          id="support-name"
          name="name"
          type="text"
          placeholder="Namn"
          autoComplete="name"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "support-name-error" : undefined}
          className={fieldClass}
        />
        {errors.name && (
          <p id="support-name-error" role="alert" className={errorClass}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="support-email" className="sr-only">
          E-post
        </label>
        <input
          id="support-email"
          name="email"
          type="email"
          placeholder="E-post"
          autoComplete="email"
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "support-email-error" : undefined}
          className={fieldClass}
        />
        {errors.email && (
          <p id="support-email-error" role="alert" className={errorClass}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="support-message" className="sr-only">
          Vad gäller det?
        </label>
        <textarea
          id="support-message"
          name="message"
          rows={4}
          placeholder="Vad gäller det?"
          autoComplete="off"
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "support-message-error" : undefined}
          className={fieldClass}
        />
        {errors.message && (
          <p id="support-message-error" role="alert" className={errorClass}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: dolt för människor, fylls bara i av robotar. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="support-company">Företag</label>
        <input id="support-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-[6px] inline-flex cursor-pointer items-center justify-center gap-[8px] justify-self-start rounded-[10px] border-0 bg-dark px-[22px] py-[14px] text-[16px] font-extrabold whitespace-nowrap text-white transition-opacity duration-150 hover:opacity-[.88] disabled:cursor-default disabled:opacity-60"
      >
        {sending ? "Skickar" : "Skicka"}
      </button>

      <div aria-live="polite" className="font-bold">
        {status === "sent" && "Tack, vi hör av oss."}
        {status === "error" && (
          <>
            Det gick inte att skicka. Mejla oss på <a href={`mailto:${email}`}>{email}</a>
          </>
        )}
      </div>
    </form>
  );
}
