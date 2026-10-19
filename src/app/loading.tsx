/** Route-level skeleton: keeps layout stable while a page streams in. */
export default function Loading() {
  return (
    <div className="bg-[var(--color-warm)] py-24 lg:py-32" role="status" aria-label="Loading">
      <div className="shell animate-pulse">
        <div className="h-3 w-28 rounded bg-[var(--color-stone)]" />
        <div className="mt-6 h-12 w-3/4 rounded bg-[var(--color-stone)] lg:w-1/2" />
        <div className="mt-4 h-4 w-full max-w-xl rounded bg-[var(--color-stone)]" />
        <div className="mt-2.5 h-4 w-5/6 max-w-lg rounded bg-[var(--color-stone)]" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-56 rounded-[3px] bg-[var(--color-stone)]" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading page content…</span>
    </div>
  );
}
