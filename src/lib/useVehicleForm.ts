import { useCallback, useMemo, useState } from 'react';
import { YEARS, enginesFor, makesFor, modelsFor } from '../data/catalog';
import type { VehicleForm } from '../types';
import { digitsOnly } from './format';

export function blankForm(): VehicleForm {
  return { year: 2020, make: 'Honda', model: 'Accord', engine: '1.5L Turbo (gas)', miles: '', nickname: '' };
}

/** Keeps `current` if it is still offered, otherwise falls back to the first option. */
function keepOrFirst(current: string, options: string[]): string {
  return options.includes(current) ? current : (options[0] ?? '');
}

/**
 * Applies one field change and repairs everything below it in the
 * year → make → model → engine chain, so the form never holds a combination
 * the catalog doesn't offer.
 *
 * - Year: keeps make, model and engine where that year still offers them
 *   (a 2018 Focus moved to 2020 becomes that year's first Ford, not a blank).
 * - Make: resets Model to that make's first model and Engine to its first engine.
 * - Model: resets Engine to that model's first engine.
 */
export function applyFormChange<K extends keyof VehicleForm>(
  prev: VehicleForm,
  key: K,
  value: VehicleForm[K],
): VehicleForm {
  const next = { ...prev, [key]: value };

  if (key === 'year') {
    next.make = keepOrFirst(next.make, makesFor(next.year));
    next.model = keepOrFirst(next.model, modelsFor(next.make, next.year));
    next.engine = keepOrFirst(next.engine, enginesFor(next.make, next.model, next.year));
  }
  if (key === 'make') {
    next.model = modelsFor(next.make, next.year)[0] ?? '';
    next.engine = enginesFor(next.make, next.model, next.year)[0] ?? '';
  }
  if (key === 'model') {
    next.engine = enginesFor(next.make, next.model, next.year)[0] ?? '';
  }
  return next;
}

/** The shared create-a-vehicle form. Mileage strips everything but digits. */
export function useVehicleForm() {
  const [form, setForm] = useState<VehicleForm>(blankForm);

  const setField = useCallback(<K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) => {
    setForm((prev) => applyFormChange(prev, key, value));
  }, []);

  const setMiles = useCallback((raw: string) => setField('miles', digitsOnly(raw)), [setField]);
  const reset = useCallback(() => setForm(blankForm()), []);

  const makes = useMemo(() => makesFor(form.year), [form.year]);
  const models = useMemo(() => modelsFor(form.make, form.year), [form.make, form.year]);
  const engines = useMemo(
    () => enginesFor(form.make, form.model, form.year),
    [form.make, form.model, form.year],
  );

  return { form, setField, setMiles, reset, years: YEARS, makes, models, engines };
}
