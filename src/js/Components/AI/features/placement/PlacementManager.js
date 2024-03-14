import { PlacementCoordinatesGenerator } from './PlacementCoordinatesGenerator';

export const PlacementManager = ({
  mainGrid,
  placeOnGrid,
  fleetData,
  setShipPlacementCoordinates,
  isAllShipsPlaced
}) => {
  const startPlacement = (handleFinalize) => {
    const placementGenerator = PlacementCoordinatesGenerator(mainGrid);
    const placements = placementGenerator.calculateRandomShipPlacements(fleetData);
    placements.forEach(({ id, placement }) => {
      placeOnGrid(id, placement[0], placement[placement.length - 1]);
      setShipPlacementCoordinates(id, placement);
    });
    if (!isAllShipsPlaced()) throw new Error('AI Error: Not all ships placed.');
    else handleFinalize();
  };

  const endPlacement = () => {};

  return {
    startPlacement,
    endPlacement
  };
};
