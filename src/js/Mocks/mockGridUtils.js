import { vi } from 'vitest';

const STATUSES = {
  MISS: 'miss',
  HIT: 'hit',
  SHIP_SUNK: 'ship_sunk',
  ALL_SHIPS_SUNK: 'all_ships_sunk',
  UNEXPLORED: 'unexplored',
  OCCUPIED: 'occupied',
  EMPTY: 'empty'
};

const DIRECTIONS = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1]
};

const sumCoordinates = vi.fn((c1, c2) => {
  const [x1, y1] = c1;
  const [x2, y2] = c2;
  return [x1 + x2, y1 + y2];
});

const createGrid = vi.fn((rows, cols, fill = null) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ status: fill })))
);

const isWithinGrid = vi.fn((grid, coordinates) => {
  const bounds = [grid.length, grid[0].length];
  return (
    coordinates[0] >= 0 &&
    coordinates[0] < bounds[0] &&
    coordinates[1] >= 0 &&
    coordinates[1] < bounds[1]
  );
});

const copyGrid = vi.fn((grid) => grid.map((row) => [...row]));

const isAtEdge = vi.fn(
  (grid, coordinates) =>
    coordinates[0] === 0 ||
    coordinates[1] === 0 ||
    coordinates[0] === grid.length - 1 ||
    coordinates[1] === grid[0].length - 1
);

const getValueAt = vi.fn((grid, coordinates) => {
  if (isWithinGrid(grid, coordinates)) return grid[coordinates[0]][coordinates[1]];
  return undefined;
});
const getCellStatusAt = vi.fn((grid, coordinates) => {
  const cellValue = getValueAt(grid, coordinates);
  if (cellValue) return cellValue.status;
  return undefined;
});

const getCellInADirection = vi.fn((grid, coordinates, direction) => {
  let vector = direction;
  if (typeof vector === 'string') vector = DIRECTIONS[vector.toUpperCase()];

  const result = sumCoordinates(vector, coordinates);
  return isWithinGrid(grid, result) ? result : undefined;
});

const getCellsInAllDirections = vi.fn((grid, coordinates) => {
  const cellsAround = [];
  for (const direction of Object.keys(DIRECTIONS)) {
    const cellInDirection = getCellInADirection(grid, coordinates, direction);
    if (cellInDirection) cellsAround.push(cellInDirection);
  }
  return cellsAround;
});

const getOpenMovesAround = vi.fn((grid, coordinates) =>
  getCellsInAllDirections(grid, coordinates).filter(
    (coordinates) => getValueAt(grid, coordinates).status === STATUSES.UNEXPLORED
  )
);

const getTypeOfCellInADirection = vi.fn(({ grid, start, direction, type }) => {
  const cellsOfType = [];
  let nextCell = sumCoordinates(start, direction);
  while (getValueAt(grid, nextCell).status === type) {
    cellsOfType.push(nextCell);
    nextCell = sumCoordinates(nextCell, direction);
  }
  return cellsOfType;
});

export {
  createGrid,
  isWithinGrid,
  copyGrid,
  isAtEdge,
  getValueAt,
  getCellStatusAt,
  getCellInADirection,
  getCellsInAllDirections,
  getOpenMovesAround,
  getTypeOfCellInADirection,
  STATUSES,
  DIRECTIONS
};
