'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Check, Loader2 } from 'lucide-react';

type Status = 'idle' | 'sending' | 'ok' | 'error';

/**
 * Posts to the company's existing Mailchimp audience through /api/subscribe.
 * The message shown is whatever Mailchimp actually returned — never a canned
 * success.
 */
export function NewsletterSignup({
  variant = 'light',
  compact = false,
}: {
  variant?: 'light' | 'dark';
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [trap, setTrap] = useState('');
  const uid = useId();
  const dark = variant === 'dark';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, trap }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      setStatus(data.ok ? 'ok' : 'error');
      setMessage(data.message);
      if (data.ok) {
        setEmail('');
        setFirstName('');
        setLastName('');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again, or email info@silverone.com.');
    }
  }

  const fieldClass = dark
    ? 'w-full rounded-[3px] border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/50 transition-colors focus:border-[var(--color-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]/40'
    : 'w-full rounded-[3px] border border-[var(--color-stone)] bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-slate)]/70 transition-colors focus:border-[var(--color-teal-900)] focus:outline-none focus:ring-1 focus:ring-[var(--color-teal-900)]/20';

  return (
    <form onSubmit={onSubmit} noValidate>
      {!compact && (
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-fn`} className="sr-only">
              First name
            </label>
            <input
              id={`${uid}-fn`}
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={`${uid}-ln`} className="sr-only">
              Last name
            </label>
            <input
              id={`${uid}-ln`}
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>
      )}

      <div className={compact ? 'flex flex-col gap-2' : 'flex flex-col gap-3 sm:flex-row'}>
        <div className="flex-1">
          <label htmlFor={`${uid}-email`} className="sr-only">
            Email address
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            required
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={message ? `${uid}-msg` : undefined}
            aria-invalid={status === 'error' || undefined}
            className={fieldClass}
          />
        </div>

        {/* Mailchimp bot trap — hidden from people and assistive tech alike. */}
        <div aria-hidden className="absolute left-[-5000px]">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className={`btn ${dark ? 'btn-ghost-light' : 'btn-primary'} ${compact ? 'w-full' : ''} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {status === 'sending' ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden />
              Subscribing…
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight size={15} aria-hidden />
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.p
            id={`${uid}-msg`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-3 flex items-start gap-2 text-xs leading-relaxed ${
              status === 'ok'
                ? dark
                  ? 'text-[var(--color-gold-soft)]'
                  : 'text-[var(--color-teal-900)]'
                : dark
                  ? 'text-red-300'
                  : 'text-red-700'
            }`}
          >
            {status === 'ok' ? (
              <Check size={14} className="mt-0.5 shrink-0" aria-hidden />
            ) : (
              <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
            )}
            <span>{message}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
