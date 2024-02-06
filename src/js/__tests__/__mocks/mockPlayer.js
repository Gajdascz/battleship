import { vi } from 'vitest';

export default function createMockPlayer(name = 'Player', id = '') {
  let _name = name;
  let _type = 'human';
  let _board = null;
  let _id = id;
  let _opponentsBoard = null;
  const _fleet = [];
  const isValidShip = (ship) => ship && ship.isShip;
  return {
    get name() {
      return _name;
    },
    set name(newName) {
      _name = newName;
    },
    get board() {
      return _board;
    },
    get hasOpponentsBoard() {
      return _opponentsBoard?.isBoard;
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
    get lastOpponentShipSunk() {
      return _opponentsBoard?.lastShipSunk;
    },
    get isPlayer() {
      return true;
    },
    get type() {
      return _type;
    },
    set type(newType) {
      _type = newType;
    },
    get id() {
      return _id;
    },
    set id(newID) {
      _id = newID;
    },
    addShip: vi.fn((ships) => {
      if (isValidShip(ships)) {
        _fleet.push(ships);
        return true;
      }
      if (Array.isArray(ships)) {
        ships.forEach((ship) => {
          if (!isValidShip(ship)) return false;
        });
        _fleet.push(...ships);
        return true;
      }
      return false;
    }),
    sinkFleet: vi.fn(() => {
      _fleet.forEach((ship) => {
        if (!ship.isSunk) ship.toggleSunk();
      });
    }),
    removeShip: vi.fn((removeThisShip) => {
      const index = _fleet.findIndex((ship) => ship.name === removeThisShip);
      if (index !== -1) {
        _fleet.splice(index, 1);
        return true;
      }
      return false;
    }),
    sendOutgoingAttack: vi.fn((coordinates) => _board.outgoingAttack(coordinates, _opponentsBoard)),
    clearFleet: vi.fn(() => {
      _fleet.length = 0;
    }),
    opponentsBoardIsReferenceTo: vi.fn((board) => board === _opponentsBoard)
  };
}
