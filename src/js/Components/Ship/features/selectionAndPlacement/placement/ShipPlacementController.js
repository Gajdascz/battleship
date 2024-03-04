import { BOOL } from '../../../../../Utility/constants/dom/attributes';

export const ShipPlacementController = ({ model, view }) => {
  const shipElement = view.elements.getMainShip().element;
  const place = (coordinates) => {
    model.setPlacedCoordinates(coordinates);
    model.setIsPlaced(true);
    shipElement.dataset.placed = BOOL.T;
  };
  const pickup = () => {
    model.clearPlacedCoordinates();
    model.setIsPlaced(false);
    shipElement.dataset.placed = BOOL.F;
  };

  return {
    place,
    pickup
  };
};
