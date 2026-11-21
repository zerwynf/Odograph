import { useCallback, useEffect, useState } from 'react';
import { seedVehicles } from '../data/seed';
import type { CustomEntry, Vehicle } from '../types';
import * as storage from './storage';

interface GarageState {
  /** null = not yet hydrated; [] = empty state. */
  vehicles: Vehicle[] | null;
  activeId: string | null;
}

/**
 * The vehicle store. Every mutation persists immediately; the Save button in
 * the header is reassurance, not the mechanism.
 */
export function useGarage() {
  const [state, setState] = useState<GarageState>({ vehicles: null, activeId: null });

  // A first visit starts empty, at the vehicle picker. The demo garage is
  // opt-in via "Load the demo" on that screen.
  useEffect(() => {
    const saved = storage.load();
    const vehicles = saved?.vehicles ?? [];
    setState({ vehicles, activeId: saved?.activeId ?? vehicles[0]?.id ?? null });
  }, []);

  const persist = useCallback((vehicles: Vehicle[], activeId?: string | null) => {
    setState((prev) => {
      const next = { vehicles, activeId: activeId === undefined ? prev.activeId : activeId };
      storage.save(next as storage.Persisted);
      return next;
    });
  }, []);

  const active = state.vehicles?.find((v) => v.id === state.activeId) ?? null;

  const updateActive = useCallback(
    (fn: (v: Vehicle) => Vehicle) => {
      setState((prev) => {
        if (!prev.vehicles) return prev;
        const vehicles = prev.vehicles.map((v) => (v.id === prev.activeId ? fn({ ...v }) : v));
        const next = { ...prev, vehicles };
        storage.save(next as storage.Persisted);
        return next;
      });
    },
    [],
  );

  const setMiles = useCallback(
    (miles: number) => updateActive((v) => ({ ...v, miles })),
    [updateActive],
  );

  /** Toggling records the odometer at which the work was actually done. */
  const toggleItem = useCallback(
    (key: string) =>
      updateActive((v) => {
        const done = { ...v.done };
        if (done[key]) delete done[key];
        else done[key] = { at: v.miles };
        return { ...v, done };
      }),
    [updateActive],
  );

  /** Bulk marking skips already-complete items rather than re-stamping them. */
  const markKeys = useCallback(
    (keys: string[]) =>
      updateActive((v) => {
        const done = { ...v.done };
        for (const k of keys) if (!done[k]) done[k] = { at: v.miles };
        return { ...v, done };
      }),
    [updateActive],
  );

  const addCustom = useCallback(
    (entry: Omit<CustomEntry, 'id'>) =>
      updateActive((v) => ({
        ...v,
        custom: [...(v.custom ?? []), { ...entry, id: `c${Date.now()}` }],
      })),
    [updateActive],
  );

  const removeCustom = useCallback(
    (id: string) => updateActive((v) => ({ ...v, custom: (v.custom ?? []).filter((c) => c.id !== id) })),
    [updateActive],
  );

  const addVehicle = useCallback(
    (v: Omit<Vehicle, 'id' | 'done' | 'custom'>) => {
      const id = `v${Date.now()}`;
      persist([...(state.vehicles ?? []), { ...v, id, done: {}, custom: [] }], id);
      return id;
    },
    [persist, state.vehicles],
  );

  const selectVehicle = useCallback(
    (id: string) => persist(state.vehicles ?? [], id),
    [persist, state.vehicles],
  );

  /** Deleting the active vehicle falls back to the first remaining one. */
  const removeVehicle = useCallback(
    (id: string) => {
      const rest = (state.vehicles ?? []).filter((v) => v.id !== id);
      persist(rest, state.activeId === id ? (rest[0]?.id ?? null) : state.activeId);
    },
    [persist, state.vehicles, state.activeId],
  );

  const resetAll = useCallback(() => {
    storage.clear();
    setState({ vehicles: [], activeId: null });
  }, []);

  const loadDemo = useCallback(() => persist(seedVehicles(), 'v2'), [persist]);

  /** Re-persist the current state — what the Save button does. */
  const saveNow = useCallback(() => {
    if (state.vehicles) storage.save({ vehicles: state.vehicles, activeId: state.activeId });
  }, [state.vehicles, state.activeId]);

  return {
    vehicles: state.vehicles,
    activeId: state.activeId,
    active,
    setMiles,
    toggleItem,
    markKeys,
    addCustom,
    removeCustom,
    addVehicle,
    selectVehicle,
    removeVehicle,
    resetAll,
    loadDemo,
    saveNow,
  };
}
