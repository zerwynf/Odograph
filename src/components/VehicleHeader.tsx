import { digitsOnly, fmtHorizon } from '../lib/format';
import type { Vehicle } from '../types';
import { TextField } from './Fields';

interface VehicleHeaderProps {
  vehicle: Vehicle;
  horizon: number;
  onMilesChange: (miles: number) => void;
}

/** Identity, the live odometer, and progress against the plan horizon. */
export function VehicleHeader({ vehicle, horizon, onMilesChange }: VehicleHeaderProps) {
  const pct = Math.min(100, Math.round((vehicle.miles / horizon) * 100));
  const sub = vehicle.engine + (vehicle.nickname ? ` · ${vehicle.nickname}` : '');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: 'var(--space-6) var(--space-8)',
        margin: 'var(--space-4) 0 var(--space-8)',
      }}
    >
      <div style={{ minWidth: 260 }}>
        <div className="text-muted" style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
          {sub}
        </div>
        <h1 style={{ fontSize: 'clamp(26px,4.4vw,40px)', margin: '6px 0 0' }}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>
      </div>

      <TextField
        label="Odometer (mi)"
        value={String(vehicle.miles)}
        onChange={(raw) => onMilesChange(Number(digitsOnly(raw) || 0))}
        numeric
        style={{ width: 180 }}
        inputStyle={{ fontSize: 18, minHeight: 42 }}
      />

      <div style={{ flex: '1 1 220px', minWidth: 200 }}>
        <div className="text-muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span>0</span>
          <span>
            {pct}% of the {fmtHorizon(horizon)} plan
          </span>
          <span>{fmtHorizon(horizon)}</span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 99,
            background: 'var(--color-neutral-900)',
            marginTop: 6,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg,var(--color-accent-700),var(--color-accent))',
              width: `${pct}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
