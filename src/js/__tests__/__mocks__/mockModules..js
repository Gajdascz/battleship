import { vi } from 'vitest';
import coordinateTranslator from '../../factories/coordinateTranslator';
function createMockShip(length = 999, name = null) {
  return {
    hit: vi.fn().mockImplementation(function () {
      return this.health-- && true;
    }),
    isSunk: false,
    toggleSunk() {
      this.isSunk = !this.isSunk;
    },
    health: length,
    isShip: true,
    name: name
  };
}

function createMockBoard({ rows = 10, cols = 10, letterAxis = 'row' } = {}) {
  const _mainGrid = Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(null));
  const _trackingGrid = Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill(null));
  let _letterAxis = letterAxis;
  const translator = coordinateTranslator(letterAxis);
  return {
    place: vi.fn(function (coords) {
      this.mainGrid[coords[0]][coords[1]] = 'ship';
    }),
    incomingAttack: vi.fn(function (coordinates) {
      if (coordinates[0] < 0 || coordinates[0] >= rows || coordinates[1] < 0 || coordinates[1] >= cols) return false;
      const target = this.mainGrid[coordinates[0]][coordinates[1]];
      if (target === 'ship') {
        this.mainGrid[coordinates[0]][coordinates[1]] = 1;
        return true;
      } else {
        this.mainGrid[coordinates[0]][coordinates[1]] = 0;
        return false;
      }
    }),
    outgoingAttack: vi.fn(function (coordinates, opponentsBoard) {
      const formattedCoords = translator(coordinates);
      console.log(formattedCoords);
      const attackResult = opponentsBoard.incomingAttack([formattedCoords.row, formattedCoords.col]);
      this.trackingGrid[formattedCoords.row][formattedCoords.col] = attackResult ? 1 : 0;
      return attackResult;
    }),
    reset: vi.fn(),
    isBoard: true,
    mainGrid: _mainGrid,
    trackingGrid: _trackingGrid,
    letterAxis: _letterAxis
  };
}

export { createMockShip, createMockBoard };
