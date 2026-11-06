export function Disclaimer({ variant }: { variant?: 'default' | 'evidence' }) {
  const text =
    variant === 'evidence'
      ? 'Evidence records are real research observations only. No fake testimonials or fabricated interviews are stored.'
      : 'SIP Compass is an educational tool. It does not provide investment advice or recommend specific securities or mutual funds. All simulations and projections are hypothetical, market returns are uncertain, and actual outcomes may differ. Consult a SEBI-registered investment adviser for personalised financial advice.'

  return (
    <div className="mt-3 p-3 rounded-lg bg-[#fef3c7] border border-[#f59e0b]/30 text-xs text-[#92400e] leading-relaxed">
      {text}
    </div>
  )
}
