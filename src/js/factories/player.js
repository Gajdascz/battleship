export default function createPlayer(name = '') {
  let _name = validateName(name);
  let _wins = 0;
  let _losses = 0;
  let _moves = 0;
  let _board = null;
  let _fleet = [];
  let _opponentsBoard = null;
  function validateName(name) {
    if (typeof name !== 'string' || !name.trim()) return 'mutinous';
    else return name.trim();
  }

  const won = () => _wins++;
  const lost = () => _losses++;
  const moved = () => _moves++;

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
    addShip,
    removeShip,
    won,
    lost,
    moved,
    sendOutgoingAttack(coordinates) {
      return _board.outgoingAttack(coordinates, _opponentsBoard);
    },
    resetStats() {
      _wins = 0;
      _losses = 0;
      _moves = 0;
    }
  };
}
