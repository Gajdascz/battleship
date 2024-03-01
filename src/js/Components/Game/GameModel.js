import { createIdentity } from '../../Utility/utils/createIdentity';

export const GameModel = (gameScope) => {
  const { id, scopedID, scope } = createIdentity({ scope: gameScope, name: 'game' });
  const players = new Map();
  const playerOrder = [];
  const currentPlayer = { player: null, index: null };
  let mode = null;

  const isAllPlayerShipsPlaced = () =>
    [...players.values()].every((player) => player.isAllShipsPlaced());

  const hasPlayerLost = () => {
    for (const player of players.values()) {
      if (player.isAllShipsSunk()) return player.name;
    }
    return false;
  };

  const isInProgress = () => !(isAllPlayerShipsPlaced() || hasPlayerLost());

  return {
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    getCurrentPlayerObj: () => currentPlayer.player,
    getCurrentPlayerID: () => currentPlayer.player.id,
    getGameMode: () => mode,
    addPlayer: (player) => players.set(player.id, player),
    isAllPlayerShipsPlaced,
    hasPlayerLost,
    isInProgress,
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
      const player = playerOrder[0];
      currentPlayer.player = player;
      currentPlayer.index = 0;
    },
    moveToNextPlayer: () => {
      const nextIndex = currentPlayer.index + 1;
      if (nextIndex < playerOrder.length) {
        const player = playerOrder[nextIndex];
        currentPlayer.player = player;
        currentPlayer.index = nextIndex;
      } else {
        const player = playerOrder[0];
        currentPlayer.player = player;
        currentPlayer.index = 0;
      }
      console.log(currentPlayer);
    },
    reset: () => {
      currentPlayer.player = null;
      currentPlayer.index = null;
      players.clear();
    }
  };
};
