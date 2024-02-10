import { SHIP_CLASSES } from '../../utility/constants/components/ship';
import { ORIENTATIONS } from '../../utility/constants/common';
import { BOOL } from '../../utility/constants/dom/attributes';
export const ShipView = (shipElement, trackingElement) => {
  const _mainShipElement = shipElement;
  const _trackingShipElement = trackingElement;

  const updateOrientation = (isVertical) =>
    (_mainShipElement.dataset.orientation = isVertical
      ? ORIENTATIONS.HORIZONTAL
      : ORIENTATIONS.VERTICAL);

  const updatePlacementStatus = (isPlaced) =>
    (_mainShipElement.dataset.placed = isPlaced ? BOOL.T : BOOL.F);

  const updateSunkStatus = (isSunk) => {
    _mainShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
    _trackingShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
  };

  const updateSelectedStatus = (isSelected) =>
    _mainShipElement.classList.toggle(SHIP_CLASSES.BEING_PLACED, isSelected);

  const updateForProgressState = () => (_mainShipElement.disabled = true);

  const render = (shipModel) => {
    if (shipModel.isPlacementState()) {
      updateOrientation(shipModel.getOrientation());
      updatePlacementStatus(shipModel.isPlaced());
      updateSelectedStatus(shipModel.isSelected());
    } else updateSunkStatus(shipModel.isSunk());
  };

  return {
    getElement: () => _mainShipElement,
    render,
    updateForProgressState
  };
};
