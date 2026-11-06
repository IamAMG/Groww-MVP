export function ProgressBar({ className = '', value, label }: { className?: string; value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="w-full">
      <div className={`w-full bg-[#e2e8f0] rounded-full h-3 ${className}`}>
        <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      {label && (
        <div className="mt-1 text-xs text-muted flex justify-between">
          {label} <span>{pct}%</span>
        </div>
      )}
    </div>
  )
}
