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

  const areAllPlayerShipsPlaced = () =>
    !(
      playerStates.current.board.isAllShipsPlaced() &&
      playerStates.opponent.board.isAllShipsPlaced()
    );

  const hasPlayerLost = () =>
    playerStates.current.board.isAllShipsSunk() || playerStates.opponent.board.isAllShipsSunk();

  const isInProgress = () => !(areAllPlayerShipsPlaced() || hasPlayerLost());

  return {
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    getCurrentPlayer: () => playerStates.current,
    getOpponentPlayer: () => playerStates.opponent,
    getGameMode: () => mode.current,
    areAllPlayerShipsPlaced,
    hasPlayerLost,
    isInProgress,
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
