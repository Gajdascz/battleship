import { MAIN_FLEET, TRACKING_FLEET } from '../../utility/constants/components/fleet';

export const FleetView = (mainFleetElement, trackingFleetElement) => {
  const _mainFleetElement = mainFleetElement;
  const _trackingFleetElement = trackingFleetElement;
  const _mainFleetShipList = _mainFleetElement.querySelector(`.${MAIN_FLEET.CLASSES.SHIP_LIST}`);
  const _trackingFleetShipList = _trackingFleetElement.querySelector(
    `.${TRACKING_FLEET.CLASSES.SHIP_LIST}`
  );

  console.log(_mainFleetElement);
  const _mainFleetShipElements = [];
  const _trackingFleetShipElements = [];

  const renderMainFleet = (container) => container.append(_mainFleetElement);
  const renderTrackingFleet = (container) => container.append(_trackingFleetElement);

  return {
    renderMainFleet,
    renderTrackingFleet,
    addMainFleetShipElement: (shipElement) => {
      _mainFleetShipElements.push(shipElement);
      _mainFleetShipList.append(shipElement);
    },
    addTrackingFleetShipElement: (shipElement) => {
      _trackingFleetShipElements.push(shipElement);
      _trackingFleetShipList.append(shipElement);
    }
  };
};
