import { PlacementCoordinatesGenerator } from './PlacementCoordinatesGenerator';

export const PlacementManager = ({
  mainGrid,
  placeOnGrid,
  fleetData,
  setShipPlacementCoordinates,
  isAllShipsPlaced,
  placementCoordinator,
  resetController,
  unsubPlacementsFinalized,
  pubPlacementsFinalized
}) => {
  const { call, extend, BASE_METHODS, reset } = placementCoordinator;
  const callInitialize = () => call(BASE_METHODS.INITIALIZE);
  const callStartTurn = () => call(BASE_METHODS.START_TURN);
  const callEndTurn = () => call(BASE_METHODS.END_TURN);

  extend(BASE_METHODS.START_TURN, {
    post: () => {
      const placementGenerator = PlacementCoordinatesGenerator(mainGrid);
      const placements = placementGenerator.calculateRandomShipPlacements(fleetData);
      placements.forEach(({ id, placement }) => {
        placeOnGrid(id, placement[0], placement[placement.length - 1]);
        setShipPlacementCoordinates(id, placement);
      });
      console.log(placements);
      if (!isAllShipsPlaced()) throw new Error('AI Error: Not all ships placed.');
      else pubPlacementsFinalized();
    }
  });
  extend(BASE_METHODS.END_TURN, { pre: () => unsubPlacementsFinalized() });

  const destruct = () => {
    resetController();
    reset();
  };
  callInitialize();

  return {
    startTurn: callStartTurn,
    endTurn: callEndTurn,
    isOver: () => isAllShipsPlaced(),
    destruct
  };
};
