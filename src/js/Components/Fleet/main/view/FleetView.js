import { MAIN_FLEET, TRACKING_FLEET } from '../../common/fleetConstants';
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
    attachTrackingFleetTo: (container) => container.append(trackingFleetElement),
    addShipView: (shipID, shipView) => shipViews.set(shipID, shipView),
    populateFleetShipLists: () =>
      shipViews.forEach((shipView) => {
        mainFleetShipList.append(shipView.elements.getMainShip());
        trackingFleetShipList.append(shipView.elements.getTrackingShip());
      }),
    getRotateShipButton: (shipID) => shipViews.get(shipID)?.elements.getRotateButton(),
    getMainFleet: () => mainFleetElement,
    getTrackingFleet: () => trackingFleetElement
  };
};
