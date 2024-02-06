import { RESULTS } from '../../../utility/constants';

/**
 * @module Board.js
 * This module creates a configurable board object for the classic game of Battleship.
 * It supports dynamic board sizes, ship placement, attack processing, and tracking game state.
 * The board object provides methods for placing ships, handling incoming and outgoing attacks, and querying the game state.
 * It supports customization through board options, including dimensions and axis labeling.
 *
 * Uses the RESULTS constants for managing attacks and game state:
 *  - HIT: true
 *  - MISS: false
 *  - SHIP_SUNK: 1
 *  - ALL_SHIPS_SUNK: -1
 *  - UNEXPLORED: null
 */

/**
 * Creates a board for the game of Battleship based on provided settings.
 *
 * @param {object} boardOptions - Configuration settings for the board,
 *                                including rows (up to 25), columns (up to 25),
 *                                and whether the row or column axis uses letters.
 * @returns {object} A board object with methods and properties for game operations, including
 *                   ship placement, attack processing, and state tracking.
 */
export default function createBoard({ rows = 10, cols = 10, letterAxis = 'row' } = {}) {
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

  // Grid containing player's ships.
  let _mainGrid = createGrid(rows, cols);

  // Grid containing players outgoing attack results.
  let _trackingGrid = createGrid(rows, cols);

  // Last ship sunk on this board.
  let _lastShipSunk = null;

  // Array of player's ships this board contains.
  const _ships = [];

  // Defines which axis is labeled with letters.
  const _letterAxis = letterAxis;

  /**
   * Determines ship orientation for placement validation.
   *
   * @param {Object} start The starting coordinates.
   * @param {Object} end The ending coordinates.
   * @returns {boolean} True if the coordinates are in the corresponding orientation.
   */
  const isHorizontal = (start, end) => start[0] === end[0];
  const isVertical = (start, end) => start[1] === end[1];

  /**
   * Validates coordinate bounds.
   *
   * @param {number[]} coordinates The cell coordinates to check.
   * @returns {boolean} True if the coordinates are within bounds, false otherwise.
   */
  const isInBounds = (coordinates) =>
    coordinates[0] >= 0 &&
    coordinates[0] < _mainGrid.length &&
    coordinates[1] >= 0 &&
    coordinates[1] < _mainGrid[0].length;

  /**
   * Validates ship placement.
   *
   * @param {Object} start Start of placement coordinates.
   * @param {Object} end End of placement coordinates.
   * @param {boolean} placementDirection True if the placement is horizontal, false otherwise.
   * @returns {boolean} True if placement is valid, false if invalid.
   */
  const isPlacementValid = (start, end, placementDirection, shipLength) => {
    const placementLength = [end[0] - start[0], end[1] - start[1]];
    const hasValidLength = placementLength.includes(shipLength - 1);
    const isDiagonal = !(isHorizontal(start, end) || isVertical(start, end));
    if (!isInBounds(start) || !isInBounds(end) || !hasValidLength || isDiagonal) return false;
    if (placementDirection) {
      for (let i = start[1]; i <= end[1]; i++) {
        if (_mainGrid[start[0]][i] !== RESULTS.UNEXPLORED) return false;
      }
    } else {
      for (let i = start[0]; i <= end[0]; i++) {
        if (_mainGrid[i][start[1]] !== RESULTS.UNEXPLORED) return false;
      }
    }
    return true;
  };

  /**
   * Places a ship on the board's main grid.
   *
   * @param {Object} placement Placement object containing the ship and placement coordinates.
   * @param {Object} placement.ship Ship object being placed on board.
   * @param {number[]} placement.start Coordinate for the first cell a placement occupies.
   * @param {coordinate[]} placement.end Coordinates for the last cell a placement occupies.
   * @returns {boolean} True if placement is successful, false otherwise.
   */
  const place = ({ ship, start, end }) => {
    const placementDirection = isHorizontal(start, end);
    if (isPlacementValid(start, end, placementDirection, ship.length)) {
      if (isHorizontal(start, end)) {
        for (let i = start[1]; i <= end[1]; i++) _mainGrid[start[0]][i] = ship;
      } else {
        for (let i = start[0]; i <= end[0]; i++) _mainGrid[i][start[1]] = ship;
      }
    } else return false;

    _ships.push(ship);
    return true;
  };

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
   * Processes incoming attacks to this board.
   *
   * @param {number[]} coordinates - Coordinates of cell to send attack to.
   * @returns {boolean | SHIP_SUNK | ALL_SHIPS_SUNK} - The result of the incoming attack to this board.
   * The results pertain to ships and cells within this board's main grid.
   */
  function incomingAttack(coordinates) {
    if (!isInBounds(coordinates)) return false;
    const gridCell = _mainGrid[coordinates[0]][coordinates[1]];
    if (gridCell?.isShip && gridCell.hit()) {
      setCellValue(_mainGrid, coordinates, RESULTS.HIT);
      if (gridCell.isSunk) {
        _lastShipSunk = gridCell.id;
        if (this.allShipsSunk) return RESULTS.ALL_SHIPS_SUNK;
        else return RESULTS.SHIP_SUNK;
      } else return RESULTS.HIT;
    } else return RESULTS.MISS;
  }

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
}
