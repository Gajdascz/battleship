import { describe, expect, it, beforeEach } from 'vitest';

import createBoard from '../../../../logic/game/factories/Board';

import createMockShip from '../../../__mocks/mockShip';

let testBoard, testShip;
beforeEach(() => {
  testBoard = createBoard({ rows: 10, cols: 10 });
  testShip = createMockShip();
});
const placeShip = (board, ship, start, end) => board.place({ ship, start, end });

describe('Board Object - Place Ship', () => {
  const assert = (result, expected) => expect(result).toBe(expected);
  // Default ship length is set to 5
  it('Should successfully place ship within board boundaries', () => {
    const result = placeShip(testBoard, testShip, [0, 4], [0, 8]);
    assert(result, true);
  });
  it('Should reject ship placement outside board boundaries', () => {
    testShip.setLength(1000);
    const result = placeShip(testBoard, testShip, [999, 999], [0, 0]);
    assert(result, false);
  });
  it('Should reject ship placement with diagonal orientation', () => {
    const result = placeShip(testBoard, testShip, [0, 0], [4, 4]);
    assert(result, false);
  });
  it('Should reject ship placement with length not equal to placement length', () => {
    testShip.setLength(2);
    const result = placeShip(testBoard, testShip, [0, 0], [0, 5]);
    assert(result, false);
  });
  it('Should prevent ship placement on top of another ship', () => {
    const resultOne = placeShip(testBoard, testShip, [0, 0], [0, 4]);
    const resultTwo = placeShip(testBoard, testShip, [0, 1], [0, 5]);
    assert(resultOne, true);
    assert(resultTwo, false);
  });
  it('Should place ship along the edge of the board', () => {
    testShip.setLength(10);
    const result = testBoard.place({ ship: testShip, start: [0, 9], end: [9, 9] });
    assert(result, true);
  });
});

describe('Board Object - Attack Processing', () => {
  // Board attack result constants
  const HIT = true;
  const MISS = false;
  const SHIP_SUNK = 1;
  const ALL_SHIPS_SUNK = -1;
  beforeEach(() => placeShip(testBoard, testShip, [0, 0], [0, 4]));
  describe('Process Incoming Attack', () => {
    const assert = (coordinates, expected) =>
      expect(testBoard.incomingAttack(coordinates)).toBe(expected);

    it('Should register a hit on a valid ship coordinate', () => assert([0, 0], HIT));
    it('Should register a miss on an empty coordinate', () => assert([1, 1], MISS));
    it('Should reject a request for an out of bounds coordinate', () => assert([100, 100], false));
    it('Should indicate a ship is sunk when last hit is registered', () => {
      const testShip2 = createMockShip();
      placeShip(testBoard, testShip2, [1, 1], [5, 1]);
      testShip2.setHealth(1);
      assert([1, 1], SHIP_SUNK);
    });
    it('Should indicate all ships are sunk when the last ship is sunk', () => {
      const testShip2 = createMockShip();
      testShip.toggleSunk();
      placeShip(testBoard, testShip2, [4, 1], [8, 1]);
      testShip2.setHealth(1);
      assert([5, 1], ALL_SHIPS_SUNK);
    });
    it('Should register multiple hits on the same ship in different spots', () => {
      assert([0, 0], true);
      assert([0, 1], true);
      assert([0, 2], true);
    });
    it('Should reject multiple hits on the same ship in the same spot', () => {
      assert([0, 0], true);
      assert([0, 0], false);
      assert([0, 1], true);
      assert([0, 1], false);
    });
  });

  describe('Process Outgoing Attack', () => {
    const assert = (coordinates, expected) => {
      expect(testBoard.outgoingAttack(coordinates, opponentBoard)).toBe(expected);
    };
    let opponentBoard;
    beforeEach(() => {
      opponentBoard = createBoard({ rows: 10, cols: 10 });
      testBoard.opponentBoard = opponentBoard;
      placeShip(opponentBoard, testShip, [0, 0], [0, 4]);
    });

    it('Should register a hit on a valid ship coordinate', () => assert([0, 0], HIT));
    it('Should register a miss on an empty coordinate', () => assert([1, 1], MISS));
    it('Should reject a request for an out of bounds coordinate', () => assert([-1, -1], false));
    it('Should indicate a ship is sunk when last hit is registered', () => {
      const testShip2 = createMockShip();
      placeShip(opponentBoard, testShip2, [3, 3], [7, 3]);
      testShip2.setHealth(1);
      assert([4, 3], SHIP_SUNK);
    });
    it('Should indicate all ships are sunk when the last ship is sunk', () => {
      const testShip2 = createMockShip();
      placeShip(opponentBoard, testShip2, [3, 3], [7, 3]);
      testShip2.setHealth(1);
      testShip.toggleSunk();
      assert([4, 3], ALL_SHIPS_SUNK);
    });
    it('Should register multiple hits on the same ship in different spots', () => {
      assert([0, 0], true);
      assert([0, 1], true);
      assert([0, 2], true);
    });
    it('Should reject multiple hits on the same ship in the same spot', () => {
      assert([0, 0], true);
      assert([0, 0], false);
      assert([0, 1], true);
      assert([0, 1], false);
    });
  });
});
