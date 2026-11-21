/** Shared domain types for the service tracker. */

export type Diy = 'Easy' | 'Medium' | 'Hard';

/** A factory-schedule definition: one service and how often it recurs. */
export interface ServiceDef {
  id: string;
  name: string;
  /** Interval in miles. */
  every: number;
  /** First occurrence, when it differs from the interval (coolant: first 100k, then every 50k). */
  first?: number;
  cost: [number, number];
  diy: Diy;
  note?: string;
}

/** One concrete instance of a service at a scheduled mileage. */
export interface Occurrence {
  /** `${defId}@${mileage}` — the key used in `Vehicle.done`. */
  key: string;
  defId: string;
  name: string;
  mileage: number;
  cost: [number, number];
  diy: Diy;
  note?: string;
}

export type Status = 'done' | 'over' | 'due' | 'up';

/** Records the odometer reading at which an occurrence was actually marked done. */
export interface DoneRecord {
  at: number;
}

export interface CustomEntry {
  id: string;
  name: string;
  mileage: number;
  cost: number;
  note: string;
}

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  engine: string;
  nickname: string;
  miles: number;
  done: Record<string, DoneRecord>;
  custom: CustomEntry[];
}

export type ViewId = 'dash' | 'timeline' | 'log';
export type FilterId = 'all' | 'over' | 'due' | 'up' | 'done';
export type DialogId = 'custom' | 'garage';

/** The shared create-a-vehicle form, used by the empty state and the garage dialog. */
export interface VehicleForm {
  year: number;
  make: string;
  model: string;
  engine: string;
  miles: string;
  nickname: string;
}

export interface CustomForm {
  name: string;
  mileage: string;
  cost: string;
  note: string;
}
