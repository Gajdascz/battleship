import { MAIN_FLEET, TRACKING_FLEET } from '../../../utility/constants/components/fleet';
import { ROTATE_SHIP_BUTTON } from '../../../utility/constants/components/ship';
import { buildFleetUIObj } from './buildFleetUIObj';

export const FleetView = () => {
  const { mainFleetElement, trackingFleetElement } = buildFleetUIObj();

  const mainFleetShipList = mainFleetElement.querySelector(`.${MAIN_FLEET.CLASSES.SHIP_LIST}`);
  const trackingFleetShipList = trackingFleetElement.querySelector(
    `.${TRACKING_FLEET.CLASSES.SHIP_LIST}`
  );
  const _mainFleetButtonContainer = mainFleetElement.querySelector(
    `.${MAIN_FLEET.CLASSES.BUTTONS_CONTAINER}`
  );

  const renderMainFleet = (container) => container.append(mainFleetElement);
  const renderTrackingFleet = (container) => container.append(trackingFleetElement);
  const updateRotateButton = (button) => {
    const current = _mainFleetButtonContainer.querySelector(`.${ROTATE_SHIP_BUTTON.CLASS}`);
    current?.remove();
    _mainFleetButtonContainer.append(button);
  };

  return {
    renderMainFleet,
    renderTrackingFleet,
    getMainFleetShipList: () => mainFleetShipList,
    getTrackingFleetShipList: () => trackingFleetShipList,
    updateRotateButton,
    getMainFleetButtonContainer: () => _mainFleetButtonContainer
  };
};
