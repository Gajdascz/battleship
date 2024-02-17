import { STATES } from '../../../../utility/constants/common';
import { PLACEMENT_EVENTS } from '../../../../utility/constants/events';
import { StateCoordinator } from '../../../../utility/stateManagement/StateCoordinator';

/**
 * Bundles state management configurations for the Ship component,
 * including event subscriptions and execution functions for specific states.
 *
 * @param {Object} callbacks - Callback functions for handling specific state events.
 * @returns {Object[]} An array of bundled state configurations.
 */
export const initializeStateCoordinator = (
  id,
  scope,
  { handleShipSelected, handleOrientationToggle, initPreviewManager, processPlacementRequest }
) => {
  console.log(id);
  const coordinator = StateCoordinator(id, scope);
  coordinator.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP_SELECTED,
    callback: handleShipSelected
  });
  coordinator.addExecuteFnToState(STATES.PLACEMENT, initPreviewManager);
  coordinator.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP_ORIENTATION_TOGGLED,
    callback: handleOrientationToggle
  });
  coordinator.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP_PLACEMENT_REQUESTED,
    callback: processPlacementRequest
  });
  coordinator.initializeManager();
};
