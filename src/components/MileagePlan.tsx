import { CaretDown, CaretRight, CheckCircle, Checks } from '@phosphor-icons/react';
import type { GroupVM } from '../lib/plan';
import { ServiceRow } from './ServiceRow';

interface MileageGroupProps {
  group: GroupVM;
  onToggleOpen: (mileage: number) => void;
  onToggleItem: (key: string) => void;
  onMarkGroup: (keys: string[]) => void;
}

function MileageGroup({ group, onToggleOpen, onToggleItem, onMarkGroup }: MileageGroupProps) {
  const Caret = group.open ? CaretDown : CaretRight;

  return (
    <div
      className="card"
      style={{ padding: 0, gap: 0, background: group.bg, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}
    >
      <div
        className="group-head"
        role="button"
        tabIndex={0}
        aria-expanded={group.open}
        onClick={() => onToggleOpen(group.mileage)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleOpen(group.mileage);
          }
        }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          alignItems: 'center',
          padding: 'var(--space-4) var(--space-6)',
          cursor: 'pointer',
          borderLeft: `2px solid ${group.mark}`,
        }}
      >
        <Caret style={{ opacity: 0.55 }} />
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 19,
            minWidth: 92,
            color: group.mileColor,
          }}
        >
          {group.mileLabel}
        </div>

        {group.isDone ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              color: 'var(--color-accent-300)',
            }}
          >
            <CheckCircle size={16} color="var(--color-accent)" />
            All done
          </span>
        ) : (
          <span className={`tag ${group.tagCls}`}>{group.statusLabel}</span>
        )}

        <span className="text-muted" style={{ fontSize: 13 }}>
          {group.summary}
        </span>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginLeft: 'auto' }}>
          <span className="text-muted" style={{ fontSize: 13 }}>
            {group.costLabel}
          </span>
          <button
            className="btn btn-secondary"
            onClick={(e) => {
              // Never let the bulk action collapse the group it belongs to.
              e.stopPropagation();
              onMarkGroup(group.remainingKeys);
            }}
          >
            <Checks />
            {group.markLabel}
          </button>
        </div>
      </div>

      {group.open && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: '0 var(--space-6) var(--space-4) 40px',
          }}
        >
          {group.items.map((it) => (
            <ServiceRow key={it.key} item={it} onToggle={onToggleItem} compact />
          ))}
        </div>
      )}
    </div>
  );
}

interface MileagePlanProps {
  groups: GroupVM[];
  horizonLabel: string;
  expandLabel: string;
  onToggleAll: () => void;
  onToggleOpen: (mileage: number) => void;
  onToggleItem: (key: string) => void;
  onMarkGroup: (keys: string[]) => void;
}

export function MileagePlan({
  groups,
  horizonLabel,
  expandLabel,
  onToggleAll,
  onToggleOpen,
  onToggleItem,
  onMarkGroup,
}: MileagePlanProps) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-3)',
        }}
      >
        <h4 style={{ margin: 0 }}>Mileage plan</h4>
        <span className="text-muted" style={{ fontSize: 12 }}>
          {groups.length} mileage points to {horizonLabel}
        </span>
        <button className="btn btn-ghost" style={{ marginLeft: 'auto' }} onClick={onToggleAll}>
          {expandLabel}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {groups.map((g) => (
          <MileageGroup
            key={g.mileage}
            group={g}
            onToggleOpen={onToggleOpen}
            onToggleItem={onToggleItem}
            onMarkGroup={onMarkGroup}
          />
        ))}
      </div>
    </>
  );
}
