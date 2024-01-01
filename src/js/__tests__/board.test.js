import { describe, expect, test, vi, beforeEach } from 'vitest';
import board from '../factories/board';
import { createMockShip as ship } from './__mocks__/mockModules.';

vi.mock('../factories/ship.js', () => ({ default: ship() }));

const getPlaceObj = (testShip, start, end) => ({ ship: testShip, start, end });
const getRowBoardObj = (r, c) => ({ rows: r, cols: c, letterAxis: 'row' });
const getColBoardObj = (r, c) => ({ rows: r, cols: c, letterAxis: 'col' });
const placeShip = (board, ship, startCoord, endCoord) => board.place(getPlaceObj(ship, startCoord, endCoord));

describe('Board Object', () => {
  describe('Place Ship', () => {
    let rowBoard, columnBoard, testShip;
    beforeEach(() => {
      rowBoard = board(getRowBoardObj(10, 10));
      columnBoard = board(getColBoardObj(10, 10));
      testShip = ship();
    });
    const assertShipPlacementResult = (arr, addPlace) => {
      arr.forEach(([boardInstance, placeObj, expected]) => {
        if (addPlace) boardInstance.place(placeObj);
        expect(boardInstance.place(placeObj)).toBe(expected);
      });
    };

    test('Place ship in bounds', () => {
      const inBoundsCases = [
        [rowBoard, getPlaceObj(testShip, ['A', 4], ['A', 8]), true],
        [columnBoard, getPlaceObj(ship(), [4, 'A'], [8, 'A']), true]
      ];
      assertShipPlacementResult(inBoundsCases);
    });
    test('Place ship out of bounds', () => {
      const outOfBoundsCases = [
        [rowBoard, getPlaceObj(testShip, ['Z', 900], ['Z', 999]), false],
        [columnBoard, getPlaceObj(testShip, [900, 'Z'], [999, 'Z']), false]
      ];
      assertShipPlacementResult(outOfBoundsCases);
    });
    test('Place ship atop another', () => {
      const atopAnotherCases = [
        [rowBoard, getPlaceObj(testShip, ['A', 4], ['A', 8]), false],
        [columnBoard, getPlaceObj(testShip, [4, 'A'], [4, 'A']), false]
      ];
      assertShipPlacementResult(atopAnotherCases, true);
    });
  });

  describe('Process Incoming Attack', () => {
    let playerBoard, testShip;
    beforeEach(() => {
      playerBoard = board(getRowBoardObj(10, 10));
      testShip = ship();
    });
    const assertAttackOutcome = (loc, expected) => {
      expect(playerBoard.incomingAttack(loc)).toBe(expected);
    };

    test('Attack is hit', () => {
      placeShip(playerBoard, testShip, ['A', 4], ['A', 8]);
      assertAttackOutcome(['A', 4], true);
    });
    test('Attack is miss', () => {
      placeShip(playerBoard, testShip, ['A', 4], ['A', 8]);
      assertAttackOutcome(['J', 0], false);
    });
    test('Attack is invalid', () => {
      placeShip(playerBoard, testShip, ['A', 4], ['A', 8]);
      assertAttackOutcome(['Z', 999], false);
    });
    test('Attack sunk one ship', () => {
      const testShip2 = ship();
      placeShip(playerBoard, testShip, ['A', 4], ['A', 8]);
      placeShip(playerBoard, testShip2, ['C', 4], ['C', 8]);
      testShip.toggleSunk();
      assertAttackOutcome(['A', 4], 1);
    });
    test('Attack sunk all ships', () => {
      const testShip2 = ship(1);
      placeShip(playerBoard, testShip, ['A', 4], ['A', 8]);
      placeShip(playerBoard, testShip2, ['C', 4], ['C', 8]);
      testShip.toggleSunk();
      testShip2.toggleSunk();
      assertAttackOutcome(['A', 4], -1);
    });
  });

  describe('Process Outgoing Attack', () => {
    let playerBoard, opponentBoard, testShip;
    beforeEach(() => {
      playerBoard = board(getRowBoardObj(10, 10));
      opponentBoard = board(getRowBoardObj(10, 10));
      testShip = ship();
      testShip.hit.mockReturnValue(testShip.health-- && true);
    });
    const assertAttackOutcome = (loc, expected) => {
      expect(playerBoard.outgoingAttack(loc, opponentBoard)).toBe(expected);
    };

    test('Attack is a hit', () => {
      placeShip(opponentBoard, testShip, ['A', 0], ['A', 4]);
      assertAttackOutcome(['A', 0], true);
    });
    test('Attack is a miss', () => {
      placeShip(opponentBoard, testShip, ['A', 0], ['A', 4]);
      assertAttackOutcome(['C', 9], false);
    });
    test('Attack sunk one ship', () => {
      const testShip2 = ship();
      placeShip(opponentBoard, testShip, ['A', 4], ['A', 8]);
      placeShip(opponentBoard, testShip2, ['C', 4], ['C', 8]);
      testShip.toggleSunk();
      assertAttackOutcome(['A', 4], 2);
    });
    test("Attack sunk opponent's last ship", () => {
      placeShip(opponentBoard, testShip, ['A', 0], ['A', 0]);
      testShip.toggleSunk();
      assertAttackOutcome(['A', 0], 1);
    });
  });
});
