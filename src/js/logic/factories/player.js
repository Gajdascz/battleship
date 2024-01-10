export default function createPlayer(name = '', type = 'human', id = '') {
  let _name = validateName(name);
  let _moves = 0;
  let _board = null;
  let _type = type;
  let _id = id;
  const _fleet = [];
  let _opponentsBoard = null;

  function validateName(name) {
    if (typeof name !== 'string' || !name.trim()) return 'Mutinous';
    else return name.trim();
  }
  const addShip = (ships) => {
    if (Array.isArray(ships)) {
      ships.forEach((ship) => _fleet.push(ship));
    } else _fleet.push(ships);
  };

  const removeShip = (removeThisShip) => {
    _fleet.forEach((ship, index) => {
      if (ship.name === removeThisShip) {
        _fleet.splice(index, 1);
        return true;
      }
    });
    return false;
  };

  return {
    get name() {
      return _name;
    },
    set name(newName) {
      _name = validateName(newName);
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
    addShip,
    removeShip,
    moved() {
      _moves++;
    },
    sendOutgoingAttack(coordinates) {
      return _board.outgoingAttack(coordinates, _opponentsBoard);
    },
    resetStats() {
      _moves = 0;
    },
    clearFleet() {
      this.fleet.length = 0;
    }
  };
}
