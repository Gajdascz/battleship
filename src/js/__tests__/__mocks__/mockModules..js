import { vi } from 'vitest';
import coordinateTranslator from '../../utility/coordinateTranslator';
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

function createMockPlayer(name = 'Mock Player') {
  let _name = name;
  let _wins = 0;
  let _losses = 0;
  let _moves = 0;
  let _board = { outgoingAttack: () => {} };
  let _opponentsBoard = { isBoard: true };
  const _fleet = [];

  return {
    get name() {
      return _name;
    },
    set name(newName) {
      _name = newName;
    },
    get wins() {
      return _wins;
    },
    get losses() {
      return _losses;
    },
    get moves() {
      return _moves;
    },
    get board() {
      return _board;
    },
    get hasOpponentsBoard() {
      return _opponentsBoard.isBoard;
    },
    set board(newBoard) {
      _board = newBoard;
    },
    get fleet() {
      return _fleet;
    },
    set opponentsBoard(newBoard) {
      _opponentsBoard = newBoard;
    },
    get isPlayer() {
      return true;
    },
    addShip: vi.fn((ship) => _fleet.push(ship)),
    removeShip: vi.fn((removeThisShip) => {
      const index = _fleet.findIndex((ship) => ship.name === removeThisShip);
      if (index !== -1) {
        _fleet.splice(index, 1);
        return true;
      }
      return false;
    }),
    won: vi.fn(() => _wins++),
    lost: vi.fn(() => _losses++),
    moved: vi.fn(() => _moves++),
    sendOutgoingAttack: vi.fn((coordinates) => _board.outgoingAttack(coordinates, _opponentsBoard)),
    resetStats: vi.fn(() => {
      _wins = 0;
      _losses = 0;
      _moves = 0;
    }),
    clearFleet: vi.fn(() => {
      _fleet.length = 0;
    })
  };
}

function createMockAI() {
  const ai = createMockPlayer();
  Object.defineProperty(ai, 'isAI', {
    get: function () {
      return true;
    }
  });
  return;
}

export { createMockShip, createMockBoard, createMockPlayer, createMockAI };
