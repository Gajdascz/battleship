import { MAIN_FLEET, TRACKING_FLEET } from '../../../utility/constants/components/fleet';
import { buildFleetUIObj } from './buildFleetUIObj';

export const FleetView = () => {
  const {
    mainFleetElement,
    trackingFleetElement,
    buttonContainerElement,
    rotateShipWrapperElement
  } = buildFleetUIObj();
  const shipViews = new Map();

  const mainFleetShipList = mainFleetElement.querySelector(`.${MAIN_FLEET.CLASSES.SHIP_LIST}`);
  const trackingFleetShipList = trackingFleetElement.querySelector(
    `.${TRACKING_FLEET.CLASSES.SHIP_LIST}`
  );

  const updateRotateShipButton = (id, button) => {
    rotateShipWrapperElement.textContent = '';
    rotateShipWrapperElement.append(button);
  };

  return {
    addShipView: (shipID, shipView) => shipViews.set(shipID, shipView),
    populateFleetShipLists: () =>
      shipViews.forEach((shipView) => {
        mainFleetShipList.append(shipView.elements.mainShip);
        trackingFleetShipList.append(shipView.elements.trackingShip);
      }),
    setShipPlacementContainer: (container) => {
      shipViews.forEach((ship) => ship.placement.setPlacementContainer(container));
    },
    updateRotateShipButton,
    elements: {
      mainFleet: mainFleetElement,
      trackingFleet: trackingFleetElement,
      buttonContainer: buttonContainerElement
    }
  };
};
