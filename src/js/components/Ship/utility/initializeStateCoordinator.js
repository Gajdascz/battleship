import { STATES } from '../../../utility/constants/common';
import { PLACEMENT_EVENTS, PROGRESS_EVENTS } from '../../../utility/constants/events';
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
  { enablePlacementSettings, handleAttack, setShipPlacement }
) => {
  const coordinator = StateCoordinator(id, scope);
  coordinator.addExecuteFnToState(STATES.PLACEMENT, enablePlacementSettings);
  coordinator.addDynamicSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.GRID_PLACEMENT_PROCESSED,
    callback: setShipPlacement,
    subscribeTrigger: PLACEMENT_EVENTS.SHIP_SELECTED,
    unsubscribeTrigger: PLACEMENT_EVENTS.SHIP_DESELECTED
  });
  coordinator.addSubscriptionToState(STATES.PROGRESS, {
    event: PROGRESS_EVENTS.ATTACK_INITIATED,
    callback: handleAttack
  });
  coordinator.initializeManager();
};
