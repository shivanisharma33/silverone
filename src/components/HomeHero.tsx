'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { MarketPanel } from '@/components/MarketPanel';

/**
 * Cinematic hero band — full-impact above-the-fold composition.
 *
 * The hero now occupies a generous viewport slice on larger screens so the
 * photography, headline, and market panel have room to breathe. On mobile the
 * layout stacks naturally with appropriate padding.
 */
export function HomeHero({ image, alt }: { image: string; alt: string }) {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0.25 : 0.8,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section className="relative isolate flex min-h-[32rem] items-center overflow-hidden bg-[var(--color-navy-deep)] sm:min-h-[28rem] lg:min-h-[26rem] xl:min-h-[30rem] 2xl:min-h-[34rem]">
      {/* Slow, restrained reveal of the landscape — no looping background motion. */}
      <motion.div
        initial={{ scale: reduce ? 1 : 1.08, opacity: 0.35 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduce ? 0.3 : 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_38%]"
        />
      </motion.div>

      <div className="absolute inset-0 scrim-hero" aria-hidden />

      {/* Subtle animated grain overlay for cinematic feel */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        aria-hidden
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="shell relative w-full py-12 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <motion.p
              {...rise(0.08)}
              className="eyebrow flex-wrap gap-x-2.5 gap-y-1 text-[0.625rem] text-[var(--color-gold-soft)] max-sm:[&::after]:hidden sm:gap-x-3"
            >
              <span>Explore</span>
              <span aria-hidden className="text-white/35">·</span>
              <span>Develop</span>
              <span aria-hidden className="text-white/35">·</span>
              <span>Create Long-Term Value</span>
            </motion.p>

            <motion.h1
              {...rise(0.16)}
              className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.96] tracking-[-0.024em] text-white"
            >
              Unlocking Silver Value{' '}
              <span className="block mt-1 text-gradient-gold" style={{ WebkitTextFillColor: 'unset', color: 'var(--color-gold-soft)' }}>
                in Premier Jurisdictions
              </span>
            </motion.h1>

            <motion.p
              {...rise(0.26)}
              className="mt-5 max-w-[28rem] text-[1rem] leading-[1.6] text-white/80"
            >
              Silver One Resources is focused on the exploration and development of quality silver
              projects in the United States, with a portfolio of assets in Nevada and Arizona.
            </motion.p>

            <motion.div {...rise(0.36)} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/projects/usa-projects/" className="btn btn-primary h-12">
                Explore Our Projects
                <ArrowRight size={15} aria-hidden />
              </Link>
              <Link href="/investors/" className="btn btn-ghost-light h-12">
                <TrendingUp size={15} aria-hidden />
                Investor Information
              </Link>
            </motion.div>

            {/* Exchange listings pill */}
            <motion.div
              {...rise(0.46)}
              className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2"
            >
              {[
                { exchange: 'TSX-V', symbol: 'SVE' },
                { exchange: 'OTCQX', symbol: 'SLVRF' },
                { exchange: 'FSE', symbol: 'BRK1' },
              ].map((l) => (
                <span
                  key={l.symbol}
                  className="inline-flex items-baseline gap-1.5 text-[0.6875rem] text-white/50"
                >
                  <span className="font-medium">{l.exchange}:</span>
                  <span className="font-bold text-white/80 tracking-wide">{l.symbol}</span>
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div {...rise(0.5)} className="w-full sm:max-w-sm lg:w-[23rem] lg:shrink-0">
            <MarketPanel variant="hero" />
          </motion.div>
        </div>
      </div>

      {/* Bottom edge vignette for seamless transition to metrics */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        aria-hidden
        style={{
          background: 'linear-gradient(to top, var(--color-warm) 0%, transparent 100%)',
        }}
      />
    </section>
  );
}
