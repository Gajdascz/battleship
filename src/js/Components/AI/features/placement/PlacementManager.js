import { AI_PLACEMENT_EVENTS } from '../../common/aiEvents';
import { PlacementCoordinatesGenerator } from './PlacementCoordinatesGenerator';

export const PlacementManager = (model, componentEmitter) => {
  /**
   * Randomly places the AI's fleet onto it's board's main grid.
   * @returns {void}
   */
  const placeShips = () => {
    const placementGenerator = PlacementCoordinatesGenerator(model.mainGrid.get());
    const placements = placementGenerator.calculateRandomShipPlacements(model.fleet.getData());
    placements.forEach(({ id, placement }) => {
      model.mainGrid.place(id, placement[0], placement[placement.length - 1]);
      model.fleet.setShipPlacementCoordinates(id, placement);
    });
    if (!model.fleet.isAllShipsPlaced())
      throw new Error('AI Error: Not all ships placed after placeShips()');
    else {
      componentEmitter.unsubscribe(AI_PLACEMENT_EVENTS.PLACE_SHIPS, placeShips);
      componentEmitter.publish(AI_PLACEMENT_EVENTS.SHIPS_PLACED);
    }
  };

  componentEmitter.subscribe(AI_PLACEMENT_EVENTS.PLACE_SHIPS, placeShips);
};
