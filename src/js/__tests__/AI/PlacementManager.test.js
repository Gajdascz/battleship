import { PlacementManager } from '../../components/PlacementManager';
import { it, vi, describe, beforeEach, afterEach, expect } from 'vitest';
import { ORIENTATIONS, STATUSES } from '../../utility/constants/common';

const MockShip = (shipID, shipLength) => {
  const id = shipID;
  const length = shipLength;
  return {
    getID: () => id,
    getLength: () => length
  };
};

describe('PlacementManager', () => {
  let grid;
  const gridSize = 10; // 10x10 grid
  beforeEach(() => {
    grid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => STATUSES.EMPTY)
    );
  });

  it('Should calculate random ship placements without overlap', () => {
    const placementManager = PlacementManager(grid);
    const fleet = [MockShip('ship1', 3), MockShip('ship2', 2)];

    vi.spyOn(global.Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);

    const placements = placementManager.calculateRandomShipPlacements(fleet);

    expect(placements).toHaveLength(fleet.length);
    placements.forEach((placement) => {
      expect(placement.placement.length).toBeGreaterThan(0);
      placement.placement.forEach(([x, y]) => {
        expect(grid[x][y]).toBe(STATUSES.EMPTY); // Check if the original grid was not mutated
      });
    });
  });

  it('Should throw an error for impossible ship placement', () => {
    const placementManager = PlacementManager(grid);
    const largeShip = [MockShip('largeShip', gridSize + 1)];

    expect(() => placementManager.calculateRandomShipPlacements(largeShip)).toThrowError();
  });
});
