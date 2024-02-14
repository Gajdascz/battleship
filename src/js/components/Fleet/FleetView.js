import { MAIN_FLEET, TRACKING_FLEET } from '../../utility/constants/components/fleet';
import { ROTATE_SHIP_BUTTON } from '../../utility/constants/components/ship';

export const FleetView = (mainFleetElement, trackingFleetElement) => {
  const _mainFleetElement = mainFleetElement;
  const _trackingFleetElement = trackingFleetElement;
  const _mainFleetShipList = _mainFleetElement.querySelector(`.${MAIN_FLEET.CLASSES.SHIP_LIST}`);
  const _trackingFleetShipList = _trackingFleetElement.querySelector(
    `.${TRACKING_FLEET.CLASSES.SHIP_LIST}`
  );
  const _mainFleetButtonContainer = _mainFleetElement.querySelector(
    `.${MAIN_FLEET.CLASSES.BUTTONS_CONTAINER}`
  );

  const renderMainFleet = (container) => container.append(_mainFleetElement);
  const renderTrackingFleet = (container) => container.append(_trackingFleetElement);
  const updateRotateButton = (button) => {
    const current = _mainFleetButtonContainer.querySelector(`.${ROTATE_SHIP_BUTTON.CLASS}`);
    current?.remove();
    _mainFleetButtonContainer.append(button);
  };

  return {
    renderMainFleet,
    renderTrackingFleet,
    getMainFleetShipList: () => _mainFleetShipList,
    getTrackingFleetShipList: () => _trackingFleetShipList,
    updateRotateButton,
    getMainFleetButtonContainer: () => _mainFleetButtonContainer
  };
};
