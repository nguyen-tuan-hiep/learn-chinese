import type { ComponentPropsWithoutRef, ElementType } from 'react'

const materials = { ultrathin: 'glass-ultrathin', thin: 'glass-thin', regular: 'glass', thick: 'glass-thick' } as const

export type GlassMaterial = keyof typeof materials

type GlassProps<T extends ElementType> = { material?: GlassMaterial; as?: T; className?: string } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>

/** Frosted panel with the HIG material of your choice and large continuous corners. */
export function Glass<T extends ElementType = 'div'>({ material = 'regular', as, className = '', ...rest }: GlassProps<T>) {
  const Tag: ElementType = as ?? 'div'
  return <Tag {...rest} className={`${materials[material]} rounded-panel ${className}`} />
}
