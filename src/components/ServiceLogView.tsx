import type { LogRow } from '../lib/plan';

interface ServiceLogViewProps {
  rows: LogRow[];
  onUndo: (key: string) => void;
  onRemoveCustom: (id: string) => void;
}

/** Everything actually done — scheduled work by the mileage it was done at, plus custom entries. */
export function ServiceLogView({ rows, onUndo, onRemoveCustom }: ServiceLogViewProps) {
  return (
    <div className="card elev-sm" style={{ padding: 'var(--space-4) 0', overflowX: 'auto' }}>
      <table className="table" style={{ minWidth: 620 }}>
        <thead>
          <tr>
            <th>Mileage</th>
            <th>Service</th>
            <th>Source</th>
            <th>Cost est.</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap' }}>{r.mileLabel}</td>
              <td>
                {r.name}
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {r.note}
                </div>
              </td>
              <td>
                <span className={`tag ${r.srcCls}`}>{r.src}</span>
              </td>
              <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>
                {r.costLabel}
              </td>
              <td style={{ textAlign: 'right' }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => (r.kind === 'scheduled' ? onUndo(r.key) : onRemoveCustom(r.customId))}
                >
                  {r.actionLabel}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
