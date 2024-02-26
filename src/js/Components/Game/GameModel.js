import { STATES } from '../../Utility/constants/common';
import { createIdentity } from '../../Utility/utils/createIdentity';

export const GameModel = (gameScope) => {
  const { id, scopedID, scope } = createIdentity({ scope: gameScope, name: 'game' });
  const players = {
    p1: { id: null, model: null, board: null },
    p2: { id: null, model: null, board: null }
  };
  const playerStates = { current: players.p1, opponent: players.p2 };
  const state = { current: STATES.START };
  const mode = { current: null };
  const fleetPlacementStatus = {};

  const isAllPlayerShipsPlaced = () =>
    fleetPlacementStatus[players.p1.id] && fleetPlacementStatus[players.p2.id];

  const hasPlayerLost = () =>
    playerStates.current.board.isAllShipsSunk() || playerStates.opponent.board.isAllShipsSunk();

  const isInProgress = () => !(isAllPlayerShipsPlaced() || hasPlayerLost());

  return {
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    getCurrentPlayer: () => playerStates.current,
    getOpponentPlayer: () => playerStates.opponent,
    getCurrentPlayerID: () => playerStates.current.model.getID(),
    getCurrentPlayerName: () => playerStates.current.model.getName(),
    getWaitingPlayerName: () => playerStates.opponent.model.getName(),
    getGameMode: () => mode.current,
    setCurrentPlayerPlacementStatus: (status) =>
      (fleetPlacementStatus[playerStates.current.id] = status),
    setOpponentPlayerPlacementStatus: (status) =>
      (fleetPlacementStatus[playerStates.opponent.id] = status), // Used for setting AI placement automatically
    isAllPlayerShipsPlaced,
    hasPlayerLost,
    isInProgress,
    setP1: ({ id, playerModel, boardController }) => {
      players.p1.id = id;
      players.p1.model = playerModel;
      players.p1.board = boardController;
      fleetPlacementStatus[id] = false;
    },
    setP2: ({ id, playerModel, boardController }) => {
      players.p2.id = id;
      players.p2.model = playerModel;
      players.p2.board = boardController;
      fleetPlacementStatus[id] = false;
    },
    setGameMode: (value) => (mode.current = value),
    switchCurrentPlayer: () => {
      const currentPlayer = playerStates.current;
      playerStates.current = playerStates.opponent;
      playerStates.opponent = currentPlayer;
      return playerStates.current;
    }
  };
};
