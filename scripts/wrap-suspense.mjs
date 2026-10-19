/**
 * One-off codemod: wraps the remaining dynamic-param pages in a Suspense
 * boundary, which `cacheComponents` requires before `params` is awaited.
 */
import fs from 'node:fs';

const TARGETS = [
  {
    file: 'src/app/corporate/management/[slug]/page.tsx',
    fn: 'ManagementProfilePage',
    content: 'ManagementProfileContent',
    label: 'Loading profile',
    variant: 'profile',
  },
  {
    file: 'src/app/corporate/directors/[slug]/page.tsx',
    fn: 'DirectorProfilePage',
    content: 'DirectorProfileContent',
    label: 'Loading profile',
    variant: 'profile',
  },
  {
    file: 'src/app/projects/usa-projects/[slug]/page.tsx',
    fn: 'ProjectPage',
    content: 'ProjectPageContent',
    label: 'Loading project',
    variant: 'project',
  },
];

const SKELETONS = {
  profile: `
function ProfileSkeleton() {
  return (
    <div className="bg-[var(--color-warm)] py-20" role="status" aria-label="Loading profile">
      <div className="shell-narrow animate-pulse space-y-4 lg:max-w-4xl">
        <div className="h-3 w-48 rounded bg-[var(--color-stone)]" />
        <div className="h-12 w-2/3 rounded bg-[var(--color-stone)]" />
        <div className="mt-8 h-4 w-full rounded bg-[var(--color-stone)]" />
        <div className="h-4 w-11/12 rounded bg-[var(--color-stone)]" />
      </div>
    </div>
  );
}
`,
  project: `
function ProjectSkeleton() {
  return (
    <div className="bg-[var(--color-navy)] py-24" role="status" aria-label="Loading project">
      <div className="shell animate-pulse space-y-4">
        <div className="h-3 w-56 rounded bg-white/15" />
        <div className="h-14 w-2/3 rounded bg-white/15" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
      </div>
    </div>
  );
}
`,
};

for (const t of TARGETS) {
  let src = fs.readFileSync(t.file, 'utf8');

  if (src.includes(t.content)) {
    console.log('skip (already wrapped):', t.file);
    continue;
  }

  // Ensure the Suspense import exists.
  if (!/import \{[^}]*Suspense[^}]*\} from 'react'/.test(src)) {
    src = src.replace(/^(import .*?;\n)/, `$1import { Suspense } from 'react';\n`);
  }

  const skeletonName = t.variant === 'profile' ? 'ProfileSkeleton' : 'ProjectSkeleton';

  src = src.replace(
    new RegExp(`export default async function ${t.fn}\\(\\{ params \\}: Params\\) \\{`),
    `/**
 * With \`cacheComponents\` enabled, reading \`params\` must happen inside a
 * Suspense boundary so the static shell can stream ahead of the URL data.
 */
export default function ${t.fn}({ params }: Params) {
  return (
    <Suspense fallback={<${skeletonName} />}>
      <${t.content} params={params} />
    </Suspense>
  );
}
${SKELETONS[t.variant]}
async function ${t.content}({ params }: Params) {`
  );

  fs.writeFileSync(t.file, src);
  console.log('wrapped:', t.file);
}
