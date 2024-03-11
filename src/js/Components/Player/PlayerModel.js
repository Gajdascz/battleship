import { PLAYERS } from '../../Utility/constants/common';
export const PlayerModel = ({ playerName = '', playerType, playerId }) => {
  if (!(playerId && typeof playerId === 'string')) throw new Error('Player ID not provided.');
  let name = validateName(playerName);
  let type = playerType;
  const id = playerId;

  // Prevents users from entering an empty name.
  function validateName(name) {
    if (typeof name !== 'string' || !name.trim()) return PLAYERS.DEFAULT_NAME;
    else return name.trim();
  }
  return {
    id,
    isPlayer: () => true,
    getName: () => name,
    getId: () => id,
    getType: () => type,
    setName: (value) => (name = validateName(value)),
    setType: (value) => (type = value)
  };
};
