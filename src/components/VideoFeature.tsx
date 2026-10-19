'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Lightweight YouTube facade: shows a poster image and only mounts the iframe
 * once the visitor asks for it, so no third-party player ships on first paint.
 */
export function VideoFeature({
  videoId,
  title,
  poster,
  eyebrow,
  caption,
  duration,
  compact = false,
  className = '',
}: {
  videoId: string;
  title: string;
  poster?: string | null;
  eyebrow?: string;
  caption?: string;
  duration?: string;
  /** Tightens type and padding for the short homepage band. */
  compact?: boolean;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const thumb = poster || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className={`relative isolate h-full w-full overflow-hidden bg-[var(--color-navy-deep)] ${className}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full text-left"
        >
          <Image
            src={thumb}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            unoptimized={thumb.startsWith('http')}
          />
          <span className="absolute inset-0 scrim-soft" aria-hidden />

          <span
            className={`absolute inset-x-0 bottom-0 flex flex-col ${
              compact ? 'p-6 lg:p-8' : 'p-7 lg:p-10'
            }`}
          >
            {eyebrow && (
              <span
                className={`eyebrow text-[var(--color-gold-soft)] ${compact ? 'text-[0.625rem]' : ''}`}
              >
                {eyebrow}
              </span>
            )}
            <span
              className={`mt-3 max-w-md font-serif leading-[1.06] text-white ${
                compact
                  ? 'text-[clamp(1.5rem,2.3vw,2.05rem)]'
                  : 'mt-4 text-[clamp(1.7rem,3vw,2.5rem)]'
              }`}
            >
              {title}
            </span>
            {caption && (
              <span
                className={`max-w-sm text-white/75 ${compact ? 'mt-2 text-[0.75rem] leading-snug' : 'mt-3 text-sm'}`}
              >
                {caption}
              </span>
            )}

            <span className={`inline-flex items-center ${compact ? 'mt-4 gap-3' : 'mt-7 gap-3.5'}`}>
              <span
                className={`grid place-items-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-white group-hover:bg-white ${
                  compact ? 'h-9 w-9' : 'h-12 w-12'
                }`}
              >
                <Play
                  size={compact ? 13 : 17}
                  className="translate-x-px fill-white text-white transition-colors duration-300 group-hover:fill-[var(--color-navy)] group-hover:text-[var(--color-navy)]"
                  aria-hidden
                />
              </span>
              <span className={`font-semibold text-white ${compact ? 'text-[0.8125rem]' : 'text-sm'}`}>
                Watch Video
                {duration && <span className="ml-2.5 font-normal text-white/70">{duration}</span>}
              </span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
