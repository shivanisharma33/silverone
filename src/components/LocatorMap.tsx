import type { Project } from '@/lib/types';

/**
 * Schematic locator for the three properties. Deliberately a simple drawing
 * rather than a photograph or a survey map: it carries only the state and
 * approximate district each project sits in, all of which is stated on the
 * project pages. It is not to scale and is labelled as such.
 */

type Pin = { slug: string; label: string; x: number; y: number; anchor?: 'start' | 'end' };

const PINS: Pin[] = [
  // Candelaria — central-west Nevada, off Highway 95.
  { slug: 'candelaria', label: 'Candelaria', x: 84, y: 114, anchor: 'end' },
  // Cherokee — Lincoln County, south-eastern Nevada.
  { slug: 'cherokee', label: 'Cherokee', x: 137, y: 132 },
  // Phoenix Silver — near Globe, east-central Arizona.
  { slug: 'silver_phoenix', label: 'Phoenix Silver', x: 221, y: 243, anchor: 'end' },
];

export function LocatorMap({ projects }: { projects: Project[] }) {
  const title = 'Approximate locations of the Candelaria, Cherokee and Phoenix Silver projects in Nevada and Arizona';

  return (
    <figure className="card bg-[var(--color-stone-soft)] p-5 lg:p-7">
      <svg viewBox="8 8 290 300" role="img" aria-label={title} className="h-auto w-full">
        <title>{title}</title>

        {/* Nevada — horizontal north border, vertical Utah border, the long
            California diagonal running down to the southern tip. */}
        <path
          d="M34 24 L150 24 L150 142 L178 180 L34 98 Z"
          fill="#fff"
          stroke="var(--color-stone)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Arizona — straight Utah, New Mexico and Mexico borders with the
            angled Colorado River corner to the south-west. */}
        <path
          d="M152 188 L262 188 L262 290 L186 290 L152 236 Z"
          fill="#fff"
          stroke="var(--color-stone)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <text
          x="86"
          y="68"
          textAnchor="middle"
          className="fill-[var(--color-slate)] font-sans"
          fontSize="9.5"
          letterSpacing="2.6"
        >
          NEVADA
        </text>
        <text
          x="212"
          y="212"
          textAnchor="middle"
          className="fill-[var(--color-slate)] font-sans"
          fontSize="9.5"
          letterSpacing="2.6"
        >
          ARIZONA
        </text>

        {PINS.map((pin) => {
          const project = projects.find((p) => p.slug === pin.slug);
          if (!project) return null;
          const end = pin.anchor === 'end';
          return (
            <g key={pin.slug}>
              <circle cx={pin.x} cy={pin.y} r="9" fill="var(--color-teal-900)" opacity="0.14" />
              <circle cx={pin.x} cy={pin.y} r="4" fill="var(--color-teal-900)" />
              <text
                x={end ? pin.x - 11 : pin.x + 11}
                y={pin.y + 3.5}
                textAnchor={end ? 'end' : 'start'}
                className="fill-[var(--color-ink)] font-sans"
                fontSize="10.5"
                fontWeight="600"
              >
                {project.name}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 text-[0.625rem] leading-snug text-[var(--color-slate)]">
        Schematic locator — approximate positions only, not to scale. See each project page for
        detailed location and claim maps.
      </figcaption>
    </figure>
  );
}
