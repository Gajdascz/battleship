export default function board({ rows = 10, cols = 10, letterAxis = 'row' } = {}) {
  if (rows > 26 || cols > 26) throw new Error('Board cannot have more than 25 rows or columns.');
  /**
   * Creates RxC grid as a 2-Dimensional array.
   * @param {number} rows - Number of rows in grid.
   * @param {number} cols  - Number of columns in grid.
   * @returns {array} - 2D Array representation of a grid.
   */
  const createGrid = (rows, cols) => Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(null));

  // Grid containing player's ships.
  let _mainGrid = createGrid(rows, cols);

  // Grid containing players outgoing attack results.
  let _trackingGrid = createGrid(rows, cols);

  let _lastShipSunk = null;

  // Array of player's ships this board contains.
  const _ships = [];

  // Defines which axis is labeled with letters.
  const _letterAxis = letterAxis;

  /**
   * Checks if the start and end coordinates are in the same row (horizontal).
   * @param {Object} start - The starting coordinates.
   * @param {Object} end - The ending coordinates.
   * @param {number} start.row - The row of the start coordinate.
   * @param {number} end.row - The row of the end coordinate.
   * @returns {boolean} - True if the coordinates are in the same row, false otherwise.
   */
  const isHorizontal = (start, end) => start[0] === end[0];

  /**
   * Checks if the given coordinates are within the bounds of the main grid.
   * @param {Object} coords - The coordinates to check.
   * @param {number} coords.row - The row of the coordinates.
   * @param {number} coords.col - The column of the coordinates.
   * @returns {boolean} - True if the coordinates are within bounds, false otherwise.
   */
  const isInBounds = (coordinates) => coordinates[0] < _mainGrid.length && coordinates[1] < _mainGrid[0].length;

  /**
   * Checks if desired board placement is valid.
   * @param {Object} start - Start of placement coordinates.
   * @param {Object} end - End of placement coordinates.
   * @param {boolean} placementDirection - True if the placement direction is horizontal, false if vertical.
   * @returns {boolean} - True if placement is valid, false if invalid.
   */
  const isPlacementValid = (start, end, placementDirection) => {
    console.log(start, end);
    if (!isInBounds(start) || !isInBounds(end)) return false;
    if (placementDirection) {
      for (let i = start[1]; i <= end[1]; i++) {
        if (_mainGrid[start[0]][i] !== null) return false;
      }
    } else {
      for (let i = start[0]; i <= end[0]; i++) {
        if (_mainGrid[i][start[1]] !== null) return false;
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
    const placementDirection = isHorizontal(start, end);
    if (isPlacementValid(start, end, placementDirection)) {
      if (placementDirection) {
        for (let i = start[1]; i <= end[1]; i++) _mainGrid[start[0]][i] = ship;
      } else {
        for (let i = start[0]; i <= end[0]; i++) _mainGrid[i][start[1]] = ship;
      }
    } else return false;

    _ships.push(ship);
    return true;
  };

  /**
   * Process incoming attack and returns result.
   * @param {coordinate[]} coordinates - Attack coordinates [letter,number] or [number,letter] depending on letterAxis.
   * @returns {boolean|1|-1} - True if a valid ship is hit, false if miss or invalid, 1 if ship is sunk, -1 if last ship is sunk.
   */
  function incomingAttack(coordinates) {
    if (!isInBounds(coordinates)) return false;
    const gridLoc = _mainGrid[coordinates[0]][coordinates[1]];
    if (gridLoc?.isShip && gridLoc.hit()) {
      if (gridLoc.isSunk) {
        if (this.allShipsSunk) {
          _lastShipSunk = gridLoc.id;
          return -1;
        } else {
          _lastShipSunk = gridLoc.id;
          return 1;
        }
      } else return true;
    } else return false;
  }

  /**
   * Process outgoing attack and returns result.
   * @param {coordinate[]} coordinates - Attack coordinates [letter,number] or [number,letter] depending on letterAxis.
   * @param {Object} opponentsBoard - Instance of opponents board.
   * @returns {boolean|1|2} - 1 if sunk opponents last ship, 2 if sunk one of opponents ships, true if hit, false if miss.
   */
  const outgoingAttack = (coordinates, opponentsBoard) => {
    if (!isInBounds(coordinates)) return false;
    const attackResult = opponentsBoard.incomingAttack(coordinates);
    if (attackResult === -1) return 1;
    if (attackResult === 1) {
      _trackingGrid[coordinates[0]][coordinates[1]] = 1;
      return 2;
    }
    if (attackResult === true) {
      _trackingGrid[coordinates[0]][coordinates[1]] = 1;
      return true;
    } else {
      _trackingGrid[coordinates[0]][coordinates[1]] = 0;
      return false;
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
