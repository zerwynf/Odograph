import { useCallback, useMemo, useState } from 'react';
import { MAKES, YEARS, enginesFor, modelsFor } from '../data/catalog';
import type { VehicleForm } from '../types';
import { digitsOnly } from './format';

export function blankForm(): VehicleForm {
  return { year: 2020, make: 'Honda', model: 'Accord', engine: '1.5L Turbo (gas)', miles: '', nickname: '' };
}

/**
 * The shared create-a-vehicle form. Changing Make resets Model to that make's
 * first model and Engine to that model's first engine; changing Model resets
 * Engine. Mileage strips everything but digits.
 */
export function useVehicleForm() {
  const [form, setForm] = useState<VehicleForm>(blankForm);

  const setField = useCallback(<K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'make') {
        next.model = modelsFor(next.make)[0] ?? '';
        next.engine = enginesFor(next.make, next.model)[0] ?? 'Gas';
      }
      if (key === 'model') {
        next.engine = enginesFor(next.make, next.model)[0] ?? 'Gas';
      }
      return next;
    });
  }, []);

  const setMiles = useCallback((raw: string) => setField('miles', digitsOnly(raw)), [setField]);
  const reset = useCallback(() => setForm(blankForm()), []);

  const models = useMemo(() => modelsFor(form.make), [form.make]);
  const engines = useMemo(() => enginesFor(form.make, form.model), [form.make, form.model]);

  return { form, setField, setMiles, reset, years: YEARS, makes: MAKES, models, engines };
}
