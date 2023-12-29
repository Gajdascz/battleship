import coordinateTranslator from './coordinateTranslator';

export default function board({ rows = 10, cols = 10, letterAxis = 'row' } = {}) {
  /**
   * Creates RxC grid as a 2-Dimensional array.
   * @param {number} rows - Number of rows in grid.
   * @param {number} cols  - Number of columns in grid.
   * @returns {array} - 2D Array representation of a grid.
   */
  const createGrid = (rows, cols) => Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(null));

  // Grid containing player's ships.
  const _mainGrid = createGrid(rows, cols);

  // Grid containing players outgoing attack results.
  const _trackingGrid = createGrid(rows, cols);

  // Array of player's ships this board contains.
  const _ships = [];

  // Utility function used to return uniform coordinate results.
  const translator = coordinateTranslator(letterAxis);

  /**
   * Checks if the start and end coordinates are in the same row (horizontal).
   * @param {Object} start - The starting coordinates.
   * @param {Object} end - The ending coordinates.
   * @param {number} start.row - The row of the start coordinate.
   * @param {number} end.row - The row of the end coordinate.
   * @returns {boolean} - True if the coordinates are in the same row, false otherwise.
   */
  const isHorizontal = (start, end) => start.row === end.row;

  /**
   * Checks if the given coordinates are within the bounds of the main grid.
   * @param {Object} coords - The coordinates to check.
   * @param {number} coords.row - The row of the coordinates.
   * @param {number} coords.col - The column of the coordinates.
   * @returns {boolean} - True if the coordinates are within bounds, false otherwise.
   */
  const isInBounds = (coords) => coords.row < _mainGrid.length && coords.col < _mainGrid[0].length;

  /**
   * Checks if desired board placement is valid.
   * @param {Object} start - Start of placement coordinates.
   * @param {Object} end - End of placement coordinates.
   * @param {boolean} placementDirection - True if the placement direction is horizontal, false if vertical.
   * @returns {boolean} - True if placement is valid, false if invalid.
   */
  const isPlacementValid = (start, end, placementDirection) => {
    if (!isInBounds(start) || !isInBounds(end)) return false;
    if (placementDirection) {
      for (let i = start.col; i <= end.col; i++) {
        if (_mainGrid[start.row][i] !== null) return false;
      }
    } else {
      for (let i = start.row; i <= end.row; i++) {
        if (_mainGrid[i][start.col] !== null) return false;
      }
    }
    return true;
  };

  /**
   * Places ship object on board and adds it to board's _ships array.
   * @param {Object} placement - Placement object containing the ship and placement coordinates.
   * @param {Object} placement.ship - Ship object being placed on board.
   * @param {coordinate[]} placement.start - Start of placement coordinates [letter,number] or [number,letter] depending on letterAxis.
   * @param {coordinate[]} placement.end - End of placement coordinates [letter,number] or [number,letter] depending on letterAxis.
   * @returns {boolean} - True if placement is successful, False otherwise.
   */
  const place = ({ ship, start, end }) => {
    const _start = translator(start);
    const _end = translator(end);
    const shipCoords = [];
    const placementDirection = isHorizontal(_start, _end);
    if (isPlacementValid(_start, _end, placementDirection)) {
      if (placementDirection) {
        for (let i = _start.col; i <= _end.col; i++) {
          _mainGrid[_start.row][i] = ship;
          shipCoords.push([_start.row, i]);
        }
      } else {
        for (let i = _start.row; i <= _end.row; i++) {
          _mainGrid[i][_start.col] = ship;
          shipCoords.push([i, _start.col]);
        }
      }
    } else return false;

    _ships.push(ship);
    return true;
  };

  /**
   * Process incoming attack and returns result.
   * @param {coordinate[]} coordinates - Attack coordinates [letter,number] or [number,letter] depending on letterAxis.
   * @returns {boolean|-1} - True if a valid ship is hit, false if miss or invalid, -1 if last ship is sunk.
   */
  function incomingAttack(coordinates) {
    const coords = translator(coordinates);
    if (!isInBounds(coords)) return false;
    const gridLoc = _mainGrid[coords.row][coords.col];
    if (gridLoc?.isShip && gridLoc.hit()) {
      if (gridLoc?.isSunk && this.checkShips) return -1;
      else return true;
    } else return false;
  }

  const outgoingAttack = (coordinates) => {
    const coords = translator(coordinates);
    if (!isInBounds(coords)) return false;
    const gridLoc = _trackingGrid[coords.row][coords.col];
  };
  return {
    place,
    incomingAttack,
    get checkShips() {
      return _ships.every((ship) => ship.isSunk);
    }
  };
}
