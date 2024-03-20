import { beforeEach, describe, it, expect, vi } from 'vitest';
import { processMoveResult } from './processMoveResult';
import { STATUSES } from '../../../../../../Utility/constants/common';

describe('processMoveResult', () => {
  const mocks = {
    setLastHit: vi.fn(),
    addHit: vi.fn(),
    pushToCurrentChain: vi.fn(),
    addUnresolvedHit: vi.fn(),
    addSunk: vi.fn(),
    getLastSunkLength: vi.fn(),
    areHitsEqualToSunk: vi.fn(),
    resolveAllUnresolved: vi.fn(),
    updateProbabilityMap: vi.fn(),
    copyGrid: vi.fn(),
    opponentShipSunk: vi.fn(),
    resolveCurrentChain: vi.fn(),
    resolvePartOfChain: vi.fn(),
    resolveAllChains: vi.fn(),
    getChainSize: vi.fn(),
    handleUnresolvedChain: vi.fn()
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should process a miss correctly', () => {
    const processor = processMoveResult(mocks);
    processor([1, 1], STATUSES.MISS);

    expect(mocks.updateProbabilityMap).toHaveBeenCalledWith(mocks.copyGrid(), false);
    expect(mocks.setLastHit).not.toHaveBeenCalled();
  });

  it('should process a hit correctly', () => {
    const processor = processMoveResult(mocks);
    processor([1, 1], STATUSES.HIT);

    expect(mocks.setLastHit).toHaveBeenCalledWith([1, 1]);
    expect(mocks.addHit).toHaveBeenCalled();
    expect(mocks.pushToCurrentChain).toHaveBeenCalledWith([1, 1]);
    expect(mocks.addUnresolvedHit).toHaveBeenCalledWith([1, 1]);
    expect(mocks.updateProbabilityMap).toHaveBeenCalledWith(mocks.copyGrid(), false);
  });

  it('should process a ship sunk correctly', () => {
    mocks.getLastSunkLength.mockReturnValue(3);
    mocks.getChainSize.mockReturnValue(3);
    mocks.areHitsEqualToSunk.mockReturnValue(false);

    const processor = processMoveResult(mocks);
    processor([1, 1], STATUSES.SHIP_SUNK);

    expect(mocks.setLastHit).toHaveBeenCalledWith([1, 1]);
    expect(mocks.addHit).toHaveBeenCalled();
    expect(mocks.pushToCurrentChain).toHaveBeenCalledWith([1, 1]);
    expect(mocks.addUnresolvedHit).toHaveBeenCalledWith([1, 1]);
    expect(mocks.addSunk).toHaveBeenCalledWith(3);
    expect(mocks.opponentShipSunk).toHaveBeenCalled();
    expect(mocks.resolveCurrentChain).toHaveBeenCalled();
    expect(mocks.updateProbabilityMap).toHaveBeenCalledWith(mocks.copyGrid(), true);
  });
  it('should resolve all unresolved and all chains when hits equal to sunk length', () => {
    mocks.getLastSunkLength.mockReturnValue(2);
    mocks.getChainSize.mockReturnValue(2);
    mocks.areHitsEqualToSunk.mockReturnValue(true);

    const moveResultProcessor = processMoveResult(mocks);
    moveResultProcessor([2, 2], STATUSES.SHIP_SUNK);

    expect(mocks.resolveAllUnresolved).toHaveBeenCalled();
    expect(mocks.resolveAllChains).toHaveBeenCalled();
    expect(mocks.updateProbabilityMap).toHaveBeenCalledWith(mocks.copyGrid(), true);
    expect(mocks.resolveCurrentChain).not.toHaveBeenCalled();
  });

  it('should resolve current chain when chain size equals sunk length', () => {
    mocks.getLastSunkLength.mockReturnValue(3);
    mocks.getChainSize.mockReturnValue(3);
    mocks.areHitsEqualToSunk.mockReturnValue(false);

    const moveResultProcessor = processMoveResult(mocks);
    moveResultProcessor([3, 3], STATUSES.SHIP_SUNK);

    expect(mocks.resolveCurrentChain).toHaveBeenCalled();
    expect(mocks.resolvePartOfChain).not.toHaveBeenCalled();
    expect(mocks.updateProbabilityMap).toHaveBeenCalledWith(mocks.copyGrid(), true);
  });

  it('should resolve part of chain when chain size is greater than sunk length', () => {
    mocks.getLastSunkLength.mockReturnValue(2);
    mocks.getChainSize.mockReturnValue(4);
    mocks.areHitsEqualToSunk.mockReturnValue(false);

    const moveResultProcessor = processMoveResult(mocks);
    moveResultProcessor([4, 4], STATUSES.SHIP_SUNK);

    expect(mocks.resolvePartOfChain).toHaveBeenCalledWith([4, 4], 2);
    expect(mocks.resolveCurrentChain).not.toHaveBeenCalled();
    expect(mocks.resolveAllUnresolved).not.toHaveBeenCalled();
    expect(mocks.updateProbabilityMap).toHaveBeenCalledWith(mocks.copyGrid(), true);
  });

  it('should handle unresolved chain when no specific condition is met', () => {
    mocks.getLastSunkLength.mockReturnValue(1);
    mocks.getChainSize.mockReturnValue(0);
    mocks.areHitsEqualToSunk.mockReturnValue(false);

    const moveResultProcessor = processMoveResult(mocks);
    moveResultProcessor([5, 5], STATUSES.SHIP_SUNK);

    expect(mocks.handleUnresolvedChain).toHaveBeenCalled();
    expect(mocks.resolveCurrentChain).not.toHaveBeenCalled();
    expect(mocks.resolvePartOfChain).not.toHaveBeenCalled();
    expect(mocks.resolveAllUnresolved).not.toHaveBeenCalled();
    expect(mocks.updateProbabilityMap).toHaveBeenCalledWith(mocks.copyGrid(), true);
  });
});
