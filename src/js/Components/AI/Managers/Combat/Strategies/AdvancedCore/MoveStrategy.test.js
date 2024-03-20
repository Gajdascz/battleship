import { beforeEach, describe, it, expect, vi } from 'vitest';
import { MoveStrategy } from './MoveStrategy';

describe('MoveStrategy', () => {
  const mockValidateFn = vi.fn();
  const mockGetNextInChain = vi.fn();
  const mockGetRandomMove = vi.fn();
  const mockProbabilityMap = {
    getHighestProbabilityFromMoves: vi.fn(),
    getCellWithHighestProbability: vi.fn()
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return the next move in chain if it is valid', () => {
    const expectedMove = [1, 1];
    mockGetNextInChain.mockReturnValue(expectedMove);
    mockValidateFn.mockReturnValue(true);
    const findBestMove = MoveStrategy(mockValidateFn);

    const result = findBestMove(mockGetNextInChain, mockProbabilityMap, mockGetRandomMove);

    expect(result).toEqual(expectedMove);
    expect(mockValidateFn).toHaveBeenCalledWith(expectedMove);
    expect(mockGetRandomMove).not.toHaveBeenCalled();
  });

  it('should return a move from probability map if next in chain is an array and valid', () => {
    const nextInChain = [
      [1, 1],
      [2, 2]
    ];
    const expectedMove = [1, 1];
    mockGetNextInChain.mockReturnValue(nextInChain);
    mockProbabilityMap.getHighestProbabilityFromMoves.mockReturnValue(expectedMove);
    mockValidateFn.mockReturnValue(true);
    const findBestMove = MoveStrategy(mockValidateFn);

    const result = findBestMove(mockGetNextInChain, mockProbabilityMap, mockGetRandomMove);

    expect(result).toEqual(expectedMove);
    expect(mockProbabilityMap.getHighestProbabilityFromMoves).toHaveBeenCalledWith(nextInChain);
    expect(mockValidateFn).toHaveBeenCalledWith(expectedMove);
    expect(mockGetRandomMove).not.toHaveBeenCalled();
  });

  it('should return a random move if next in chain is not valid', () => {
    const nextInChain = [1, 1];
    const randomMove = [3, 3];
    mockGetNextInChain.mockReturnValue(nextInChain);
    mockValidateFn.mockReturnValue(false); // Invalid move
    mockGetRandomMove.mockReturnValue(randomMove);
    const findBestMove = MoveStrategy(mockValidateFn);

    const result = findBestMove(mockGetNextInChain, mockProbabilityMap, mockGetRandomMove);

    expect(result).toEqual(randomMove);
    expect(mockValidateFn).toHaveBeenCalledWith(nextInChain);
    expect(mockGetRandomMove).toHaveBeenCalled();
  });

  it('should return the cell with highest probability if no next in chain', () => {
    const highestProbabilityCell = [4, 4];
    mockGetNextInChain.mockReturnValue(null);
    mockValidateFn.mockImplementation(() => true);
    mockProbabilityMap.getCellWithHighestProbability.mockReturnValue(highestProbabilityCell);
    const findBestMove = MoveStrategy(mockValidateFn);
    const result = findBestMove(mockGetNextInChain, mockProbabilityMap, mockGetRandomMove);
    expect(result).toEqual(highestProbabilityCell);
    expect(mockProbabilityMap.getCellWithHighestProbability).toHaveBeenCalled();
    expect(mockGetRandomMove).not.toHaveBeenCalled();
  });
});
