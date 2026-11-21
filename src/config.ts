/** Tunable schedule parameters. */
export const DEFAULT_DUE_WINDOW = 3000; // mi — range 500–10000, step 500
export const DEFAULT_HORIZON = 200000; // mi — 100000 / 150000 / 200000 / 250000

/**
 * Bumped from v1 when first visits stopped seeding the demo garage: v1 data in
 * the wild is almost all that auto-seeded demo, so it is discarded on load and
 * every visitor starts at the vehicle picker.
 */
export const STORAGE_KEY = 'odograph.v2';
export const RETIRED_STORAGE_KEYS = ['odograph.v1'];
