import { PlacementCoordinatesGenerator } from './PlacementCoordinatesGenerator';

export const PlacementManager = ({
  mainGrid,
  placeOnGrid,
  fleetData,
  placeShip,
  isAllShipsPlaced,
  onEnd
}) => {
  /**
   * Randomly places the AI's fleet onto it's board's main grid.
   * @returns {void}
   */
  const placeShips = () => {
    const placementGenerator = PlacementCoordinatesGenerator(mainGrid);
    const placements = placementGenerator.calculateRandomShipPlacements(fleetData);
    placements.forEach(({ id, placement }) => {
      placeOnGrid(id, placement[0], placement[placement.length - 1]);
      placeShip(id, placement);
    });
    if (!isAllShipsPlaced()) throw new Error('AI Error: Not all ships placed after placeShips()');
    else onEnd();
  };

  return { placeShips };
};
