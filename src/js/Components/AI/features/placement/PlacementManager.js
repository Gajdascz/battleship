import { PlacementCoordinatesGenerator } from './PlacementCoordinatesGenerator';

export const PlacementManager = ({
  mainGrid,
  placeOnGrid,
  fleetData,
  placeShip,
  isAllShipsPlaced,
  placementCoordinator
}) => {
  const { BASE_METHODS } = placementCoordinator;
  const callStartTurn = () => placementCoordinator.call(BASE_METHODS.START_TURN);
  const callEndTurn = () => placementCoordinator.call(BASE_METHODS.END_TURN);
  const callIsOver = () => placementCoordinator.call(BASE_METHODS.IS_OVER);
  placementCoordinator.extend(BASE_METHODS.START_TURN, {
    pre: () => {
      const placementGenerator = PlacementCoordinatesGenerator(mainGrid);
      const placements = placementGenerator.calculateRandomShipPlacements(fleetData);
      placements.forEach(({ id, placement }) => {
        placeOnGrid(id, placement[0], placement[placement.length - 1]);
        placeShip(id, placement);
      });
      if (!isAllShipsPlaced()) throw new Error('AI Error: Not all ships placed.');
      else callEndTurn();
    }
  });
  return {
    initialize: () => {},
    startTurn: () => callStartTurn(),
    endTurn: () => callEndTurn(),
    isOver: () => callIsOver()
  };
};
