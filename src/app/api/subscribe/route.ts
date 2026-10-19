import { NextResponse } from 'next/server';
import { MAILCHIMP } from '@/lib/site';

/**
 * Server-side proxy to the company's existing Mailchimp audience.
 *
 * The browser cannot POST to list-manage.com directly (no CORS), so we relay
 * the request and surface Mailchimp's *actual* verdict. Nothing is faked: if
 * Mailchimp rejects the address, the caller gets that error text back.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Malformed request.' }, { status: 400 });
  }

  const email = String(payload.email ?? '').trim();
  const firstName = String(payload.firstName ?? '').trim();
  const lastName = String(payload.lastName ?? '').trim();
  const phone = String(payload.phone ?? '').trim();
  const trap = String(payload.trap ?? '').trim();

  // Mailchimp's bot-trap field: a real person never fills it in.
  if (trap) return NextResponse.json({ ok: true, message: 'Thank you for subscribing.' });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { ok: false, message: 'Please enter a valid email address.' },
      { status: 422 }
    );
  }

  // The classic embed exposes a JSON sibling of the /subscribe/post endpoint.
  const endpoint = MAILCHIMP.action.replace('/subscribe/post', '/subscribe/post-json');
  const url = new URL(endpoint);
  url.searchParams.set('EMAIL', email);
  if (firstName) url.searchParams.set('FNAME', firstName);
  if (lastName) url.searchParams.set('LNAME', lastName);
  if (phone) url.searchParams.set('PHONE', phone);
  url.searchParams.set(MAILCHIMP.honeypot, '');

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'silverone.com newsletter form' },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });

    const raw = await res.text();
    // Strip a JSONP wrapper if Mailchimp sends one.
    const json = raw.replace(/^[^(]*\(/, '').replace(/\)\s*;?\s*$/, '');
    const data = JSON.parse(json) as { result?: string; msg?: string };

    if (data.result === 'success') {
      return NextResponse.json({ ok: true, message: data.msg || 'Thank you for subscribing.' });
    }

    // Mailchimp returns HTML fragments inside msg for some errors.
    const msg = (data.msg || 'We could not complete your subscription.')
      .replace(/<[^>]*>/g, '')
      .replace(/^\d+\s*-\s*/, '')
      .trim();

    // An already-subscribed address is not a failure the visitor must act on.
    if (/already subscribed/i.test(msg)) {
      return NextResponse.json({ ok: true, message: 'This address is already on our list.' });
    }

    return NextResponse.json({ ok: false, message: msg }, { status: 422 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          'We could not reach the subscription service. Please try again shortly, or email info@silverone.com.',
      },
      { status: 502 }
    );
  }
}
