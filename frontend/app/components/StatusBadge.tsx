'use client'

/**
 * Reusable status badge following the project's color legend:
 *   active / approved / accepted / completed / paid / released → green
 *   pending / held / open / assigned / submitted               → yellow
 *   rejected / suspended / removed / failed / rejected          → red
 *   default                                                     → gray
 */
export default function StatusBadge({ status }: { status: string | undefined | null }) {
  if (!status) return null
  const s = String(status).toLowerCase()

  const positive = ['active', 'approved', 'accepted', 'completed', 'paid', 'released']
  const neutral = ['pending', 'held', 'open', 'assigned', 'submitted', 'in_progress', 'in progress']
  const negative = ['rejected', 'suspended', 'removed', 'failed', 'revision_requested', 'revision requested']

  const cls = positive.includes(s)
    ? 'bg-green-100 text-green-800'
    : neutral.includes(s)
      ? 'bg-yellow-100 text-yellow-800'
      : negative.includes(s)
        ? 'bg-white text-brand-red border-brand-red'
        : 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-brand-black ${cls}`}>
      {s.replace(/_/g, ' ')}
    </span>
  )
}
