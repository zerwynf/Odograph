import { Plus } from '@phosphor-icons/react';
import { useState } from 'react';
import { digitsOnly } from '../lib/format';
import type { CustomEntry, CustomForm } from '../types';
import { TextAreaField, TextField } from './Fields';

interface CustomEntryDialogProps {
  /** Prefilled with the current odometer. */
  initialMileage: string;
  onCancel: () => void;
  onAdd: (entry: Omit<CustomEntry, 'id'>) => void;
}

export function CustomEntryDialog({ initialMileage, onCancel, onAdd }: CustomEntryDialogProps) {
  const [form, setForm] = useState<CustomForm>({ name: '', mileage: initialMileage, cost: '', note: '' });
  const set = <K extends keyof CustomForm>(key: K, value: CustomForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    // Silent guard: an unnamed entry is not an entry.
    if (!form.name) return;
    onAdd({
      name: form.name,
      mileage: Number(form.mileage || 0),
      cost: Number(form.cost || 0),
      note: form.note,
    });
  };

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-title">Log a custom service</div>
        <div className="dialog-body">
          Anything you did that isn&rsquo;t on the factory schedule — a repair, an upgrade, an early fluid
          change.
        </div>

        <TextField
          label="What did you do?"
          value={form.name}
          onChange={(v) => set('name', v)}
          placeholder="Rear caliper rebuild"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))',
            gap: 'var(--space-3)',
          }}
        >
          <TextField
            label="At mileage"
            value={form.mileage}
            onChange={(v) => set('mileage', digitsOnly(v))}
            numeric
          />
          <TextField
            label="Cost"
            value={form.cost}
            onChange={(v) => set('cost', digitsOnly(v))}
            placeholder="180"
            numeric
          />
        </div>

        <TextAreaField
          label="Notes"
          value={form.note}
          onChange={(v) => set('note', v)}
          placeholder="Parts, fluids, who did the work"
        />

        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit}>
            <Plus />
            Add to log
          </button>
        </div>
      </div>
    </div>
  );
}
