import { PLAYERS } from '../../utility/constants/common';
export default function PlayerModel(name = '', id = '') {
  let _name = validateName(name);
  let _type = 'human';
  let _id = id;
  let _board = null;
  const _fleet = [];

  // Prevents users from entering an empty name.
  function validateName(name) {
    if (typeof name !== 'string' || !name.trim()) return PLAYERS.DEFAULT_NAME;
    else return name.trim();
  }

  const addToFleet = (value) => {
    const ships = Array.isArray(value) ? value : [value];
    _fleet.push(...ships);
  };

  return {
    isPlayer: () => true,
    getName: () => _name,
    getID: () => _id,
    getType: () => _type,
    getBoard: () => _board,
    getFleet: () => _fleet,
    setName: (value) => (_name = validateName(value)),
    setType: (value) => (_type = value),
    setID: (value) => (_id = value),
    setBoard: (value) => (_board = value),
    addToFleet
  };
}
