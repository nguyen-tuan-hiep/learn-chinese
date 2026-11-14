import type { ElementType, ReactNode } from 'react'
import { Glass } from './Glass'

/**
 * A card as in the Apple Weather app: a small uppercase title with an icon, a hairline, then the content.
 * `action` sits at the right end of the header (a count, a link).
 */
export function Panel({ icon, title, action, children, className = '', as = 'section', ...rest }: {
  icon?: ReactNode; title: string; action?: ReactNode; children: ReactNode; className?: string; as?: ElementType
} & Record<string, unknown>) {
  return <Glass as={as} aria-label={title} className={`rounded-card! p-4 sm:p-5 ${className}`} {...rest}>
    <div className="flex items-center gap-1.5 border-b border-separator pb-2.5 text-subhead font-bold text-label">
      {icon && <span aria-hidden="true" className="inline-flex [&>svg]:size-3.5">{icon}</span>}
      <h2 className="min-w-0 flex-1 truncate">{title}</h2>
      {action && <span className="shrink-0 normal-case tracking-normal">{action}</span>}
    </div>
    <div className="pt-3.5">{children}</div>
  </Glass>
}
