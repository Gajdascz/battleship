import { SHIP } from '../../common/constants/shipConstants';

export const ShipView = (shipElement, trackingElement) => {
  const updateOrientation = (isVertical) =>
    (shipElement.dataset.orientation = isVertical
      ? SHIP.ORIENTATIONS.HORIZONTAL
      : SHIP.ORIENTATIONS.VERTICAL);

  const updatePlacementStatus = (isPlaced) =>
    (shipElement.dataset.placed = isPlaced ? 'true' : 'false');

  const updateSunkStatus = (isSunk) => {
    shipElement.dataset.sunk = isSunk ? 'true' : 'false';
    trackingElement.dataset.sunk = isSunk ? 'true' : 'false';
  };

  const updateSelectedStatus = (isSelected) =>
    shipElement.classList.toggle(SHIP.CLASSES.BEING_PLACED, isSelected);

  const updateForProgressState = () => {
    shipElement.setAttribute('disabled', '');
  };

  const render = (shipModel) => {
    if (shipModel.getState() === SHIP.STATES.PLACEMENT) {
      updateOrientation(shipModel.getOrientation());
      updatePlacementStatus(shipModel.isPlaced());
      updateSelectedStatus(shipModel.isSelected());
    } else updateSunkStatus(shipModel.isSunk());
  };

  return {
    getElement: () => shipElement,
    render,
    updateForProgressState
  };
};
