export const GameModel = () => {
  const _players = {
    p1: { model: null, board: null, fleet: null },
    p2: { model: null, board: null, fleet: null }
  };
  const _playerStates = { current: _players.p1, opponent: _players.p2 };
  const _state = { current: null };
  const _mode = { current: null };
  return {
    getCurrentPlayer: () => _playerStates.current,
    getOpponentPlayer: () => _playerStates.opponent,
    getState: () => _state.current,
    getGameMode: () => _mode.current,
    setP1: (playerModel, mainGridModel, trackingGridModel, fleetModel) => {
      _players.p1.model = playerModel;
      _players.p1.board = { mainGrid: mainGridModel, trackingGrid: trackingGridModel };
      _players.p1.fleet = fleetModel;
    },
    setP2: (playerModel, mainGridModel, trackingGridModel, fleetModel) => {
      _players.p2.model = playerModel;
      _players.p2.board = { mainGrid: mainGridModel, trackingGrid: trackingGridModel };
      _players.p2.fleet = fleetModel;
    },
    setState: (value) => (_state.current = value),
    setGameMode: (value) => (_mode.current = value),
    switchCurrentPlayer: () => {
      const currentPlayer = _playerStates.current;
      _playerStates.current = _playerStates.opponent;
      _playerStates.opponent = currentPlayer;
    }
  };
};
