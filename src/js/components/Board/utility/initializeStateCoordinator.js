import { STATES } from '../../../utility/constants/common';
import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
import { StateCoordinator } from '../../../utility/stateManagement/StateCoordinator';

/**
 * Bundles state management configurations for the Board component,
 * including event subscriptions and execution functions for specific states.
 *
 * @param {Object} callbacks - Callback functions for handling specific state events.
 * @returns {Object[]} An array of bundled state configurations.
 */
export const initializeStateCoordinator = (
  id,
  scope,
  { disableSubmitPlacementsButton, checkPlacementStatus, hideTrackingGrid }
) => {
  const coordinator = StateCoordinator(id, scope);
  coordinator.addExecuteFnToState(STATES.PLACEMENT, hideTrackingGrid);
  coordinator.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP_SELECTED,
    callback: disableSubmitPlacementsButton
  });
  coordinator.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP_PLACEMENT_SET,
    callback: checkPlacementStatus
  });
  coordinator.initializeManager();
};
