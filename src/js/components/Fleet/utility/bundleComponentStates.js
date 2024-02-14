import { STATES } from '../../../utility/constants/common';
import { PLACEMENT_EVENTS } from '../../../utility/constants/events';
import { StateBundler } from '../../../utility/stateManagement/StateBundler';

/**
 * Bundles state management configurations for the Ship component,
 * including event subscriptions and execution functions for specific states.
 *
 * @param {Object} callbacks - Callback functions for handling specific state events.
 * @returns {Object[]} An array of bundled state configurations.
 */
export const bundleComponentStates = ({ selectShip }) => {
  const bundler = StateBundler();
  bundler.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP.SELECTED,
    callback: selectShip
  });
  return bundler.getBundles();
};
