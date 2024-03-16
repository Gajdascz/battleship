import { BOOL } from '../../../../../Utility/constants/dom/attributes';

export const ShipPlacementController = ({ model, view }) => {
  const place = (coordinates) => {
    model.setPlacedCoordinates(coordinates);
    model.setIsPlaced(true);
    view.elements.getMainShip().dataset.placed = BOOL.T;
  };
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
