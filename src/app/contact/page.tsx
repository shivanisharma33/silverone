import Image from 'next/image';
import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageHero, Section, breadcrumbSchema } from '@/components/ui';
import { ContactForm } from '@/components/ContactForm';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { RevealOnScroll } from '@/components/Reveal';
import { pages } from '@/lib/content';
import { SocialLinks } from '@/components/SocialLinks';
import { CONTACT, SITE } from '@/lib/site';

const CRUMBS = [{ label: 'Contact' }];

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Silver One Resources Inc. — head office in Vancouver, British Columbia, and investor relations enquiries.',
  alternates: { canonical: '/contact/' },
};

function ContactBlock({
  label,
  person,
  org,
  lines,
  tel,
  telHref,
  email,
}: {
  label: string;
  person?: string;
  org?: string;
  lines: readonly string[];
  tel: string;
  telHref: string;
  email: string;
}) {
  return (
    <div>
      <h2 className="eyebrow">{label}</h2>
      <address className="mt-5 space-y-4 text-sm not-italic">
        {(person || org) && (
          <p className="font-serif text-xl not-italic text-[var(--color-ink)]">{person || org}</p>
        )}
        <div className="flex gap-3">
          <MapPin size={15} className="mt-1 shrink-0 text-[var(--color-gold)]" aria-hidden />
          <span className="text-[var(--color-slate)]">
            {person && org ? (
              <>
                {org}
                <br />
              </>
            ) : null}
            {lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </span>
        </div>
        <div className="flex gap-3">
          <Phone size={15} className="mt-0.5 shrink-0 text-[var(--color-gold)]" aria-hidden />
          <a href={telHref} className="text-[var(--color-slate)] transition-colors hover:text-[var(--color-teal-900)]">
            {tel}
          </a>
        </div>
        <div className="flex gap-3">
          <Mail size={15} className="mt-0.5 shrink-0 text-[var(--color-gold)]" aria-hidden />
          <a
            href={`mailto:${email}`}
            className="break-all text-[var(--color-slate)] transition-colors hover:text-[var(--color-teal-900)]"
          >
            {email}
          </a>
        </div>
      </address>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(CRUMBS, SITE.url)) }}
      />

      <PageHero
        title="Get in Touch"
        eyebrow="Contact"
        intro="We welcome your questions and look forward to hearing from you."
        image={pages.contact.banner}
        imageAlt=""
        crumbs={CRUMBS}
        compact
      />

      <Section tone="warm">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <RevealOnScroll className="space-y-12">
              <ContactBlock
                label={CONTACT.office.label}
                org={CONTACT.office.org}
                lines={CONTACT.office.lines}
                tel={CONTACT.office.tel}
                telHref={CONTACT.office.telHref}
                email={CONTACT.office.email}
              />
              <div className="hairline pt-12">
                <ContactBlock
                  label={CONTACT.ir.label}
                  person={CONTACT.ir.person}
                  org="Suite 1000 — Guinness Tower"
                  lines={CONTACT.ir.lines}
                  tel={CONTACT.ir.tel}
                  telHref={CONTACT.ir.telHref}
                  email={CONTACT.ir.email}
                />
              </div>

              <div className="pt-2">
                <SocialLinks />
              </div>
            </RevealOnScroll>
          </div>

          <div className="lg:col-span-7">
            <RevealOnScroll delay={0.08}>
              <ContactForm />

              <div id="subscribe" className="card mt-8 scroll-mt-32 bg-[var(--color-teal-50)] p-6 lg:p-8">
                <h2 className="font-serif text-2xl">Subscribe for Email Updates</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-slate)]">
                  Receive Silver One news releases by email as they are issued. You can unsubscribe
                  at any time using the link in any message.
                </p>
                <div className="mt-6">
                  <NewsletterSignup />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- location -- */}
      <Section tone="white" className="py-12 lg:py-14">
        <div className="shell">
          <RevealOnScroll>
            <figure className="relative isolate overflow-hidden rounded-[2px] border border-[var(--color-stone)]">
              <Image
                src={CONTACT.mapImage}
                alt="Map showing the Silver One Resources head office on West Hastings Street, Vancouver"
                width={1600}
                height={700}
                sizes="100vw"
                className="h-auto w-full"
              />

              <figcaption className="pointer-events-none absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                <span className="pointer-events-auto inline-flex max-w-sm flex-col gap-1 rounded-[2px] bg-white/95 p-4 shadow-[0_18px_40px_-26px_rgba(16,42,58,0.6)] backdrop-blur-sm sm:p-5">
                  <span className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-text)]">
                    <MapPin size={11} aria-hidden />
                    Our Location
                  </span>
                  <span className="mt-1 text-[0.875rem] leading-snug text-[var(--color-ink)]">
                    {CONTACT.office.org}
                    <br />
                    {CONTACT.office.lines.join(', ')}
                  </span>
                </span>
              </figcaption>
            </figure>
          </RevealOnScroll>
        </div>
      </Section>
    </>
  );
}
