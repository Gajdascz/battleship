import { describe, expect, it, beforeEach } from 'vitest';

import createShip from '../../../../logic/game/factories/Ship';

let testShip;
beforeEach(() => {
  testShip = createShip(5, 'A Test Ship');
});
describe('Ship Object', () => {
  const sinkShip = (ship) => {
    while (!ship.isSunk) ship.hit();
  };
  it('Ship should indicate it has been hit', () => {
    expect(testShip.hit()).toBe(true);
  });
  it('Ship health should  decrement when it has been hit', () => {
    expect(testShip.hit()).toBe(true);
    expect(testShip.health).toBe(4);
  });
  it('Ship ID should be name in lowercase separated with hyphens ', () => {
    expect(testShip.id).toBe('a-test-ship');
  });
  it('Ship is not initially sunk', () => {
    expect(testShip.isSunk).toBe(false);
  });
  it('Ship can be sunk', () => {
    sinkShip(testShip);
    expect(testShip.isSunk).toBe(true);
  });
  it('Ship should reject hit when already sunk', () => {
    sinkShip(testShip);
    expect(testShip.isSunk).toBe(true);
    expect(testShip.hit()).toBe(false);
  });
  it('Ship health can be reset back to the length', () => {
    sinkShip(testShip);
    expect(testShip.isSunk).toBe(true);
    testShip.reset();
    expect(testShip.isSunk).toBe(false);
    expect(testShip.health).toEqual(testShip.length);
  });
});
