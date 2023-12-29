import { describe, expect, test, vi } from 'vitest';
import board from '../factories/board';
import ship from '../factories/ship';

vi.mock('../factories/ship.js');

describe('Board Object', () => {
  ship.mockImplementation((length, name) => ({
    hit: vi.fn().mockReturnValue(undefined),
    isSunk: vi.fn().mockReturnValue(false),
    name
  }));
  describe.only('Place Ship', () => {
    test('Place ship in bounds', () => {
      const b = board(10, 10, 'row');
      const s1 = ship(5, 'Destroyer');
      expect(b.place({ ship: s1, start: ['A', 4], end: ['A', 8] })).toBe(true);
    });
    test('Place ship out of bounds', () => {
      const b = board(10, 10, 'row');
      const s1 = ship(5, 'Destroyer');
      expect(b.place({ ship: s1, start: ['Z', 900], end: ['Z', 999] })).toBe(false);
    });

    test('Place ship atop another', () => {
      const b = board(10, 10, 'row');
      const s1 = ship(5, 'Destroyer');
      b.place({ ship: s1, start: ['A', 4], end: ['A', 8] });
      expect(b.place({ ship: s1, start: ['A', 4], end: ['A', 8] })).toBe(false);
    });
  });

  describe('Process Attack', () => {
    const b = board(10, 10, 'row');
    test('Attack is hit', () => {
      expect(b.attack(['A', 5])).toBe(true);
    });
    test('Attack is miss', () => {
      expect(b.attack(['J', 0])).toBe(false);
    });
    test('Attack is invalid', () => {
      expect(b.attack(['Z', 999])).toBe(false);
    });
  });

  describe('Track Grid', () => {
    const b = board(10, 10, 'row');
    test('Attack is tracked as a miss', () => {
      b.attack('J', 5);
      expect(b.trackingGrid(['J', 5])).toBe(0);
    });
    test('Attack is tracked as a hit', () => {
      b.attack('A', 5);
      expect(b.trackingGrid(['J', 0])).toBe(1);
    });
    test('Attack is invalid and not tracked', () => {
      b.attack('Z', 999);
      expect(b.trackingGrid(['Z', 999])).toBe(undefined);
    });
    test('Tracking grid position is unexplored', () => {
      expect(b.trackingGrid(['A', 9])).toBe(null);
    });
  });

  describe('Sunk Ships', () => {
    const b = board(10, 10, 'row');
    test('No ships are sunk', () => {
      expect(b.sunkShips).toBe(0);
    });
    test('All ships are sunk', () => {
      expect(b.sunkShips).toEqual(b.ships);
    });
    test('One ship is sunk', () => {
      expect(b.sunkShips).toBe(1);
    });
  });
});
