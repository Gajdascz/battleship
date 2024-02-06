import { vi } from 'vitest';
const MISS = false;
const HIT = true;
const SHIP_SUNK = 1;
const ALL_SHIPS_SUNK = -1;
const UNEXPLORED = null;
export default function createMockBoard({ rows = 10, cols = 10, letterAxis = 'row' } = {}) {
  const constructGrid = (rows, cols) =>
    Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(UNEXPLORED));
  let _mainGrid = Array.from({ length: rows }).map(() =>
    Array.from({ length: cols }).fill(UNEXPLORED)
  );
  let _trackingGrid = Array.from({ length: rows }).map(() =>
    Array.from({ length: cols }).fill(null)
  );
  let _letterAxis = letterAxis;
  let _ships = [];
  let _lastShipSunk = null;
  const resetGrids = () => {
    _mainGrid = constructGrid(rows, cols);
    _trackingGrid = constructGrid(rows, cols);
  };

  const isInBounds = vi.fn(function (coordinates) {
    const rows = _mainGrid.length;
    const cols = _mainGrid[0].length;
    return (
      coordinates[0] >= 0 && coordinates[0] < rows && coordinates[1] >= 0 && coordinates[1] < cols
    );
  });
  const isHorizontal = vi.fn(function (coordinatesOne, coordinatesTwo) {
    return coordinatesOne[0] === coordinatesTwo[0];
  });

  const place = vi.fn(function ({ ship = 'ship', start = [0, 0], end = [0, 0] } = {}) {
    const isHorizontalResult = isHorizontal(start, end);
    const isValidPlacement = (start, end) => {
      if (!isInBounds(start) || !isInBounds(end)) return false;
      if (isHorizontalResult) {
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
    if (isValidPlacement(start, end)) {
      if (isHorizontalResult) {
        for (let i = start[1]; i <= end[1]; i++) _mainGrid[start[0]][i] = ship;
      } else {
        for (let i = start[0]; i <= end[0]; i++) _mainGrid[i][start[1]] = ship;
      }
      _ships.push(ship);
      return true;
    } else {
      return false;
    }
  });

  const incomingAttack = vi.fn(function (coordinates) {
    if (
      coordinates[0] < 0 ||
      coordinates[0] >= rows ||
      coordinates[1] < 0 ||
      coordinates[1] >= cols
    ) {
      return false;
    }
    const target = _mainGrid[coordinates[0]][coordinates[1]];
    if (target?.isShip && target.hit()) {
      _mainGrid[coordinates[0]][coordinates[1]] = HIT;
      if (target.isSunk) return SHIP_SUNK;
      else return HIT;
    } else {
      _mainGrid[coordinates[0]][coordinates[1]] = MISS;
      return false;
    }
  });

  const outgoingAttack = vi.fn(function (coordinates, opponentsBoard) {
    if (
      coordinates[0] < 0 ||
      coordinates[0] >= rows ||
      coordinates[1] < 0 ||
      coordinates[1] >= cols
    ) {
      return false;
    }
    const attackResult = opponentsBoard.incomingAttack(coordinates);
    _trackingGrid[coordinates[0]][coordinates[1]] = attackResult ? HIT : MISS;

    return attackResult;
  });

  return {
    isInBounds,
    isHorizontal,
    place,
    incomingAttack,
    outgoingAttack,
    get allShipsSunk() {
      return _ships.every((ship) => ship.isSunk);
    },
    isBoard: true,
    mainGrid: _mainGrid,
    trackingGrid: _trackingGrid,
    letterAxis: _letterAxis,
    get lastShipSunk() {
      return _lastShipSunk;
    },
    setLastShipSunk(ship) {
      _lastShipSunk = ship;
    },
    getRows: () => _mainGrid.length,
    getCols: () => _mainGrid[0].length,
    reset() {
      _ships.length = 0;
      _lastShipSunk = null;
      resetGrids();
    },
    get placedShips() {
      return _ships.length;
    }
  };
}
