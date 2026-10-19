'use server';

import { CONTACT } from '@/lib/site';

export type ContactState = {
  status: 'idle' | 'ok' | 'error';
  message: string;
  /** Field-level validation messages, keyed by input name. */
  fieldErrors?: Record<string, string>;
};

const MAX = { name: 120, email: 160, phone: 40, company: 140, message: 5000 };

/**
 * Handles the contact form.
 *
 * Delivery goes to whichever transport is configured by environment variable:
 *   CONTACT_WEBHOOK_URL  — POST the submission as JSON (Zapier, Make, Slack…)
 *   RESEND_API_KEY + CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL — send via Resend
 *
 * If no transport is configured, or if the configured one fails, the visitor
 * is told plainly and given the mailbox address instead. The form never
 * reports success for a message that was not actually delivered.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? '').trim();

  // Honeypot: hidden from real users, irresistible to naive bots.
  if (get('company_website')) {
    return { status: 'ok', message: 'Thank you — your message has been sent.' };
  }

  const name = get('full_name').slice(0, MAX.name);
  const email = get('email_address').slice(0, MAX.email);
  const phone = get('telephone').slice(0, MAX.phone);
  const company = get('company').slice(0, MAX.company);
  const message = get('message_comments').slice(0, MAX.message);

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.full_name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    fieldErrors.email_address = 'Please enter a valid email address.';
  }
  if (message.length < 10) {
    fieldErrors.message_comments = 'Please include a message of at least 10 characters.';
  }
  if (Object.keys(fieldErrors).length) {
    return {
      status: 'error',
      message: 'Please correct the highlighted fields and try again.',
      fieldErrors,
    };
  }

  const payload = { name, email, phone, company, message, receivedAt: new Date().toISOString() };
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || CONTACT.office.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } else if (resendKey && from) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `Website enquiry from ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Telephone: ${phone}` : null,
            company ? `Company: ${company}` : null,
            '',
            message,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    } else {
      // No transport configured — say so rather than pretending to deliver.
      return {
        status: 'error',
        message: `This form is not yet connected to a mail service, so your message was not sent. Please email ${to} directly and we will respond promptly.`,
      };
    }
  } catch (err) {
    console.error('[contact] delivery failed:', err);
    return {
      status: 'error',
      message: `We could not send your message just now. Please email ${to} directly, or call ${CONTACT.office.tel}.`,
    };
  }

  return {
    status: 'ok',
    message: 'Thank you — your message has been sent. We will be in touch shortly.',
  };
}
