import { PlacementCoordinatesGenerator } from './PlacementCoordinatesGenerator';
import { it, vi, describe, beforeEach, expect } from 'vitest';
import { STATUSES } from '../../../../Utility/constants/common';

describe('PlacementManager', () => {
  let grid;
  let generator;
  const gridSize = 10;
  beforeEach(() => {
    grid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => STATUSES.EMPTY)
    );
    generator = PlacementCoordinatesGenerator(grid);
  });

  it('Should calculate random ship placements without overlap', () => {
    const fleet = [
      { id: 'ship1', length: 3 },
      { id: 'ship2', length: 2 }
    ];

    vi.spyOn(global.Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.2);

    const placements = generator.calculateRandomShipPlacements(fleet);

    expect(placements).toHaveLength(fleet.length);
    placements.forEach((placement) => {
      expect(placement.placement.length).toBeGreaterThan(0);
      placement.placement.forEach(([x, y]) => {
        expect(grid[x][y]).toBe(STATUSES.EMPTY);
      });
    });
  });

  it('Should throw an error for impossible ship placement', () => {
    const largeShip = [{ id: 'largeShip', length: gridSize + 1 }];
    expect(() => generator.calculateRandomShipPlacements(largeShip)).toThrowError();
  });
});
