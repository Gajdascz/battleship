import { PLAYERS } from '../../utility/constants/common';
export const PlayerModel = ({ username = '', playerType, playerID }) => {
  if (!(playerID && typeof playerID === 'string')) throw new Error('Player ID not provided.');
  let name = validateName(username);
  let type = playerType;
  const id = playerID;

  // Prevents users from entering an empty name.
  function validateName(name) {
    if (typeof name !== 'string' || !name.trim()) return PLAYERS.DEFAULT_NAME;
    else return name.trim();
  }

  return {
    isPlayer: () => true,
    getName: () => name,
    getID: () => id,
    getType: () => type,
    setName: (value) => (name = validateName(value)),
    setType: (value) => (type = value)
  };
};
