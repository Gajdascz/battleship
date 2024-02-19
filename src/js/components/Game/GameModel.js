import { STATES } from '../../utility/constants/common';
import { createIdentity } from '../../utility/utils/createIdentity';

export const GameModel = (gameScope) => {
  const { id, scopedID, scope } = createIdentity({ scope: gameScope, name: 'game' });
  const players = {
    p1: { model: null, board: null },
    p2: { model: null, board: null }
  };
  const playerStates = { current: players.p1, opponent: players.p2 };
  const state = { current: STATES.START };
  const mode = { current: null };

  const isPlacementState = () =>
    !(
      playerStates.current.board.isAllShipsPlaced() &&
      playerStates.opponent.board.isAllShipsPlaced()
    );

  const isOverState = () =>
    playerStates.current.board.isAllShipsSunk() || playerStates.opponent.board.isAllShipsSunk();

  const isProgressState = () => !(isPlacementState() || isOverState());

  const getCurrentState = () => {
    if (state.current === STATES.START);
    else if (isPlacementState()) state.current = STATES.PLACEMENT;
    else if (isProgressState()) state.current = STATES.PROGRESS;
    else if (isOverState()) state.current = STATES.OVER;
    return state.current;
  };

  return {
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    getCurrentPlayer: () => playerStates.current,
    getOpponentPlayer: () => playerStates.opponent,
    getCurrentState,
    getGameMode: () => mode.current,
    setP1: ({ playerModel, boardController }) => {
      players.p1.model = playerModel;
      players.p1.board = boardController;
    },
    setP2: ({ playerModel, boardController }) => {
      players.p2.model = playerModel;
      players.p2.board = boardController;
    },
    setGameMode: (value) => (mode.current = value),
    switchCurrentPlayer: () => {
      const currentPlayer = playerStates.current;
      playerStates.current = playerStates.opponent;
      playerStates.opponent = currentPlayer;
    }
  };
};
