export const TrackingGridModel = () => {
  if (rows > 26 || cols > 26) throw new Error('Board cannot have more than 25 rows or columns.');

  /**
   * Initializes a Row x Column grid.
   *
   * @param {number} rows Number of rows in grid.
   * @param {number} cols Number of columns in grid.
   * @returns {array} 2D Array representation of a grid.
   */
  const createGrid = (rows, cols) =>
    Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(RESULTS.UNEXPLORED));

  const _trackingGrid = createGrid(rows, cols);

  // Defines which axis is labeled with letters.
  const _letterAxis = letterAxis;

  /**
   * Sets cell to value in grid.
   * Helper function for processing attack results.
   *
   * @param {number[]} coordinates Coordinates of cell to add value to.
   * @param {boolean | number} value Value to add to cell.
   */
  const setCellValue = (grid, coordinates, value) => {
    grid[coordinates[0]][coordinates[1]] = value;
  };

  /**
   * Processes outgoing attacks from this board.
   *
   * @param {number[]} coordinates Coordinates of cell to send attack to.
   * @param {Object} opponentsBoard Instance of opponents board.
   * @returns {boolean | number} The result of the outgoing attack.
   * The results pertain to this board's tracking grid.
   */
  const outgoingAttack = (coordinates, opponentsBoard) => {
    if (!isInBounds(coordinates)) return false;
    const attackResult = opponentsBoard.incomingAttack(coordinates);
    switch (attackResult) {
      case RESULTS.ALL_SHIPS_SUNK:
        return RESULTS.ALL_SHIPS_SUNK;
      case RESULTS.SHIP_SUNK:
        setCellValue(_trackingGrid, coordinates, RESULTS.HIT);
        return RESULTS.SHIP_SUNK;
      case RESULTS.HIT:
        setCellValue(_trackingGrid, coordinates, RESULTS.HIT);
        return RESULTS.HIT;
      case RESULTS.MISS:
        setCellValue(_trackingGrid, coordinates, RESULTS.MISS);
        return RESULTS.MISS;
    }
  };

  return {
    place,
    incomingAttack,
    outgoingAttack,
    get allShipsSunk() {
      return _ships.every((ship) => ship.isSunk);
    },
    get placedShips() {
      return _ships.length;
    },
    get mainGrid() {
      return _mainGrid;
    },
    get trackingGrid() {
      return _trackingGrid;
    },
    get letterAxis() {
      return _letterAxis;
    },
    get isBoard() {
      return true;
    },
    get lastShipSunk() {
      return _lastShipSunk;
    },
    reset() {
      _ships.length = 0;
      _mainGrid = createGrid(_mainGrid.length, _mainGrid[0].length);
      _trackingGrid = createGrid(_mainGrid.length, _mainGrid[0].length);
      _lastShipSunk = null;
    }
  };
};
