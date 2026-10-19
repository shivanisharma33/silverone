import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

const SUGGESTIONS = [
  { label: 'Projects', href: '/projects/usa-projects/' },
  { label: 'News Releases', href: '/news/' },
  { label: 'Investor Information', href: '/investors/' },
  { label: 'Document Library', href: '/documents/' },
  { label: 'Contact', href: '/contact/' },
];

export default function NotFound() {
  return (
    <section className="bg-[var(--color-warm)] py-24 lg:py-36">
      <div className="shell-narrow text-center">
        <p className="eyebrow eyebrow-plain justify-center">Error 404</p>
        <h1 className="mt-5 font-serif text-[clamp(2.2rem,6vw,4rem)] leading-tight">
          This page could not be found
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-[var(--color-slate)]">
          The page you requested may have moved. Everything published on the previous Silver One
          site has been carried over — try one of the sections below.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Home size={15} aria-hidden />
            Back to home
          </Link>
          <Link href="/news/" className="btn btn-outline">
            Search the news archive
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <nav aria-label="Suggested pages" className="mt-14">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3">
            {SUGGESTIONS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="text-sm font-medium text-[var(--color-teal-900)] underline underline-offset-4 transition-colors hover:text-[var(--color-teal-700)]"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
