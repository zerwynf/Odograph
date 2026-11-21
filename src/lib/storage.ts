import { STORAGE_KEY } from '../config';
import type { Vehicle } from '../types';

export interface Persisted {
  vehicles: Vehicle[];
  activeId: string | null;
}

/**
 * Local persistence. In production this becomes a user-scoped API — keep the
 * same shape so the store above it does not change.
 */
export function load(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Persisted | null;
    if (!parsed || !Array.isArray(parsed.vehicles)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function save(state: Persisted): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode, quota) — the app keeps working in memory */
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
}
