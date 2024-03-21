import { BOOL } from '../../../../../Utility/constants/dom/attributes';

/**
 * Initializes a ShipPlacementController for handling ship placement logic.
 * @param {Object} detail Contains ship model and view interface.
 * @returns
 */
export const ShipPlacementController = ({ model, view }) => {
  /**
   * Sets the ships placed status, placed coordinates and updates the view.
   *
   * @param {Array[number[]]} coordinates Coordinates ship is placed at.
   */
  const place = (coordinates) => {
    model.setPlacedCoordinates(coordinates);
    model.setIsPlaced(true);
    view.elements.getMainShip().dataset.placed = BOOL.T;
  };
  /**
   * Removes the ship's placed status, placed coordinates, and updates the view.
   */
  const pickup = () => {
    model.clearPlacedCoordinates();
    model.setIsPlaced(false);
    view.elements.getMainShip().dataset.placed = BOOL.F;
  };

  return {
    place,
    pickup
  };
};
