import { AvailableMovesManager } from './AvailableMovesManager';

export const AIModel = ({ aiName, difficulty, fleetModel, mainGridModel, trackingGridModel }) => {
  const name = aiName;
  const id = 'ai';
  const type = 'ai';
  const mainGrid = mainGridModel;
  const trackingGrid = trackingGridModel;
  const fleet = fleetModel;
  const movesManager = AvailableMovesManager();

  return {
    properties: {
      getName: () => name,
      getID: () => id,
      getType: () => type,
      isAI: () => true,
      getDifficulty: () => difficulty
    },
    mainGrid: {
      get: () => mainGrid.getMainGrid(),
      place: (id, start, end) => mainGrid.placeShip(id, start, end),
      processIncomingAttack: (x, y) => mainGrid.processIncomingAttack(x, y)
    },
    fleet: {
      getData: () => fleet.getAIFleetData(),
      setShipPlacementCoordinates: (id, placement) => {
        const ship = fleet.getShipFromAIFleet(id);
        ship.setPlacedCoordinates(placement);
      },
      isAllShipsSunk: () => fleet.isAllShipsSunk(),
      isAllShipsPlaced: () => fleet.isAllShipsPlaced()
    },
    moves: {
      initialize: () => movesManager.initializeAvailableMoves(trackingGrid),
      getAllAvailable: () => movesManager.getAvailableMoves(),
      get: (coordinates) => movesManager.getMove(coordinates),
      getTotalAvailable: () => movesManager.getTotalAvailableMoves(),
      getRandomMove: () => movesManager.getRandomMove()
    }
  };
};
