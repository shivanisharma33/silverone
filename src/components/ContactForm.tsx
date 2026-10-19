'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertCircle, Check, Loader2, Send } from 'lucide-react';
import { submitContact, type ContactState } from '@/app/contact/actions';

const INITIAL: ContactState = { status: 'idle', message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin" aria-hidden />
          Sending…
        </>
      ) : (
        <>
          Send Message
          <Send size={15} aria-hidden />
        </>
      )}
    </button>
  );
}

function Field({
  id,
  label,
  type = 'text',
  required,
  autoComplete,
  error,
  textarea,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  textarea?: boolean;
}) {
  const base =
    'mt-2 w-full border bg-white px-3.5 py-2.5 text-sm text-[var(--color-ink)] transition-colors focus:outline-none';
  const cls = `${base} ${
    error
      ? 'border-red-600 focus:border-red-700'
      : 'border-[var(--color-stone)] focus:border-[var(--color-teal-900)]'
  }`;

  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)]">
        {label}
        {required && (
          <span className="ml-1 text-[var(--color-gold)]" aria-hidden>
            *
          </span>
        )}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={6}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`${cls} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cls}
        />
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
          <AlertCircle size={12} aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, INITIAL);
  const errs = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="card p-6 lg:p-8">
      <h2 className="font-serif text-2xl">Send a Message</h2>
      <p className="mt-2 text-sm text-[var(--color-slate)]">
        Fields marked <span className="text-[var(--color-gold-text)]">*</span> are required.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field id="full_name" label="Full name" required autoComplete="name" error={errs.full_name} />
        <Field
          id="email_address"
          label="Email address"
          type="email"
          required
          autoComplete="email"
          error={errs.email_address}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field id="telephone" label="Telephone" type="tel" autoComplete="tel" error={errs.telephone} />
        <Field id="company" label="Company" autoComplete="organization" error={errs.company} />
      </div>

      <div className="mt-5">
        <Field id="message_comments" label="Message" required textarea error={errs.message_comments} />
      </div>

      {/* Honeypot — positioned off-screen and hidden from assistive tech. */}
      <div aria-hidden className="absolute left-[-5000px]" >
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <SubmitButton />
      </div>

      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-5 flex items-start gap-2 border-l-2 py-1 pl-3 text-sm leading-relaxed ${
            state.status === 'ok'
              ? 'border-[var(--color-teal-900)] text-[var(--color-teal-900)]'
              : 'border-red-600 text-red-700'
          }`}
        >
          {state.status === 'ok' ? (
            <Check size={15} className="mt-0.5 shrink-0" aria-hidden />
          ) : (
            <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden />
          )}
          <span>{state.message}</span>
        </p>
      )}
    </form>
  );
}
