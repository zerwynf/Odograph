import type { ReactNode } from 'react';

interface StatCardProps {
  kicker: string;
  value: string | number;
  meta: string;
  /** Only the overdue card carries the accent edge. */
  accentEdge?: boolean;
}

function StatCard({ kicker, value, meta, accentEdge }: StatCardProps) {
  return (
    <div
      className="card elev-sm"
      style={{
        padding: 'var(--space-3) var(--space-4)',
        gap: 'var(--space-1)',
        ...(accentEdge ? { borderLeft: '2px solid var(--color-accent)' } : null),
      }}
    >
      <div className="card-kicker">{kicker}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 22, fontFamily: 'var(--font-heading)' }}>{value}</span>
        <span className="text-muted" style={{ fontSize: 12 }}>
          {meta}
        </span>
      </div>
    </div>
  );
}

interface StatStripProps {
  overCount: number;
  overCost: string;
  dueCount: number;
  dueCost: string;
  dueWindowLabel: string;
  nextMile: string;
  nextIn: string;
}

export function StatStrip({
  overCount,
  overCost,
  dueCount,
  dueCost,
  dueWindowLabel,
  nextMile,
  nextIn,
}: StatStripProps): ReactNode {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))',
        gap: 'var(--space-3)',
      }}
    >
      <StatCard kicker="Overdue" value={overCount} meta={`services · ${overCost}`} accentEdge />
      <StatCard kicker={`Due within ${dueWindowLabel} mi`} value={dueCount} meta={`services · ${dueCost}`} />
      <StatCard kicker="Next milestone" value={nextMile} meta={`mi · ${nextIn}`} />
    </div>
  );
}
