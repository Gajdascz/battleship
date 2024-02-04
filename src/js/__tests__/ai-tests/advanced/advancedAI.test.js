import { describe, expect, test, beforeEach } from 'vitest';
import createMockBoard from '../../__mocks__/mockBoard.js';
import createMockShip from '../../__mocks__/mockShip.js';
import computerAI from '../../logic/ai/ai.js';
import { RESULTS, DIRECTIONS } from '../../../utility/constants.js';

const defaultFleet = [
  createMockShip(5, 'carrier'),
  createMockShip(4, 'battleship'),
  createMockShip(3, 'submarine'),
  createMockShip(3, 'destroyer'),
  createMockShip(2, 'patrol-boat')
];
const getFleet = () => defaultFleet.map((ship) => createMockShip(ship.length, ship.name));

const addBaseProperties = (ai) => {
  ai.board = createMockBoard();
  ai.initializeAvailableMoves();
  ai.addShip(getFleet());
  ai.initializeFleetTracker();
};

describe('Advanced AI', () => {
  let ai;
  beforeEach(() => {
    ai = computerAI(2, 'ai');
    addBaseProperties(ai);
  });
  describe('Initialization', () => {
    test('Should initialize fleet list correctly', () => {
      expect(ai.fleetList).toBeInstanceOf(Map);
      expect(ai.fleetList.get('carrier')).toBe(5);
      expect(ai.fleetList.get('battleship')).toBe(4);
      expect(ai.fleetList.get('submarine')).toBe(3);
      expect(ai.fleetList.get('destroyer')).toBe(3);
      expect(ai.fleetList.get('patrol-boat')).toBe(2);
      expect(ai.liveOpponentShips).toBeInstanceOf(Map);
      expect(ai.smallestAliveOpponentShip).toEqual(2);
    });
  });
  test('Should wrap coordinates helper', () => {
    expect(ai.getOpenMovesAround).toBeDefined();
    expect(ai.getValueAt).toBeDefined();
    expect(ai.getCellInADirection).toBeDefined();
    expect(ai.sumCoordinates).toBeDefined();
    expect(ai.getOpenMovesInADirection).toBeDefined();
  });
  test('Should initialize methods and properties', () => {
    expect(ai.lastHit).toBe(null);
    expect(ai.currentHitChain.isEmpty()).toBe(true);
    expect(ai.priorityMoves.isEmpty()).toBe(true);
    expect(ai.totalHits).toEqual(0);
    expect(ai.totalSunk).toEqual(0);
    expect(ai.processMoveResult).toBeDefined();
    expect(ai.makeMove).toBeDefined();
    expect(ai.getRandomOpenAround).toBeDefined();
    expect(ai.findBestMove).toBeDefined();
    expect(ai.getNextInChain).toBeDefined();
  });

  describe('Move generation and finding', () => {
    describe('Finding the best move in correct logical order', () => {
      test('Should take element from priority queue when not empty', () => {
        ai.priorityMoves.enqueue([0, 0]);
        expect(ai.priorityMoves.isEmpty()).toBe(false);
        expect(ai.findBestMove()).toEqual([0, 0]);
        expect(ai.priorityMoves.isEmpty()).toBe(true);
      });
      test('Should find random open move around when ai has last hit and one in chain', () => {
        ai.lastHit = [1, 1];
        ai.currentHitChain.addCoordinates([1, 1]);
        const around = [
          [2, 1],
          [0, 1],
          [1, 2],
          [1, 0]
        ];
        expect(around).toContainEqual(ai.findBestMove([5, 5]));
        ai.lastHit = [0, 0];
        ai.currentHitChain.reset();
        ai.currentHitChain.addCoordinates([0, 0]);
        const around2 = [
          [1, 0],
          [0, 1]
        ];
        expect(around2).toContainEqual(ai.findBestMove([0, 0]));
      });
      test('Should properly find the next move to continue hit chain', () => {
        ai.currentHitChain.addCoordinates([1, 2]);
        ai.currentHitChain.addCoordinates([1, 1]);
        expect(ai.currentHitChain.getLastFollowedDirection()).toEqual(DIRECTIONS.LEFT);
        expect(ai.findBestMove()).toEqual([1, 0]);
        ai.currentHitChain.addCoordinates([1, 0]);
        expect(ai.findBestMove()).toEqual([1, 3]);
      });
    });
  });

  describe('Move Processing', () => {
    const assertProperties = (
      lasHit,
      chainSize,
      resolvedLength,
      totalSunk,
      totalHits,
      resolvedHits = null
    ) => {
      expect(ai.lastHit).toEqual(lasHit);
      expect(ai.currentHitChain.getSize()).toBe(chainSize);
      expect(ai.resolvedHits.length).toBe(resolvedLength);
      expect(ai.totalSunk).toEqual(totalSunk);
      expect(ai.totalHits).toEqual(totalHits);
      if (resolvedHits) expect(resolvedHits).toEqual(resolvedHits);
    };
    test('Should throw error when given an invalid move', () => {
      expect(() => ai.processMoveResult(null, '')).toThrowError();
    });
    test('Should update last hit, hit chain and total hits on hit', () => {
      ai.processMoveResult([0, 0], RESULTS.HIT);
      assertProperties([0, 0], 1, 0, 0, 1);
    });
    test('Should update last hit to null, total sunk, resolved hits,and destruct hit chain on ship sunk', () => {
      ai.lastSunkLength = 2;
      ai.processMoveResult([0, 0], RESULTS.HIT);
      ai.processMoveResult([0, 1], RESULTS.SHIP_SUNK);
      assertProperties(null, 0, 2, 2, 2, [
        [0, 0],
        [0, 1]
      ]);
    });
    test('Should not update on miss', () => {
      ai.processMoveResult([0, 0], RESULTS.MISS);
      ai.processMoveResult([0, 5], RESULTS.MISS);
      assertProperties(null, 0, 0, 0, 0);
    });
    describe('Unresolved Chain Processing', () => {
      test('Should return resolved hits equal to ship sunk length and unresolved equal to remainder', () => {
        ai.lastSunkLength = 3;
        ai.processMoveResult([5, 5], RESULTS.HIT); // unresolved
        ai.processMoveResult([5, 4], RESULTS.HIT); // resolved
        ai.processMoveResult([5, 3], RESULTS.HIT); // resolved
        ai.processMoveResult([5, 2], RESULTS.SHIP_SUNK); /// resolved
        expect(ai.lastHit).toBe(null);
        expect(ai.resolvedHits.length).toBe(3);
        expect(ai.resolvedHits).toEqual([
          [5, 4],
          [5, 3],
          [5, 2]
        ]);
        expect(ai.totalHits).toEqual(4);
        expect(ai.totalSunk).toEqual(3);
      });
    });
  });
});
