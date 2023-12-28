import { describe, expect, test } from 'vitest';
import ship from '../factories/ship';

describe('Ship Object', () => {
  test('Ship can be hit', () => {
    const s = ship(5);
    s.hit(2);
    expect(s.isHitAt(2)).toBe(true);
  });
  test('Ship is not initially sunk', () => {
    const s = ship(3);
    expect(s.isSunk()).toBe(false);
  });
  test('Ship can be sunk', () => {
    const s = ship(1);
    s.hit(0);
    expect(s.isSunk()).toBe(true);
  });
  test('Ship hit out of bounds', () => {
    const s = ship(1);
    s.hit(5);
    expect(s.isHitAt(57)).toBe(false);
  });
});
