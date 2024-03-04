import { MAIN_FLEET, TRACKING_FLEET } from '../../common/fleetConstants';
import { buildFleetUIObj } from './buildFleetUIObj';
import './fleet-style.css';

const ELEMENT_IDS = {
  MAIN_FLEET: 'mainFleet',
  TRACKING_FLEET: 'trackingFleet'
};
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
        mainFleetShipList.append(shipView.elements.getMainShip().element);
        trackingFleetShipList.append(shipView.elements.getTrackingShip().element);
      }),
    elements: {
      getRotateShipButton: (shipID) => shipViews.get(shipID)?.elements.getRotateButton(),
      getMainFleet: () => ({ id: ELEMENT_IDS.MAIN_FLEET, element: mainFleetElement }),
      getTrackingFleet: () => ({ id: ELEMENT_IDS.TRACKING_FLEET, element: trackingFleetElement })
    }
  };
};
