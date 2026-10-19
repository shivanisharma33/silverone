'use client';

import { Mail } from 'lucide-react';
import { RevealOnScroll } from '@/components/Reveal';
import { NewsletterSignup } from '@/components/NewsletterSignup';

/**
 * Full-width newsletter CTA band for the homepage. Uses the dark gradient
 * background with a subtle gold radial highlight. The form posts to the
 * company's existing Mailchimp audience through /api/subscribe.
 */
export function NewsletterBand() {
  return (
    <section className="newsletter-band" aria-label="Newsletter subscription">
      <div className="shell relative py-14 lg:py-16">
        <RevealOnScroll>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/[0.08]">
                  <Mail size={18} strokeWidth={1.4} className="text-[var(--color-gold-soft)]" aria-hidden />
                </span>
                <p className="eyebrow eyebrow-plain text-[0.625rem] text-[var(--color-gold-soft)]">
                  Stay Informed
                </p>
              </div>
              <h2 className="mt-4 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.08] text-white">
                Receive News Releases
                <br className="hidden sm:block" />
                {' '}Directly by Email
              </h2>
              <p className="mt-3 max-w-md text-[0.875rem] leading-[1.6] text-white/65">
                Subscribe to receive Silver One news releases, corporate updates, and investor
                communications as they are published.
              </p>
            </div>

            <div className="max-w-lg lg:ml-auto lg:w-full">
              <NewsletterSignup variant="dark" />
              <p className="mt-3 text-[0.6875rem] leading-relaxed text-white/40">
                We respect your privacy. Unsubscribe at any time. Your information will not be shared
                with third parties.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
