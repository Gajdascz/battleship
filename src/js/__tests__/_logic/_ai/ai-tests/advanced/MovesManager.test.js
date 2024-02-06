import { vi, describe, expect, test, beforeEach } from 'vitest';
import { MovesManager } from '../../../logic/ai/advancedAI/MovesManager';

describe('MovesManager', () => {
  const mockValidateFn = vi.fn().mockReturnValue(true);
  const initialTotalAvailableMoves = 100;
  const mockPriorityAssessment = vi.fn().mockReturnValue(5);

  let movesManager;

  beforeEach(() => {
    movesManager = MovesManager(mockValidateFn, initialTotalAvailableMoves, mockPriorityAssessment);
    mockValidateFn.mockClear();
    mockPriorityAssessment.mockClear();
  });

  test('Should initialize correctly', () => {
    expect(movesManager).toBeDefined();
    expect(movesManager.madeMove).toBeDefined();
    expect(movesManager.assessMoves).toBeDefined();
    expect(movesManager.assessPriorityMoves).toBeDefined();
    expect(movesManager.getPercentageOfMovesLeft()).toEqual(1);
    expect(movesManager.getHighestPriorityMove()).toEqual(null);
    expect(movesManager.getPriorityMoves()).toEqual([]);
    expect(movesManager.hasPriorityMoves()).toBe(false);
  });

  describe('getPercentageOfMovesLeft', () => {
    test('Should calculate percentage of moves left correctly', () => {
      movesManager.madeMove();
      expect(movesManager.getPercentageOfMovesLeft()).toBeCloseTo(0.99, 2);
      movesManager.madeMove();
      movesManager.madeMove();
      movesManager.madeMove();
      movesManager.madeMove();
      expect(movesManager.getPercentageOfMovesLeft()).toBeCloseTo(0.95, 2); //
    });
    test('Should return the highest priority move correctly', () => {
      movesManager.assessPriorityMoves([[1, 1]]);
      expect(movesManager.getHighestPriorityMove()).toEqual([1, 1]);
      expect(movesManager.getHighestPriorityMove()).toBeNull();
    });

    test('total moves made should not exceed total possible moves', () => {
      for (let i = 0; i < initialTotalAvailableMoves + 10; i++) {
        movesManager.madeMove();
      }
      expect(movesManager.getPercentageOfMovesLeft()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('assessMoves', () => {
    test('assessMoves - Should filter, prioritize, and sort moves', () => {
      const moves = [
        [1, 1],
        [2, 2],
        [3, 3]
      ];
      const assessedMoves = movesManager.assessMoves(moves);
      expect(assessedMoves).toHaveLength(3);
      expect(assessedMoves[0].priority).toBeGreaterThanOrEqual(assessedMoves[1].priority);
      expect(assessedMoves[1].priority).toBeGreaterThanOrEqual(assessedMoves[2].priority);
    });
  });

  describe('Priority Move Assessments and Methods ', () => {
    test('getPriorityMoves - Should return a copy of priority moves', () => {
      movesManager.assessPriorityMoves([[1, 1]]);
      const priorityMoves = movesManager.getPriorityMoves();
      expect(priorityMoves).toEqual([[1, 1]]);
      expect(priorityMoves).not.toBe(movesManager.getPriorityMoves());
    });
    test('hasPriorityMoves - Should return correct boolean', () => {
      expect(movesManager.hasPriorityMoves()).toBe(false);
      movesManager.assessPriorityMoves([[1, 1]]);
      expect(movesManager.hasPriorityMoves()).toBe(true);
    });
    test('Should be called with correct arguments', () => {
      movesManager.assessPriorityMoves([[4, 4]]);
      expect(mockPriorityAssessment).toHaveBeenCalledWith([4, 4]);
    });
    test('Should update priorityMoves correctly', () => {
      movesManager.assessPriorityMoves([
        [1, 1],
        [2, 2]
      ]);
      expect(movesManager.getPriorityMoves()).toEqual([
        [1, 1],
        [2, 2]
      ]);
    });
    test('Should handle empty input array', () => {
      movesManager.assessPriorityMoves([]);
      expect(movesManager.getPriorityMoves()).toEqual([]);
    });
    test('Should combine new and existing priority moves', () => {
      movesManager.assessPriorityMoves([[1, 1]]);
      movesManager.assessPriorityMoves([[2, 2]]);
      expect(movesManager.getPriorityMoves()).toContainEqual([1, 1]);
      expect(movesManager.getPriorityMoves()).toContainEqual([2, 2]);
    });
  });
});
