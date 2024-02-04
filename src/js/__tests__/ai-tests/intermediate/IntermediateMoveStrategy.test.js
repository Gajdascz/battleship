import { vi, describe, expect, it, beforeEach } from 'vitest';

import { MoveStrategy } from '../../../logic/ai/intermediate/IntermediateMoveStrategy';

describe('IntermediateMoveStrategy', () => {
  let strategy;
  const mockTrackingGrid = [];
  const mockGetOpenMovesAround = vi.fn();
  const mockGetRandomMove = vi.fn();
  const mockPopRandom = vi.fn();

  beforeEach(() => {
    strategy = MoveStrategy({
      trackingGrid: mockTrackingGrid,
      getOpenMovesAround: mockGetOpenMovesAround,
      getRandomMove: mockGetRandomMove,
      popRandom: mockPopRandom
    });
  });

  it('Should Initialize with no last hit', () => {
    expect(strategy.getLastHit()).toBe(null);
  });

  it('Should return a random move when no last hit and no priority moves', () => {
    mockGetRandomMove.mockReturnValueOnce([1, 2]);
    expect(strategy.getNextMove()).toEqual([1, 2]);
    expect(mockGetRandomMove).toHaveBeenCalled();
  });

  it('Should update last hit and enqueues it in hitChain', () => {
    const hit = [3, 4];
    mockGetOpenMovesAround.mockImplementation(() => [4, 4]);
    mockPopRandom.mockImplementation(() => [4, 4]);
    strategy.setLastHit(hit);
    expect(strategy.getLastHit()).toEqual(hit);
    expect(strategy.getNextMove()).toEqual([4, 4]);
  });

  it('Should clears last hit, priority moves, and hitChain', () => {
    strategy.setLastHit([3, 4]);
    strategy.reset();
    expect(strategy.getLastHit()).toBe(null);
    expect(strategy.hasPriorityMoves()).toBe(false);
    expect(strategy.hasHitsInChain()).toBeFalsy();
  });

  it('Should backtrack and returns a priority move when last hit has no open moves around', () => {
    const hit = [3, 4];
    strategy.setLastHit(hit);
    mockGetOpenMovesAround.mockReturnValueOnce([]);
    mockPopRandom.mockImplementationOnce(() => [5, 5]);
    expect(strategy.getNextMove()).toEqual([5, 5]);
  });
});
