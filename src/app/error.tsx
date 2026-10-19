'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { RotateCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-[var(--color-warm)] py-24 lg:py-36">
      <div className="shell-narrow text-center">
        <p className="eyebrow eyebrow-plain justify-center">Something went wrong</p>
        <h1 className="mt-5 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
          We could not display this page
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-[var(--color-slate)]">
          An unexpected error occurred. Please try again — if the problem persists, contact{' '}
          <a
            href="mailto:info@silverone.com"
            className="text-[var(--color-teal-900)] underline underline-offset-2"
          >
            info@silverone.com
          </a>
          .
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-[var(--color-slate)]">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            <RotateCw size={15} aria-hidden />
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
