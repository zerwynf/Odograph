import type { TimelineNode } from '../lib/plan';

interface TimelineViewProps {
  nodes: TimelineNode[];
  milesLabel: string;
  onToggleItem: (key: string) => void;
}

/** The odometer track: one node per mileage point, with "you are here" injected. */
export function TimelineView({ nodes, milesLabel, onToggleItem }: TimelineViewProps) {
  return (
    <div style={{ padding: 'var(--space-4) 0' }}>
      {nodes.map((n) => (
        <div
          key={n.kind === 'now' ? 'now' : n.mileage}
          style={{
            display: 'grid',
            gridTemplateColumns: '96px 1fr',
            gap: 'var(--space-6)',
            alignItems: 'start',
          }}
        >
          <div
            style={{
              textAlign: 'right',
              fontFamily: 'var(--font-heading)',
              fontSize: 15,
              paddingTop: 10,
              color: n.kind === 'now' ? 'var(--color-accent)' : n.labelColor,
            }}
          >
            {n.kind === 'now' ? '' : n.mileLabel}
          </div>

          <div
            style={{
              borderLeft: '1px solid var(--color-divider)',
              padding: '0 0 var(--space-6) var(--space-6)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -5,
                top: 14,
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: n.kind === 'now' ? 'var(--color-accent)' : n.dotColor,
                boxShadow: '0 0 0 3px var(--color-bg)',
              }}
            />

            {n.kind === 'now' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 'var(--space-2) 0 var(--space-4)',
                }}
              >
                <span className="tag tag-outline">You are here — {milesLabel} mi</span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: 'linear-gradient(to right,var(--color-accent),transparent)',
                  }}
                />
              </div>
            ) : (
              <div style={{ padding: 'var(--space-2) 0' }}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <span className={`tag ${n.tagCls}`}>{n.statusLabel}</span>
                  <span className="text-muted" style={{ fontSize: 12 }}>
                    {n.costLabel}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {n.items.map((it) => (
                    <button
                      key={it.key}
                      className="tag tag-neutral tag-btn"
                      onClick={() => onToggleItem(it.key)}
                      aria-pressed={it.done}
                      style={{ opacity: it.opacity, textDecoration: it.deco }}
                    >
                      {it.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
