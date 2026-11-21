import { describe, expect, it } from 'vitest';
import { applyFormChange, blankForm } from '../lib/useVehicleForm';
import { CATALOG, FIRST_YEAR, LAST_YEAR, YEARS, enginesFor, makesFor, modelsFor } from './catalog';
import { SCHEDULES } from './schedules';
import { accordFixture } from '../lib/__fixtures__/accord';
import { seedVehicles } from './seed';

describe('catalog coverage', () => {
  it('covers the past ten model years, newest first', () => {
    expect(YEARS).toHaveLength(10);
    expect(YEARS[0]).toBe(LAST_YEAR);
    expect(YEARS.at(-1)).toBe(FIRST_YEAR);
  });

  it('includes the five best-selling brands', () => {
    for (const make of ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Hyundai']) {
      expect(Object.keys(CATALOG)).toContain(make);
    }
  });

  it.each([
    ['Honda', 'Civic'],
    ['Honda', 'CR-V'],
    ['Honda', 'Accord'],
    ['Toyota', 'Camry'],
    ['Toyota', 'Corolla'],
    ['Toyota', 'RAV4'],
    ['Ford', 'Focus'],
    ['Honda', 'Pilot'],
    ['Toyota', 'Sienna'],
    ['Honda', 'Odyssey'],
    ['Hyundai', 'Sonata'],
    ['Hyundai', 'Elantra'],
  ])('includes the %s %s', (make, model) => {
    expect(CATALOG[make]?.[model]).toBeDefined();
  });

  it('gives each of the five top brands at least five models', () => {
    for (const make of ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Hyundai']) {
      expect(Object.keys(CATALOG[make]).length).toBeGreaterThanOrEqual(5);
    }
  });

  it('keeps every generation inside the covered years, in order, without gaps or overlaps', () => {
    for (const [make, models] of Object.entries(CATALOG)) {
      for (const [model, gens] of Object.entries(models)) {
        for (const g of gens) {
          expect(g.from, `${make} ${model}`).toBeGreaterThanOrEqual(FIRST_YEAR);
          expect(g.to, `${make} ${model}`).toBeLessThanOrEqual(LAST_YEAR);
          expect(g.from, `${make} ${model}`).toBeLessThanOrEqual(g.to);
          expect(g.engines.length, `${make} ${model} ${g.from}`).toBeGreaterThan(0);
        }
        for (let i = 1; i < gens.length; i++) {
          // Overlaps would make the engine list ambiguous for that year.
          expect(gens[i].from, `${make} ${model}`).toBeGreaterThan(gens[i - 1].to);
        }
      }
    }
  });

  it('offers every make in every covered year', () => {
    for (const y of YEARS) expect(makesFor(y)).toHaveLength(Object.keys(CATALOG).length);
  });
});

describe('year-aware lookups', () => {
  it('drops the Focus after 2018', () => {
    expect(modelsFor('Ford', 2018)).toContain('Focus');
    expect(modelsFor('Ford', 2019)).not.toContain('Focus');
  });

  it('skips the missing 2023 Trax', () => {
    expect(modelsFor('Chevrolet', 2022)).toContain('Trax');
    expect(modelsFor('Chevrolet', 2023)).not.toContain('Trax');
    expect(modelsFor('Chevrolet', 2024)).toContain('Trax');
  });

  it('changes engines across generations', () => {
    expect(enginesFor('Honda', 'Accord', 2017)).toContain('2.4L (gas)');
    expect(enginesFor('Honda', 'Accord', 2018)).toContain('1.5L Turbo (gas)');
    expect(enginesFor('Toyota', 'Sienna', 2020)).toEqual(['3.5L V6 (gas)']);
    expect(enginesFor('Toyota', 'Sienna', 2021)).toEqual(['2.5L Hybrid']);
  });

  it('returns nothing for a model outside its years', () => {
    expect(enginesFor('Ford', 'Focus', 2024)).toEqual([]);
    expect(enginesFor('Nope', 'Nope', 2024)).toEqual([]);
  });
});

describe('the catalog and the rest of the app agree', () => {
  it('offers the demo vehicles exactly as seeded', () => {
    for (const v of [...seedVehicles(), accordFixture()]) {
      expect(enginesFor(v.make, v.model, v.year), `${v.year} ${v.make} ${v.model}`).toContain(v.engine);
    }
  });

  it('can reach every detailed schedule from the picker', () => {
    for (const key of Object.keys(SCHEDULES).filter((k) => k !== 'generic')) {
      const [make, model, engine] = key.split('|');
      const reachable = YEARS.some((y) => enginesFor(make, model, y).includes(engine));
      expect(reachable, key).toBe(true);
    }
  });

  it('starts the form on a valid combination', () => {
    const f = blankForm();
    expect(enginesFor(f.make, f.model, f.year)).toContain(f.engine);
  });
});

describe('form cascade', () => {
  it('keeps make, model and engine when the new year still offers them', () => {
    const f = applyFormChange(blankForm(), 'year', 2021);
    expect([f.make, f.model, f.engine]).toEqual(['Honda', 'Accord', '1.5L Turbo (gas)']);
  });

  it('repairs only what the new year no longer offers', () => {
    // 2018 Accord 2.0L Turbo → 2023: the Accord stays, that engine is gone.
    let f = applyFormChange(blankForm(), 'year', 2018);
    f = applyFormChange(f, 'engine', '2.0L Turbo (gas)');
    f = applyFormChange(f, 'year', 2023);
    expect(f.model).toBe('Accord');
    expect(f.engine).toBe('1.5L Turbo (gas)');
  });

  it('moves off a model that has left the lineup', () => {
    let f = applyFormChange(blankForm(), 'year', 2018);
    f = applyFormChange(f, 'make', 'Ford');
    f = applyFormChange(f, 'model', 'Focus');
    f = applyFormChange(f, 'year', 2022);
    expect(f.make).toBe('Ford');
    expect(modelsFor('Ford', 2022)).toContain(f.model);
    expect(enginesFor('Ford', f.model, 2022)).toContain(f.engine);
  });

  it('resets model and engine on a make change, and engine on a model change', () => {
    let f = applyFormChange(blankForm(), 'make', 'Toyota');
    expect(f.model).toBe(modelsFor('Toyota', f.year)[0]);
    expect(f.engine).toBe(enginesFor('Toyota', f.model, f.year)[0]);
    f = applyFormChange(f, 'model', 'Sienna');
    expect(f.engine).toBe(enginesFor('Toyota', 'Sienna', f.year)[0]);
  });
});
