import { AvailableMovesManager } from './AvailableMovesManager';

export const AIModel = ({
  id,
  aiName,
  difficulty,
  fleetModel,
  mainGridModel,
  trackingGridModel
}) => {
  const name = aiName;
  const type = 'ai';
  const mainGrid = mainGridModel;
  const trackingGrid = trackingGridModel;
  const fleet = fleetModel;
  const movesManager = AvailableMovesManager();

  return {
    properties: {
      id,
      getType: () => type,
      getName: () => name,
      isAI: () => true,
      getDifficulty: () => difficulty
    },
    mainGrid: {
      get: () => mainGrid.getMainGrid(),
      place: (id, start, end) => mainGrid.placeShip(id, start, end),
      processIncomingAttack: (coordinates) => mainGrid.processIncomingAttack(coordinates)
    },
    trackingGrid: {
      get: () => trackingGrid.getTrackingGrid(),
      setCellStatus: (coordinates, result) => trackingGrid.setCellStatus(coordinates, result)
    },
    fleet: {
      getData: () => fleet.getAIFleetData(),
      getShip: (id) => fleet.getShipFromAIFleet(id),
      setShipPlacementCoordinates: (id, coordinates) =>
        fleet.setShipPlacementCoordinates(id, coordinates),
      isAllShipsSunk: () => fleet.isAllShipsSunk(),
      isAllShipsPlaced: () => fleet.isAllShipsPlaced()
    },
    moves: {
      initialize: () => movesManager.initializeAvailableMoves(trackingGrid.getTrackingGrid()),
      getAllAvailable: () => movesManager.getAvailableMoves(),
      getMove: (coordinates) => movesManager.getMove(coordinates),
      getTotalAvailable: () => movesManager.getTotalAvailableMoves(),
      getRandomMove: () => movesManager.getRandomMove(),
      popMove: (coordinates) => movesManager.popMove(coordinates),
      popRandomMove: () => movesManager.popRandomMove(),
      reset: () => movesManager.reset()
    },
    reset: () => {
      trackingGrid.reset();
      mainGrid.reset();
      fleet.reset();
      movesManager.reset();
    }
  };
};
