import type { VehicleForm } from '../types';
import { SelectField, TextField } from './Fields';

export interface VehicleFormProps {
  form: VehicleForm;
  setField: <K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) => void;
  setMiles: (raw: string) => void;
  years: readonly number[];
  makes: readonly string[];
  models: readonly string[];
  engines: readonly string[];
}

export function YearField({ form, setField, years }: VehicleFormProps) {
  return (
    <SelectField label="Year" value={form.year} options={years} onChange={(v) => setField('year', Number(v))} />
  );
}

export function MakeField({ form, setField, makes }: VehicleFormProps) {
  return <SelectField label="Make" value={form.make} options={makes} onChange={(v) => setField('make', v)} />;
}

export function ModelField({ form, setField, models }: VehicleFormProps) {
  return <SelectField label="Model" value={form.model} options={models} onChange={(v) => setField('model', v)} />;
}

export function EngineField({ form, setField, engines }: VehicleFormProps) {
  return <SelectField label="Engine" value={form.engine} options={engines} onChange={(v) => setField('engine', v)} />;
}

export function OdometerField({ form, setMiles, label }: VehicleFormProps & { label: string }) {
  return <TextField label={label} value={form.miles} onChange={setMiles} placeholder="80,000" numeric />;
}

export function NicknameField({ form, setField }: VehicleFormProps) {
  return (
    <TextField
      label="Nickname (optional)"
      value={form.nickname}
      onChange={(v) => setField('nickname', v)}
      placeholder="Daily driver"
    />
  );
}
