import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { RevealChild, RevealGroup, RevealOnScroll } from '@/components/Reveal';

/* --------------------------------------------------------- editorial row */

/**
 * Text beside a photograph. Used for the project overviews and the About
 * page; `flip` puts the image on the left.
 */
export function FeatureRow({
  eyebrow,
  title,
  children,
  image,
  imageAlt,
  caption,
  flip = false,
  action,
  priority = false,
}: {
  eyebrow?: string;
  title?: ReactNode;
  children?: ReactNode;
  image?: string | null;
  imageAlt: string;
  caption?: string;
  flip?: boolean;
  action?: ReactNode;
  priority?: boolean;
}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <RevealOnScroll className={flip ? 'lg:order-2' : undefined}>
        {eyebrow && <p className="eyebrow text-[0.625rem]">{eyebrow}</p>}
        {title && (
          <h2 className="mt-3 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1] text-[var(--color-ink)]">
            {title}
          </h2>
        )}
        {children}
        {action && <div className="mt-6">{action}</div>}
      </RevealOnScroll>

      {image && (
        <RevealOnScroll delay={0.08} y={22} className={flip ? 'lg:order-1' : undefined}>
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-[var(--color-stone)]">
              <Image
                src={image}
                alt={imageAlt}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            {caption && (
              <figcaption className="mt-2.5 text-[0.6875rem] leading-snug text-[var(--color-slate)]">
                {caption}
              </figcaption>
            )}
          </figure>
        </RevealOnScroll>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- key facts */

export type Fact = {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
};

/** Boxed list of project attributes, as on the reference project pages. */
export function FactCard({ facts, title }: { facts: Fact[]; title?: string }) {
  return (
    <div className="card bg-[var(--color-stone-soft)] p-5 lg:p-6">
      {title && (
        <h3 className="mb-4 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-text)]">
          {title}
        </h3>
      )}
      {/* A <div> inside a <dl> must contain the <dt>/<dd> pair directly, so
          the icon sits inside the term rather than beside the group. */}
      <dl className="space-y-4">
        {facts.map((f) => (
          <div key={f.label} className="grid grid-cols-[1.0625rem_minmax(0,1fr)] gap-x-3.5">
            <dt className="col-span-2 grid grid-cols-subgrid items-center text-[0.625rem] font-semibold uppercase tracking-[0.13em] text-[var(--color-slate)]">
              <f.icon
                size={17}
                strokeWidth={1.4}
                className="shrink-0 text-[var(--color-gold)]"
                aria-hidden
              />
              <span>{f.label}</span>
            </dt>
            <dd className="col-start-2 mt-0.5 text-[0.875rem] font-medium leading-snug text-[var(--color-ink)]">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------ icon points */

export type IconPoint = {
  title: string;
  body: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
};

/** Stacked gold-icon points, as in the About page reference. */
export function IconPoints({ points }: { points: IconPoint[] }) {
  return (
    <RevealGroup className="space-y-7" stagger={0.08}>
      {points.map((p) => (
        <RevealChild key={p.title}>
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-gold)]/35 bg-white">
              <p.icon size={17} strokeWidth={1.4} className="text-[var(--color-gold)]" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="font-serif text-[1.15rem] leading-tight text-[var(--color-ink)]">
                {p.title}
              </h2>
              <p className="mt-1.5 text-[0.875rem] leading-[1.62] text-[var(--color-slate)]">
                {p.body}
              </p>
            </div>
          </div>
        </RevealChild>
      ))}
    </RevealGroup>
  );
}

/* --------------------------------------------------------------- CTA band */

/** Full-width photographic band with an overlaid heading and action. */
export function CtaBand({
  image,
  imageAlt,
  eyebrow,
  title,
  body,
  href,
  action,
  external = false,
}: {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  body?: string;
  href: string;
  action: string;
  external?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-navy)]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 scrim" aria-hidden />

      <div className="shell relative py-14 lg:py-16">
        <RevealOnScroll className="ml-auto max-w-xl lg:text-right">
          {eyebrow && (
            <p className="eyebrow eyebrow-plain text-[0.625rem] text-[var(--color-gold-soft)] lg:justify-end">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-3 font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.1] text-white">
            {title}
          </h2>
          {body && (
            <p className="mt-3 text-[0.875rem] leading-[1.62] text-white/78 lg:ml-auto">{body}</p>
          )}
          <div className="mt-6">
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                {action}
                <ArrowRight size={15} aria-hidden />
              </a>
            ) : (
              <Link href={href} className="btn btn-ghost-light">
                {action}
                <ArrowRight size={15} aria-hidden />
              </Link>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- dark panel */

/** Deep-navy statement band used to close the About page. */
export function StatementBand({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-[var(--color-navy)] py-14 lg:py-16">
      <div className="shell">
        <RevealOnScroll className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            {eyebrow && (
              <p className="eyebrow text-[0.625rem] text-[var(--color-gold-soft)]">{eyebrow}</p>
            )}
            <h2 className="mt-3 font-serif text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1] text-white">
              {title}
            </h2>
          </div>
          <div className="prose-sve prose-invert text-[0.9375rem]">{children}</div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
