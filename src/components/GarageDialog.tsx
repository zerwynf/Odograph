import { CarProfile, Plus, Trash } from '@phosphor-icons/react';
import { fmtMi } from '../lib/format';
import type { Vehicle } from '../types';
import { TextField } from './Fields';
import {
  EngineField,
  MakeField,
  ModelField,
  YearField,
  type VehicleFormProps,
} from './VehicleFormFields';

interface GarageDialogProps {
  vehicles: Vehicle[];
  activeId: string | null;
  form: VehicleFormProps;
  onPick: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  onClose: () => void;
  onResetAll: () => void;
}

export function GarageDialog({
  vehicles,
  activeId,
  form,
  onPick,
  onRemove,
  onAdd,
  onClose,
  onResetAll,
}: GarageDialogProps) {
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        style={{ width: 'min(520px, 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-title">Your garage</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {vehicles.map((v) => {
            const isActive = v.id === activeId;
            return (
              <div
                key={v.id}
                className="garage-row"
                role="button"
                tabIndex={0}
                onClick={() => onPick(v.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onPick(v.id);
                  }
                }}
                style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  alignItems: 'center',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  boxShadow: `inset 0 0 0 1px ${isActive ? 'var(--color-accent)' : 'var(--color-divider)'}`,
                }}
              >
                <CarProfile
                  size={22}
                  color={isActive ? 'var(--color-accent)' : 'var(--color-neutral-600)'}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15 }}>
                    {v.year} {v.make} {v.model}
                  </div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {v.engine} · {fmtMi(v.miles)} mi
                  </div>
                </div>
                <span className={`tag ${isActive ? 'tag-accent' : 'tag-neutral'}`}>
                  {isActive ? 'Active' : v.nickname || 'Saved'}
                </span>
                <button
                  className="btn btn-icon btn-secondary"
                  aria-label={`Remove ${v.year} ${v.make} ${v.model}`}
                  onClick={(e) => {
                    // Removing must not also select the row.
                    e.stopPropagation();
                    onRemove(v.id);
                  }}
                >
                  <Trash />
                </button>
              </div>
            );
          })}
        </div>

        <div className="hr" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
            gap: 'var(--space-3)',
          }}
        >
          <YearField {...form} />
          <MakeField {...form} />
          <ModelField {...form} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
            gap: 'var(--space-3)',
          }}
        >
          <EngineField {...form} />
          <TextField label="Odometer" value={form.form.miles} onChange={form.setMiles} numeric />
        </div>

        <div className="dialog-actions">
          <button className="btn btn-ghost" onClick={onResetAll}>
            Clear all data
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={onAdd}>
            <Plus />
            Add vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
