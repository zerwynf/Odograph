import { Checks, WarningCircle } from '@phosphor-icons/react';
import type { ItemVM } from '../lib/plan';
import { ServiceRow } from './ServiceRow';

interface AttentionCardProps {
  items: ItemVM[];
  overCount: number;
  dueCount: number;
  onToggle: (key: string) => void;
  onMarkAll: () => void;
}

/** Everything overdue plus everything inside the due window, in one place. */
export function AttentionCard({ items, overCount, dueCount, onToggle, onMarkAll }: AttentionCardProps) {
  return (
    <div
      className="card elev-md"
      style={{ padding: 'var(--space-6)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
        <h4 style={{ margin: 0, display: 'inline-flex', alignItems: 'center' }}>
          <WarningCircle color="var(--color-accent)" style={{ marginRight: 6 }} />
          Needs attention now
        </h4>
        <span className="text-muted" style={{ fontSize: 13 }}>
          {overCount} overdue, {dueCount} coming up
        </span>
        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={onMarkAll}>
          <Checks />
          Mark all complete
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it) => (
          <ServiceRow key={it.key} item={it} onToggle={onToggle} showMileage />
        ))}
      </div>
    </div>
  );
}
