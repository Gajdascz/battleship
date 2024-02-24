import { SHIP_CLASSES } from '../../../utility/constants/components/ship';
import { BOOL } from '../../../utility/constants/dom/attributes';
import { buildShipUIObj } from './buildShipUIObj';
import { ShipSelectionView } from '../Selection/ShipSelectionView';
import { ShipPlacementView } from '../Placement/ShipPlacementView';
import './ship-styles.css';
export const ShipView = ({ name, length }) => {
  const { mainShipElement, trackingShipElement, rotateButtonElement } = buildShipUIObj({
    name,
    length
  });
  const selectionView = ShipSelectionView({
    elements: { mainShipElement, rotateButtonElement }
  });
  const placementView = ShipPlacementView();

  return {
    selection: {
      initialize: ({ selectCallback, toggleOrientationCallback }) =>
        selectionView.initialize({ selectCallback, toggleOrientationCallback }),
      select: {
        enable: () => selectionView.select.enable(),
        disable: () => selectionView.select.disable()
      },
      orientationToggle: {
        enable: () => selectionView.orientationToggle.enable(),
        disable: () => selectionView.orientationToggle.disable()
      },
      end: () => selectionView.end()
    },
    placement: {
      initialize: ({ placementContainer, placeCallback }) =>
        placementView.initialize({ placementContainer, placeCallback }),
      place: {
        enable: () => placementView.enable(),
        disable: () => placementView.disable()
      },
      end: () => placementView.end()
    },
    elements: {
      mainShip: mainShipElement,
      trackingShip: trackingShipElement,
      rotateButton: rotateButtonElement
    },
    update: {
      orientation: (newOrientation) => (mainShipElement.dataset.orientation = newOrientation),
      selectedStatus: (isSelected) =>
        mainShipElement.classList.toggle(SHIP_CLASSES.SELECTED, isSelected),
      placementStatus: (isPlaced) => (mainShipElement.dataset.placed = isPlaced ? BOOL.T : BOOL.F),
      sunkStatus: (isSunk) => {
        mainShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
        trackingShipElement.dataset.sunk = isSunk ? BOOL.T : BOOL.F;
      }
    }
  };
};
