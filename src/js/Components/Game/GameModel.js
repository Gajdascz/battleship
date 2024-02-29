import { createIdentity } from '../../Utility/utils/createIdentity';

export const GameModel = (gameScope) => {
  const { id, scopedID, scope } = createIdentity({ scope: gameScope, name: 'game' });
  const players = new Map();
  const dataTracker = { numberOfPlacementsFinalized: 0, numberOfFleetsSunk: 0 };
  const playerOrder = [];
  const currentPlayer = { id: null, player: null, index: null };
  let mode = null;

  const isAllPlayerShipsPlaced = () => players.size === dataTracker.numberOfPlacementsFinalized;

  const hasPlayerLost = () => dataTracker.numberOfFleetsSunk > 0;

  const isInProgress = () => !(isAllPlayerShipsPlaced() || hasPlayerLost());

  return {
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    getCurrentPlayerObj: () => currentPlayer.player,
    getCurrentPlayerID: () => currentPlayer.id,
    getGameMode: () => mode,
    addPlayer: (id, player) => players.set(id, player),
    isAllPlayerShipsPlaced,
    hasPlayerLost,
    isInProgress,
    placementFinalized: () => {
      dataTracker.numberOfPlacementsFinalized += 1;
      console.log(dataTracker.numberOfPlacementsFinalized);
    },
    fleetSunk: () => (dataTracker.numberOfFleetsSunk += 1),
    setGameMode: (value) => (mode = value),
    setPlayerOrder: (ids = null) => {
      playerOrder.length = 0;
      if (!ids) players.forEach((player) => playerOrder.push(player));
      else {
        ids.forEach((id) => {
          const player = players.get(id);
          playerOrder.push(player);
        });
      }
      currentPlayer.player = playerOrder[0];
      currentPlayer.index = 0;
      currentPlayer.id = currentPlayer.player.getID();
    },
    moveToNextPlayer: () => {
      const nextIndex = currentPlayer.index + 1;
      if (nextIndex < playerOrder.length) {
        currentPlayer.player = playerOrder[nextIndex];
        currentPlayer.index = nextIndex;
      } else {
        currentPlayer.player = playerOrder[0];
        currentPlayer.index = 0;
        currentPlayer.id = currentPlayer.player.getID();
      }
    },
    reset: () => {
      currentPlayer.player = null;
      currentPlayer.index = null;
      currentPlayer.id = null;
      players.clear();
      dataTracker.numberOfFleetsSunk = 0;
      dataTracker.numberOfPlacementsFinalized = 0;
    }
  };
};
