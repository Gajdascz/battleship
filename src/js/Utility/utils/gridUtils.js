/**
 * Creates a Row x Column grid 2D array.
 *
 * @param {number} rows Number of rows.
 * @param {number} cols Number of columns.
 * @param {*} fill Default values to fill grid with.
 * @returns
 */
const createGrid = (rows, cols, fill) =>
  Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(fill));

/**
 * Checks if a cell's coordinates are within the boundaries of a grid.
 *
 * @param {array[][]} grid The game grid.
 * @param {number[]} coordinates The cells coordinates.
 * @returns {boolean} True if the cell is within grid, false otherwise.
 */
const isWithinGrid = (grid, coordinates) => {
  const bounds = [grid.length, grid[0].length];
  return (
    coordinates[0] >= 0 &&
    coordinates[0] < bounds[0] &&
    coordinates[1] >= 0 &&
    coordinates[1] < bounds[1]
  );
};

/**
 * Creates a deep copy of a 2-dimensional grid.
 *
 * @param {array[number[]]} grid The grid to copy
 * @returns {array[number[]]} A deep copy of the grid.
 */
const copyGrid = (grid) => grid.map((row) => [...row]);

/**
 * Checks if coordinates are at the edge of a grid.
 *
 * @param {array[][]} grid The grid to evaluate.
 * @param {number[]} coordinates The cell's coordinates.
 * @returns {boolean} True if the cell is at edge of grid, false otherwise.
 */
const isAtEdge = (grid, coordinates) =>
  coordinates[0] === 0 ||
  coordinates[1] === 0 ||
  coordinates[0] === grid.length - 1 ||
  coordinates[1] === grid[0].length - 1;

/**
 * Returns status or value at given coordinates.
 *
 * @param {array[][]} grid The grid to evaluate.
 * @param {number[]} coordinates Location of cell within the grid.
 * @returns {null | integer | undefined} The known value at the provided cell.
 */
const getValueAt = (grid, coordinates) => {
  if (isWithinGrid(grid, coordinates)) return grid[coordinates[0]][coordinates[1]];
  return undefined;
};

export { isWithinGrid, copyGrid, isAtEdge, getValueAt, createGrid };
