import { PlacementCoordinatesGenerator } from './PlacementCoordinatesGenerator';

export const PlacementManager = ({
  mainGrid,
  placeOnGrid,
  fleetData,
  setShipPlacementCoordinates,
  isAllShipsPlaced,
  placementCoordinator,
  resetController,
  unsub,
  pub
}) => {
  const { BASE_METHODS } = placementCoordinator;
  const callInitialize = () => placementCoordinator.call(BASE_METHODS.INITIALIZE);
  const callStartTurn = () => placementCoordinator.call(BASE_METHODS.START_TURN);
  const callEndTurn = () => placementCoordinator.call(BASE_METHODS.END_TURN);
  const onEndTurn = (callback) => placementCoordinator.onEndTurn(callback);
  let isOver = false;
  const initialize = () => {
    placementCoordinator.extend(BASE_METHODS.START_TURN, {
      pre: () => {
        const placementGenerator = PlacementCoordinatesGenerator(mainGrid);
        const placements = placementGenerator.calculateRandomShipPlacements(fleetData);
        placements.forEach(({ id, placement }) => {
          placeOnGrid(id, placement[0], placement[placement.length - 1]);
          setShipPlacementCoordinates(id, placement);
        });
        if (!isAllShipsPlaced()) throw new Error('AI Error: Not all ships placed.');
        else {
          isOver = true;
          pub();
        }
      }
    });
    placementCoordinator.extend(BASE_METHODS.END_TURN, { pre: () => unsub() });
    callInitialize();
  };

  const destruct = () => {
    resetController();
    placementCoordinator.reset();
  };

  return {
    initialize: () => initialize(),
    startTurn: () => callStartTurn(),
    endTurn: () => callEndTurn(),
    onEndTurn: (callback) => onEndTurn(callback),
    isOver: () => isOver && isAllShipsPlaced(),
    destruct
  };
};
