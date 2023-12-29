import { describe, expect, test, vi } from 'vitest';
import board from '../factories/board';
import ship from '../factories/ship';

vi.mock('../factories/ship.js', () => {
  return {
    default: (length = 5) => ({
      hit: vi.fn(),
      get isSunk() {
        return false;
      },
      get isShip() {
        return true;
      },
      health: length
    })
  };
});

const getPlaceObj = (s, start, end) => ({ ship: s, start, end });
const getRowBoardObj = (r, c) => ({ rows: r, cols: c, letterAxis: 'row' });
const getColBoardObj = (r, c) => ({ rows: r, cols: c, letterAxis: 'col' });

describe('Board Object', () => {
  describe('Place Ship', () => {
    test('Place ship in bounds', () => {
      const b = board(getRowBoardObj(10, 10));
      const b1 = board(getColBoardObj(10, 10));
      const s = ship();
      expect(b.place(getPlaceObj(s, ['A', 4], ['A', 8]))).toBe(true);
      expect(b1.place(getPlaceObj(s, [4, 'A'], [8, 'A']))).toBe(true);
    });
    test('Place ship out of bounds', () => {
      const b = board(getRowBoardObj(10, 10));
      const b1 = board(getColBoardObj(10, 10));
      const s = ship();
      expect(b.place(getPlaceObj(s, ['Z', 900], ['Z', 999]))).toBe(false);
      expect(b1.place(getPlaceObj(s, [900, 'Z'], [999, 'Z']))).toBe(false);
    });

    test('Place ship atop another', () => {
      const b = board(getRowBoardObj(10, 10));
      const b1 = board(getColBoardObj(10, 10));
      const s = ship();
      const place = getPlaceObj(s, ['A', 4], ['A', 8]);
      const place1 = getPlaceObj(s, [4, 'A'], [4, 'A']);
      b.place(place);
      b1.place(place1);
      expect(b.place(place)).toBe(false);
      expect(b1.place(place1)).toBe(false);
    });
  });

  describe('Process Attack', () => {
    test('Attack is hit', () => {
      const b = board(getRowBoardObj(10, 10));
      const s = ship();
      s.hit.mockReturnValue(s.health-- && true);
      b.place(getPlaceObj(s, ['A', 4], ['A', 8]));

      const result = b.incomingAttack(['A', 4]);
      expect(result).toBe(true);
      expect(s.hit).toHaveBeenCalled();
      expect(s.health).toBe(4);
    });
    test('Attack is miss', () => {
      const b = board(getRowBoardObj(10, 10));
      const s = ship();
      b.place(getPlaceObj(s, ['A', 4], ['A', 8]));
      const result = b.incomingAttack(['J', 0]);
      expect(result).toBe(false);
    });
    test('Attack is invalid', () => {
      const b = board(getRowBoardObj(10, 10));
      const s = ship();
      b.place(getPlaceObj(s, ['A', 4], ['A', 8]));
      const result = b.incomingAttack(['Z', 999]);
      expect(result).toBe(false);
    });
    test('Attack sunk one ship', () => {
      const b = board(getRowBoardObj(10, 10));
      const s = ship(1);
      const s1 = ship();
      s.hit.mockReturnValue(s.health-- && true);
      Object.defineProperty(s, 'isSunk', { get: vi.fn().mockReturnValue(true) });
      b.place(getPlaceObj(s, ['A', 4], ['A', 8]));
      b.place(getPlaceObj(s1, ['C', 4], ['C', 8]));
      const result = b.incomingAttack(['A', 4]);
      expect(result).toBe(true);
    });
    test('Attack sunk all ships', () => {
      const b = board(getRowBoardObj(10, 10));
      const s = ship(1);
      const s1 = ship(1);
      s.hit.mockReturnValue(s.health-- && true);
      s1.hit.mockReturnValue(s.health-- && true);
      Object.defineProperty(s, 'isSunk', { get: vi.fn().mockReturnValue(true) });
      Object.defineProperty(s1, 'isSunk', { get: vi.fn().mockReturnValue(true) });
      b.place(getPlaceObj(s, ['A', 4], ['A', 8]));
      b.place(getPlaceObj(s1, ['C', 4], ['C', 8]));
      const result = b.incomingAttack(['A', 4]);
      expect(result).toBe(-1);
    });
  });

  describe('Track Grid', () => {
    const b = board(10, 10, 'row');
    test('Attack is tracked as a miss', () => {
      b.incomingAttack('J', 5);
      expect(b.trackingGrid(['J', 5])).toBe(false);
    });
    test('Attack is tracked as a hit', () => {
      b.incomingAttack('A', 5);
      expect(b.trackingGrid(['J', 0])).toBe(1);
    });
    test('Attack is invalid and not tracked', () => {
      b.incomingAttack('Z', 999);
      expect(b.trackingGrid(['Z', 999])).toBe(undefined);
    });
    test('Tracking grid position is unexplored', () => {
      expect(b.trackingGrid(['A', 9])).toBe(null);
    });
  });

  // describe('Sunk Ships', () => {
  //   const b = board(10, 10, 'row');
  //   test('No ships are sunk', () => {
  //     expect(b.sunkShips).toBe(0);
  //   });
  //   test('All ships are sunk', () => {
  //     expect(b.sunkShips).toEqual(b.ships);
  //   });
  //   test('One ship is sunk', () => {
  //     expect(b.sunkShips).toBe(1);
  //   });
  // });
});
