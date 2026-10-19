import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Bell, Mail, Rss } from 'lucide-react';
import { PageHero, Section, breadcrumbSchema } from '@/components/ui';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { RevealOnScroll } from '@/components/Reveal';
import { pages } from '@/lib/content';
import { CONTACT, SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Contact', href: '/contact/' }, { label: 'Subscribe for Email Updates' }];

export const metadata: Metadata = {
  title: 'Subscribe for Email Updates',
  description:
    'Subscribe to receive Silver One Resources Inc. news releases and corporate updates by email as they are issued.',
  alternates: { canonical: '/contact/subscribe-for-email-updates/' },
};

export default function SubscribePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />

      <PageHero
        title="Subscribe for Email Updates"
        eyebrow="Stay informed"
        intro="Be the first to receive Silver One news releases, exploration results and corporate updates."
        image={pages.contact.banner}
        crumbs={CRUMBS}
        compact
      />

      <Section tone="warm">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <RevealOnScroll>
              <div className="card p-6 lg:p-8">
                <h2 className="flex items-center gap-2.5 font-serif text-2xl">
                  <Bell size={19} className="text-[var(--color-gold)]" aria-hidden />
                  Join the mailing list
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-slate)]">
                  News releases are sent as they are issued. We never share your address, and every
                  message includes a one-click unsubscribe link.
                </p>
                <div className="mt-7">
                  <NewsletterSignup />
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <aside className="lg:col-span-5">
            <RevealOnScroll delay={0.08} className="space-y-5">
              <div className="card p-6">
                <h2 className="flex items-center gap-2.5 font-serif text-xl">
                  <Rss size={17} className="text-[var(--color-gold)]" aria-hidden />
                  Prefer a feed?
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-slate)]">
                  Subscribe to our RSS feed in your reader of choice.
                </p>
                <a href="/rss.xml" className="btn btn-outline mt-5">
                  RSS Feed
                  <ArrowRight size={14} aria-hidden />
                </a>
              </div>

              <div className="card p-6">
                <h2 className="flex items-center gap-2.5 font-serif text-xl">
                  <Mail size={17} className="text-[var(--color-gold)]" aria-hidden />
                  Investor relations
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-slate)]">
                  For direct enquiries, contact {CONTACT.ir.person}.
                </p>
                <a href={`mailto:${CONTACT.ir.email}`} className="btn btn-outline mt-5">
                  {CONTACT.ir.email}
                </a>
              </div>

              <div className="card p-6">
                <h2 className="font-serif text-xl">Browse the archive</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-slate)]">
                  Every release since 2016 is published on this site.
                </p>
                <Link href="/news/" className="btn btn-outline mt-5">
                  News Releases
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </RevealOnScroll>
          </aside>
        </div>
      </Section>
    </>
  );
}
