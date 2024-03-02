import { createIdentity } from '../../Utility/utils/createIdentity';

export const GameModel = (gameScope) => {
  const { id, scopedID, scope } = createIdentity({ scope: gameScope, name: 'game' });
  const players = { current: null, waiting: null };
  let mode = null;

  const isAllPlayerShipsPlaced = () =>
    players.current.isAllShipsPlaced() && players.waiting.isAllShipsPlaced();

  const hasPlayerLost = () => players.waiting.isAllShipsSunk() || players.current.isAllShipsSunk();

  return {
    getID: () => id,
    getScopedID: () => scopedID,
    getScope: () => scope,
    getCurrentPlayerObj: () => players.current,
    getCurrentPlayerID: () => players.current.id,
    getWinnerName: () => {
      if (!hasPlayerLost()) return;
      if (players.waiting.isAllShipsSunk()) return players.current.name;
      else return players.waiting.name;
    },
    getGameMode: () => mode,
    setPlayers: (current, waiting) => {
      players.current = current;
      players.waiting = waiting;
    },
    alternatePlayers: () =>
      ([players.current, players.waiting] = [players.waiting, players.current]),
    isAllPlayerShipsPlaced,
    hasPlayerLost,
    setGameMode: (value) => (mode = value),
    reset: () => {
      players.current = null;
      players.waiting = null;
    }
  };
};
