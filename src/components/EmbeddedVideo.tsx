'use client';

import { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import type { TabVideo } from '@/lib/types';

/**
 * Click-to-load facade for a video embedded in migrated page content.
 *
 * The original pages embedded players eagerly, which loads a third-party
 * frame on every visit. Here nothing is requested until the visitor presses
 * play, and the source URL is always offered as a direct link so the
 * reference survives even when the hosted video is unavailable.
 */
export function EmbeddedVideo({ video, label }: { video: TabVideo; label: string }) {
  const [playing, setPlaying] = useState(false);

  const embedSrc =
    video.provider === 'youtube' && video.id
      ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`
      : video.provider === 'vimeo' && video.id
        ? `https://player.vimeo.com/video/${video.id}?autoplay=1`
        : video.src;

  const title = video.title || `${label} video`;

  return (
    <figure className="overflow-hidden rounded-[3px] border border-[var(--color-stone)] bg-[var(--color-navy)]">
      <div className="relative aspect-video w-full">
        {playing ? (
          <iframe
            src={embedSrc}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 grid h-full w-full place-items-center bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-deep)]"
            aria-label={`Play ${title}`}
          >
            <span className="flex flex-col items-center gap-4 px-6 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-white group-hover:bg-white">
                <Play
                  size={20}
                  className="translate-x-px fill-white text-white transition-colors duration-300 group-hover:fill-[var(--color-navy)] group-hover:text-[var(--color-navy)]"
                  aria-hidden
                />
              </span>
              <span className="text-sm font-semibold text-white">{title}</span>
              <span className="text-xs text-white/65">
                Hosted on {video.provider === 'other' ? 'an external service' : video.provider}
              </span>
            </span>
          </button>
        )}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-stone)] bg-white px-4 py-3">
        <span className="text-xs text-[var(--color-slate)]">{title}</span>
        <a
          href={video.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-teal-900)] transition-colors hover:text-[var(--color-teal-700)]"
        >
          Open on {video.provider === 'other' ? 'source site' : video.provider}
          <ExternalLink size={12} aria-hidden />
        </a>
      </figcaption>
    </figure>
  );
}
