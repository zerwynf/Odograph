import { CarProfile, CaretDown, CheckCircle, Gauge, Plus } from '@phosphor-icons/react';

interface TopNavProps {
  vehicleLabel: string;
  saveLabel: string;
  onOpenGarage: () => void;
  onOpenCustom: () => void;
  onSave: () => void;
}

export function TopNav({ vehicleLabel, saveLabel, onOpenGarage, onOpenCustom, onSave }: TopNavProps) {
  return (
    <div
      className="nav"
      style={{
        maxWidth: 1180,
        margin: '0 auto',
        padding: 'var(--space-4) clamp(16px,4vw,32px)',
        flexWrap: 'wrap',
        rowGap: 'var(--space-3)',
      }}
    >
      <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
        <Gauge color="var(--color-accent)" />
        Odograph
      </div>
      <button className="btn btn-secondary" onClick={onOpenGarage}>
        <CarProfile />
        {vehicleLabel}
        <CaretDown style={{ opacity: 0.6 }} />
      </button>
      <button className="btn btn-secondary" onClick={onOpenCustom}>
        <Plus />
        Log a service
      </button>
      <button className="btn btn-primary" onClick={onSave}>
        <CheckCircle />
        {saveLabel}
      </button>
    </div>
  );
}
