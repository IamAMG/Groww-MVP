export function Badge({ className = '', variant = 'slate', children }: { className?: string; variant?: 'teal' | 'slate'; children: React.ReactNode }) {
  const base = variant === 'teal' ? 'badge-teal' : 'badge-slate'
  return <span className={`${base} ${className}`}>{children}</span>
}
