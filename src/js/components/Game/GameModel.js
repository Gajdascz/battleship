import { STATUSES } from '../../utility/constants/common';

export const GameModel = () => {
  const _players = { current: null, opponent: null };
  return {
    switchCurrentPlayer: () =>
      ([_players.current, _players.opponent] = [_players.opponent, _players.current]),
    getCurrentState: () => _current.state,
    setCurrentState: (value) => (_current.state = value)
  };
};
