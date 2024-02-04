import { vi, describe, expect, it, beforeEach } from 'vitest';
import { RESULTS } from '../../../utility/constants';
import { weightedCanShipFit } from '../../../logic/ai/advanced/strategies/weightedCanShipFit';

import {
  getCellInADirection,
  getValueAt,
  getOpenMovesAround,
  getOpenMovesInADirection,
  getConsecutiveHitsInADirection
} from '../../../logic/ai/utilities/gridHelpers';

import { getOrientationDirections } from '../../../logic/ai/utilities/coordinatesHelpers';
const createGrid = (rows, cols) =>
  Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(RESULTS.UNEXPLORED));

const wrap = (helper) => {
  helper.resolved = new Set();
  helper.getValueAt = (coordinates) => getValueAt(helper.grid, coordinates);

  helper.getCellInADirection = (coordinates, direction) =>
    getCellInADirection(helper.grid, coordinates, direction);

  helper.getOpenMovesInADirection = (coordinates, direction) =>
    getOpenMovesInADirection(helper.grid, coordinates, direction);

  helper.getOpenMovesAround = (coordinates) => getOpenMovesAround(helper.grid, coordinates);

  helper.getTotalConsecutiveUnresolvedHitsInADirection = (start, direction) => {
    const adjacentUnresolved = [];
    const consecutiveHits = getConsecutiveHitsInADirection(helper.grid, start, direction);
    for (const hit of consecutiveHits) {
      if (!helper.isHitResolved(hit)) adjacentUnresolved.push(hit);
      else break;
    }
    return adjacentUnresolved.length;
  };
  helper.getOrientationDirections = (orientation) => getOrientationDirections(orientation);
  helper.isHitResolved = (hit) => helper.resolved.has(hit?.join(','));

  helper.getTheoreticalMaximum = () => vi.fn().mockReturnValue(11);
};

const helper = { grid: createGrid(10, 10) };
wrap(helper);
beforeEach(() => {
  helper.grid = createGrid(10, 10);
  helper.resolved.clear();
});
const populateRow = (row, result) => row.map((col) => (col = RESULTS[result]));
// Mocking the helper functions and constants
const mockGetValueAt = vi.fn();
const mockGetCellInADirection = vi.fn();
const mockGetOrientationDirections = vi.fn();
const mockIsHitResolved = vi.fn();

// Reset mocks before each test to ensure clean state
beforeEach(() => {
  vi.clearAllMocks();
});
describe('weightedCanShipFit function', () => {
  it('should return 0 when no ship can fit', () => {
    // Setup
    mockGetValueAt.mockImplementation(() => 'MISS'); // Assuming 'MISS' is the value for missed shots
    mockGetCellInADirection.mockImplementation(() => null); // Simulate no further cells
    mockGetOrientationDirections.mockImplementation(() => ({ UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3 }));
    mockIsHitResolved.mockImplementation(() => false);

    // Execute
    const result = weightedCanShipFit({
      getValueAt: mockGetValueAt,
      getCellInADirection: mockGetCellInADirection,
      getOrientationDirections: mockGetOrientationDirections,
      isHitResolved: mockIsHitResolved,
      start: [0, 0], // Starting cell
      smallestShipLength: 3,
      theoreticalMaximum: 10 // Example theoretical maximum
    });

    // Assert
    expect(result).toEqual(0);
  });

  it('should return a non-zero score when a ship can fit in at least one direction', () => {
    // Setup for a scenario where a ship can fit
    let callCount = 0;
    mockGetValueAt.mockImplementation(
      (cell) => (callCount++ < 3 ? 'UNEXPLORED' : 'MISS') // Simulate space for a ship to fit
    );
    mockGetCellInADirection.mockImplementation((start, direction) => [
      start[0] + direction,
      start[1] + direction
    ]);
    mockGetOrientationDirections.mockImplementation(() => ({ UP: -1, DOWN: 1 }));
    mockIsHitResolved.mockImplementation(() => false);

    // Execute
    const result = weightedCanShipFit({
      getValueAt: mockGetValueAt,
      getCellInADirection: mockGetCellInADirection,
      getOrientationDirections: mockGetOrientationDirections,
      isHitResolved: mockIsHitResolved,
      start: [0, 0],
      smallestShipLength: 3,
      theoreticalMaximum: 10
    });

    // Assert
    expect(result).toBeGreaterThan(0);
  });

  // Add more test cases as needed to cover different scenarios,
  // including different ship lengths, orientations, and cell states.
});
