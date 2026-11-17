/** Black pill marking the one thing being studied now ("Up next"), as in the reference design. */
export function NowBadge({ className = '', children = 'Up next' }: { className?: string; children?: string }) {
  return <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full ink-pill px-3 py-1 text-caption font-bold ${className}`}>{children}</span>
}
