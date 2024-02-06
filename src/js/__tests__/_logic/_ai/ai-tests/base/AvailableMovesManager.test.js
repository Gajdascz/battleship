import { describe, expect, it, beforeEach } from 'vitest';
import { AvailableMovesManager } from '../../../logic/ai/base/AvailableMovesManager';
import { RESULTS } from '../../../utility/constants';

let manager, grid;
beforeEach(() => {
  manager = AvailableMovesManager();
  grid = [
    [
      RESULTS.UNEXPLORED,
      RESULTS.UNEXPLORED,
      RESULTS.UNEXPLORED,
      RESULTS.UNEXPLORED,
      RESULTS.MISS,
      RESULTS.UNEXPLORED
    ],
    [
      RESULTS.UNEXPLORED,
      RESULTS.HIT,
      RESULTS.UNEXPLORED,
      RESULTS.UNEXPLORED,
      RESULTS.UNEXPLORED,
      RESULTS.UNEXPLORED
    ]
  ];
  manager.initializeAvailableMoves(grid);
});

describe('AvailableMovesManager', () => {
  it('Should Initialize Available Moves Correctly', () => {
    expect(manager.getTotalAvailableMoves()).toEqual(10);
  });
  it('Should Select and Remove a Random Available Move', () => {
    const move = manager.popRandomMove();
    expect(manager.getTotalAvailableMoves()).toEqual(9);
    expect(move[0] <= 5 && move[1] <= 5).toBe(true);
  });
  it('Should Retrieve and Remove a Specified Available Move and Return Null if Invalid', () => {
    const move = manager.popMove([0, 5]);
    expect(manager.getTotalAvailableMoves()).toEqual(9);
    expect(move).toContainEqual([0, 5]);
    const badMove = manager.popMove([999, 999]);
    expect(badMove).toBe(null);
    expect(manager.getTotalAvailableMoves()).toEqual(9);
  });
  it('Should Retrieve a Copy of a Random Move', () => {
    const move = manager.getRandomMove();
    expect(manager.getTotalAvailableMoves()).toEqual(10);
  });
  it('Should Return a Copy of All Available Moves', () => {
    const copy = manager.getAvailableMoves();
    expect(copy.length).toEqual(10);
    copy.splice(0, 1);
    expect(copy.length).toEqual(9);
    expect(manager.getTotalAvailableMoves()).toEqual(10);
  });
  it('Should Return a Copy of a Specified Move', () => {
    const copy = manager.getMove([0, 0]);
    expect(copy).toContainEqual([0, 0]);
    expect(manager.getTotalAvailableMoves()).toEqual(10);
  });
});
