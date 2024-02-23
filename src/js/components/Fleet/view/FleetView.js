import { MAIN_FLEET, TRACKING_FLEET } from '../../../utility/constants/components/fleet';
import { buildFleetUIObj } from './buildFleetUIObj';
import './fleet-style.css';
export const FleetView = () => {
  const { mainFleetElement, trackingFleetElement } = buildFleetUIObj();
  const shipViews = new Map();

  const mainFleetShipList = mainFleetElement.querySelector(`.${MAIN_FLEET.CLASSES.SHIP_LIST}`);
  const trackingFleetShipList = trackingFleetElement.querySelector(
    `.${TRACKING_FLEET.CLASSES.SHIP_LIST}`
  );

  return {
    attachMainFleetTo: (container) => container.append(mainFleetElement),
    attachTrackingGridTo: (container) => container.append(trackingFleetElement),
    addShipView: (shipID, shipView) => shipViews.set(shipID, shipView),
    populateFleetShipLists: () =>
      shipViews.forEach((shipView) => {
        mainFleetShipList.append(shipView.elements.mainShip);
        trackingFleetShipList.append(shipView.elements.trackingShip);
      }),
    setShipPlacementContainer: (container) => {
      shipViews.forEach((ship) => ship.placement.setPlacementContainer(container));
    },
    getRotateShipButton: (shipID) => shipViews.get(shipID)?.elements.rotateButton,
    getMainFleet: () => mainFleetElement,
    getTrackingFleet: () => trackingFleetElement
  };
};
