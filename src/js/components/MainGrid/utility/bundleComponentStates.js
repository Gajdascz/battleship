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
export const bundleComponentStates = ({
  handleShipSelected,
  handleOrientationToggle,
  initPreviewManager,
  processPlacementRequest
}) => {
  const bundler = StateBundler();
  bundler.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP.SELECTED,
    callback: handleShipSelected
  });
  bundler.addExecuteFnToState(STATES.PLACEMENT, initPreviewManager);
  bundler.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP.ORIENTATION_CHANGED,
    callback: handleOrientationToggle
  });
  bundler.addSubscriptionToState(STATES.PLACEMENT, {
    event: PLACEMENT_EVENTS.SHIP.PLACEMENT_REQUESTED,
    callback: processPlacementRequest
  });
  return bundler.getBundles();
};
