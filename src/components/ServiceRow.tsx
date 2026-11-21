import type { CSSProperties } from 'react';
import type { ItemVM } from '../lib/plan';

interface ServiceRowProps {
  item: ItemVM;
  onToggle: (key: string) => void;
  /** The attention card shows the mileage tag; inside a group it is redundant. */
  showMileage?: boolean;
  compact?: boolean;
}

/**
 * One service, checkable. Used both in the attention card and inside mileage
 * groups; the group variant is tighter and drops the mileage tag.
 */
export function ServiceRow({ item, onToggle, showMileage = false, compact = false }: ServiceRowProps) {
  const rowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: 'var(--space-4)',
    alignItems: 'start',
    padding: compact ? 'var(--space-2) var(--space-3)' : 'var(--space-3)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    ['--row-bg' as string]: item.rowBg,
  };
  const box = compact ? 17 : 18;

  return (
    <label className="svc-row" style={rowStyle}>
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggle(item.key)}
        style={{ width: box, height: box, marginTop: 3, cursor: 'pointer' }}
      />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: compact ? '2px var(--space-4)' : '4px var(--space-4)',
          alignItems: 'baseline',
          ...(compact ? { opacity: item.opacity } : null),
        }}
      >
        <div style={{ flex: '1 1 240px' }}>
          <div
            style={{
              fontSize: compact ? 14.5 : 15,
              fontFamily: 'var(--font-heading)',
              textDecoration: compact ? item.deco : undefined,
            }}
          >
            {item.name}
          </div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            {item.note}
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span className={`tag ${item.tagCls}`}>{item.statusLabel}</span>
          {showMileage && <span className="tag tag-neutral">{item.mileLabel}</span>}
          <span className="text-muted" style={{ fontSize: 12 }}>
            {item.costLabel} · {item.diy}
          </span>
        </div>
      </div>
    </label>
  );
}
