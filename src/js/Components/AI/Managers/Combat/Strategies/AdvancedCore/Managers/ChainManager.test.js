import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChainManager } from './ChainManager';
import { ORIENTATIONS } from '../../../../../../../Utility/constants/common';
import { sumCoordinates } from '../../../../../../../Mocks/mockCoordinateUtils';

const mockValidateFn = vi.fn();
const mockGetHighestProbabilityFromMoves = vi.fn();
const mockGetOpenMovesAround = vi.fn();
const mockHitsManager = {
  addUnresolvedHit: vi.fn(),
  resolveHit: vi.fn(),
  getResolvedHits: vi.fn()
};

describe('ChainManager', () => {
  let chainManager;
  beforeEach(() => {
    mockHitsManager.resolveHit.mockReset();
    mockHitsManager.addUnresolvedHit.mockReset();
    chainManager = ChainManager({
      validateFn: mockValidateFn.mockReset(),
      sumCoordinates,
      getOpenMovesAround: mockGetOpenMovesAround.mockReset(),
      getHighestProbabilityFromMoves: mockGetHighestProbabilityFromMoves.mockReset(),
      hitsManager: mockHitsManager
    });
  });

  it('should start with an empty chain', () => {
    expect(chainManager.getChainSize()).toBe(0);
    expect(chainManager.getChainOrientation()).toBe(null);
  });

  it('should add coordinates to the chain and update orientation correctly', () => {
    chainManager.pushToCurrentChain([0, 0]);
    expect(chainManager.getChainSize()).toBe(1);
    chainManager.pushToCurrentChain([0, 1]);
    expect(chainManager.getChainSize()).toBe(2);
    expect(chainManager.getChainOrientation()).toBe(ORIENTATIONS.HORIZONTAL);
  });

  it('should resolve the current chain and clear it', () => {
    chainManager.pushToCurrentChain([0, 0]);
    chainManager.pushToCurrentChain([0, 1]);
    chainManager.resolveCurrentChain();
    expect(chainManager.getChainSize()).toBe(0);
    expect(mockHitsManager.resolveHit).toHaveBeenCalledTimes(2);
  });

  it('should handle unresolved chains by starting a new chain with opposite orientation', () => {
    chainManager.pushToCurrentChain([0, 0]);
    chainManager.handleUnresolvedChain([[1, 1]]);
    expect(chainManager.peekHead()).toEqual([1, 1]);
    expect(mockHitsManager.addUnresolvedHit).toHaveBeenCalledWith([1, 1]);
  });

  it('should correctly resolve part of the chain from the tail', () => {
    chainManager.pushToCurrentChain([0, 0]);
    chainManager.pushToCurrentChain([0, 1]);
    chainManager.pushToCurrentChain([0, 2]);
    chainManager.resolvePartOfChain([0, 2], 1);
    expect(chainManager.getChainSize()).toBe(1);
    expect(mockHitsManager.resolveHit).toHaveBeenCalledTimes(1);
  });

  it('should correctly attempt linear continuation and return next move', () => {
    mockValidateFn.mockReturnValueOnce(true);
    mockGetOpenMovesAround.mockReturnValueOnce([
      [0, 1],
      [1, 0]
    ]);
    mockGetHighestProbabilityFromMoves.mockReturnValueOnce([1, 0]);
    chainManager = ChainManager({
      validateFn: mockValidateFn,
      sumCoordinates,
      getOpenMovesAround: mockGetOpenMovesAround,
      getHighestProbabilityFromMoves: mockGetHighestProbabilityFromMoves,
      hitsManager: mockHitsManager
    });
    chainManager.pushToCurrentChain([0, 0]);
    const nextMove = chainManager.getNextInChain();
    expect(nextMove).toEqual([1, 0]);
  });
  it('should correctly handle unresolved chain and start a new one with opposite orientation', () => {
    chainManager.pushToCurrentChain([0, 0]);
    chainManager.pushToCurrentChain([0, 1]);
    mockValidateFn.mockReturnValueOnce(true);
    chainManager.resolvePartOfChain([0, 1], 1);
    expect(chainManager.getChainSize()).toBe(1);
    expect(chainManager.getChainOrientation()).not.toBe(ORIENTATIONS.HORIZONTAL);
    expect(mockHitsManager.addUnresolvedHit).toHaveBeenCalledWith(expect.any(Array));
  });
  it('should correctly handle no available moves in linear continuation', () => {
    chainManager.pushToCurrentChain([0, 0]);
    mockValidateFn.mockReturnValueOnce(false);
    const nextMove = chainManager.getNextInChain();
    expect(nextMove).toBeNull();
    expect(mockValidateFn).toHaveBeenCalled();
  });
  it('should correctly attempt linear continuation when the chain is initialized and find next move', () => {
    chainManager.pushToCurrentChain([0, 0]);
    chainManager.pushToCurrentChain([0, 1]);
    mockValidateFn.mockImplementation((coord) => true);
    const nextMoveAfterTail = chainManager.getNextInChain();
    expect(nextMoveAfterTail).toEqual([0, 2]);
    expect(mockValidateFn).toHaveBeenCalledWith([0, 2]);
    const nextMoveAfterHead = chainManager.getNextInChain();
    expect(nextMoveAfterHead).toEqual([0, 2]);
    expect(mockValidateFn).toHaveBeenCalledWith([0, 2]);
  });
});
