import { STATES } from '../../../utility/constants/common';
import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
import { StateCoordinator } from '../../../utility/stateManagement/StateCoordinator';

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
  { handleShipSelectionRequest, initializeShipStates }
) => {
  const coordinator = StateCoordinator(id, scope);
  coordinator.addExecuteFnToState(STATES.PLACEMENT, initializeShipStates);
  coordinator.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP_SELECTION_REQUESTED,
    callback: handleShipSelectionRequest
  });
  coordinator.initializeManager();
};
