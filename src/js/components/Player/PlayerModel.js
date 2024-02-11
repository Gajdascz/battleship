import { PLAYERS } from '../../utility/constants/common';
export const PlayerModel = ({ name = '', id = '' }) => {
  let _name = validateName(name);
  let _type = 'human';
  let _id = id;

  // Prevents users from entering an empty name.
  function validateName(name) {
    if (typeof name !== 'string' || !name.trim()) return PLAYERS.DEFAULT_NAME;
    else return name.trim();
  }

  return {
    isPlayer: () => true,
    getName: () => _name,
    getID: () => _id,
    getType: () => _type,
    setName: (value) => (_name = validateName(value)),
    setType: (value) => (_type = value),
    setID: (value) => (_id = value)
  };
};
