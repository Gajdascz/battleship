import { STATES } from '../../../utility/constants/common';
import { PLACEMENT_EVENTS, PROGRESS_EVENTS } from '../../../utility/constants/events';
import { StateBundler } from '../../../utility/stateManagement/StateBundler';

/**
 * Bundles state management configurations for the Ship component,
 * including event subscriptions and execution functions for specific states.
 *
 * @param {Object} callbacks - Callback functions for handling specific state events.
 * @returns {Object[]} An array of bundled state configurations.
 */
export const bundleComponentStates = ({
  enablePlacementSettings,
  disablePlacementSettings,
  handlePlacement,
  handleAttack,
  requestSelect
}) => {
  const bundler = StateBundler();
  bundler.addExecuteFnToState(STATES.PLACEMENT, enablePlacementSettings);
  bundler.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP.PLACED,
    callback: handlePlacement
  });
  bundler.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP.SELECT_REQUESTED,
    callback: requestSelect
  });
  bundler.addExecuteFnToState(STATES.PROGRESS, disablePlacementSettings);
  bundler.addSubscriptionToState(STATES.PROGRESS, {
    event: PROGRESS_EVENTS.ATTACK.INITIATED,
    callback: handleAttack
  });
  return bundler.getBundles();
};
