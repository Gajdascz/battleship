import { describe, expect, it, beforeEach } from 'vitest';
import { OpponentFleetManager } from './OpponentFleetManager';

const fleetData = [
  { id: 'ship0', length: 5 },
  { id: 'ship1', length: 4 },
  { id: 'ship2', length: 3 },
  { id: 'ship3', length: 3 },
  { id: 'ship4', length: 2 }
];
let manager = null;
beforeEach(() => {
  manager = OpponentFleetManager(fleetData);
});
describe('OpponentFleetManager', () => {
  it('should initialize with proper values', () => {
    expect(manager.getNumberOfOpponentShipsLeft()).toEqual(5);
    expect(manager.getLiveOpponentShipLengths()).toEqual([5, 4, 3, 3, 2]);
  });
  it('should update properly when a ship is sunk', () => {
    manager.opponentShipSunk('ship2');
    expect(manager.getLastSunkLength()).toEqual(3);
    manager.opponentShipSunk('ship0');
    expect(manager.getLastSunkLength()).toEqual(5);
    expect(manager.getNumberOfOpponentShipsLeft()).toEqual(3);
    expect(manager.getLiveOpponentShipLengths()).toEqual([4, 3, 2]);
  });
  it('should provide the smallest alive opponent ship length', () => {
    expect(manager.getSmallestAliveOpponentShipLength()).toEqual(2);
    manager.opponentShipSunk('ship4');
    expect(manager.getSmallestAliveOpponentShipLength()).toEqual(3);
  });
  it('should reset properly', () => {
    manager.reset();
    expect(manager.getLiveOpponentShipLengths()).toEqual([]);
    expect(manager.getNumberOfOpponentShipsLeft()).toEqual(0);
  });
});
