import { buildUIObj, buildElementFromUIObj } from '../../../../Utility/uiBuilderUtils/uiBuilders';
import { COMMON_ELEMENTS } from '../../../../Utility/constants/dom/elements';
import { TRACKING_FLEET } from '../../../Fleet/common/fleetConstants';

const buildFleetContainerObj = () =>
  buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: TRACKING_FLEET.TYPE
    }
  });

const buildShipListObj = () =>
  buildUIObj(COMMON_ELEMENTS.DIV, {
    attributes: {
      class: TRACKING_FLEET.CLASSES.SHIP_LIST
    }
  });

const buildFleetHeaderObj = () =>
  buildUIObj(COMMON_ELEMENTS.PARAGRAPH, {
    text: TRACKING_FLEET.PROPERTIES.HEADER_TEXT,
    attributes: {
      class: TRACKING_FLEET.CLASSES.HEADER
    }
  });

export const AIFleetView = () => {
  const fleetContainer = buildFleetContainerObj();
  const header = buildFleetHeaderObj();
  const shipList = buildShipListObj();
  fleetContainer.children = [header, shipList];
  const trackingFleetElement = buildElementFromUIObj(fleetContainer);
  const shipListElement = trackingFleetElement.querySelector(
    `.${TRACKING_FLEET.CLASSES.SHIP_LIST}`
  );
  const shipViews = new Map();

  return {
    getTrackingFleet: () => trackingFleetElement,
    addShipView: (shipID, shipView) => shipViews.set(shipID, shipView),
    populateFleetShipLists: () =>
      shipViews.forEach((shipView) => {
        shipListElement.append(shipView.getShipElement());
      })
  };
};
