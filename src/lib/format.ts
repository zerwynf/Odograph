/** Mileage with thousands separators: 80000 → "80,000". */
export function fmtMi(n: number): string {
  return Number(n || 0).toLocaleString('en-US');
}

/** A cost range: [45, 95] → "$45–95", [0, 0] → "No cost". */
export function fmtCost(lo: number, hi: number): string {
  if (!lo && !hi) return 'No cost';
  if (lo === hi) return `$${lo.toLocaleString('en-US')}`;
  return `$${lo.toLocaleString('en-US')}–${hi.toLocaleString('en-US')}`;
}

/** A horizon as a short label: 200000 → "200k". */
export function fmtHorizon(n: number): string {
  return `${Math.round(n / 1000)}k`;
}

/** Strips everything but digits — used by every mileage/cost input. */
export function digitsOnly(s: string): string {
  return s.replace(/[^0-9]/g, '');
}
