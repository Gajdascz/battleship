import { vi, describe, expect, it, beforeEach } from 'vitest';
import { STATUSES, createGrid } from '../../../../../Mocks/mockGridUtils';
import { IntermediateMoveStrategy } from './IntermediateMoveStrategy';

describe('IntermediateMoveStrategy', () => {
  let strategy;
  const mockTrackingGrid = createGrid(10, 10, STATUSES.UNEXPLORED);
  const mockPopRandomMove = vi.fn();
  const mockPopMove = vi.fn((row, col) => {
    const index = mockTrackingGrid.findIndex((cell) => cell[0] === row && cell[1] === col);
    return mockTrackingGrid[index];
  });

  beforeEach(() => {
    strategy = IntermediateMoveStrategy({
      trackingGrid: mockTrackingGrid,
      popRandomMove: mockPopRandomMove,
      popMove: mockPopMove
    });
    vi.resetAllMocks();
  });

  it('Should Initialize with no last hit', () => {
    expect(strategy.getLastHit()).toBe(null);
  });

  it('Should return a random move when no last hit and no priority moves', () => {
    mockPopRandomMove.mockReturnValueOnce([1, 2]);
    expect(strategy.getNextMove()).toEqual([1, 2]);
    expect(mockPopRandomMove).toHaveBeenCalled();
  });

  it('Should update last hit and enqueues it in hitChain', () => {
    const hit = [3, 4];
    mockPopMove.mockImplementationOnce(() => [4, 4]);
    strategy.setLastHit(hit);
    expect(strategy.getLastHit()).toEqual(hit);
    expect(strategy.getNextMove()).toEqual([4, 4]);
  });
  it('Should use priority move over random move', () => {
    const priorityMove = [1, 2];
    strategy.setLastHit([0, 1]);
    mockPopRandomMove.mockReturnValueOnce([3, 4]);
    mockPopMove.mockImplementationOnce(() => priorityMove);
    expect(strategy.getNextMove()).toEqual(priorityMove);
  });
  it('should backtrack and return priority move correctly', () => {
    mockPopMove.mockImplementationOnce((value) => value);
    mockPopRandomMove.mockImplementationOnce((value) => value);
    mockTrackingGrid[1][1] = STATUSES.MISS;
    mockTrackingGrid[1][2] = STATUSES.MISS;
    mockTrackingGrid[1][3] = STATUSES.MISS;
    mockTrackingGrid[0][4] = STATUSES.MISS;
    mockTrackingGrid[0][1] = STATUSES.HIT;
    mockTrackingGrid[0][2] = STATUSES.HIT;
    mockTrackingGrid[0][3] = STATUSES.HIT;
    strategy.processMoveResult([0, 1], STATUSES.HIT);
    strategy.processMoveResult([0, 2], STATUSES.HIT);
    strategy.processMoveResult([0, 3], STATUSES.HIT);

    expect(strategy.getNextMove()).toEqual([0, 0]);
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
    mockPopMove.mockImplementationOnce(() => [5, 5]);
    expect(strategy.getNextMove()).toEqual([5, 5]);
  });
  it('Should process move result correctly for a sunk ship', () => {
    const hit = [3, 4];
    strategy.setLastHit(hit);
    strategy.processMoveResult(hit, STATUSES.SHIP_SUNK);

    expect(strategy.getLastHit()).toBe(null);
    expect(strategy.hasHitsInChain()).toBe(false);
    expect(strategy.hasPriorityMoves()).toBe(false);
  });
});
