// Tracking Grid Component
import { TRACKING_GRID_EVENTS } from '../../common/trackingGridEvents';
import { TrackingGridCombatView } from './TrackingGridCombatView';
// External
import { convertToInternalFormat } from '../../../../../Utility/utils/coordinatesUtils';

export const TrackingGridCombatManager = ({ view, publisher, subscriptionManager }) => {
  const combatView = TrackingGridCombatView({ view });

  /**
   * Assigns the onSendAttack method to the view's event listener and listens for an enabling event.
   * When an attack is sent from a click on the grid, the proceeding event chain is initiated.
   */
  const onInitialize = () => {
    subscriptionManager.scoped.subscribe(
      TRACKING_GRID_EVENTS.ATTACK.ENABLE_REQUESTED,
      onEnableRequested
    );
    combatView.initialize(onSendAttack);
  };
  /**
   * Enables attacking from the grid, stops listening for enable request, starts listening for disable request.
   */
  const onEnableRequested = () => {
    subscriptionManager.scoped.unsubscribe(
      TRACKING_GRID_EVENTS.ATTACK.ENABLE_REQUESTED,
      onEnableRequested
    );
    subscriptionManager.scoped.subscribe(
      TRACKING_GRID_EVENTS.ATTACK.DISABLE_REQUESTED,
      onDisableRequested
    );
    combatView.enable();
  };
  /**
   * Disables attacking from the grid, stops listening for disable request, starts listening for enable request.
   */
  const onDisableRequested = () => {
    subscriptionManager.scoped.unsubscribe(
      TRACKING_GRID_EVENTS.ATTACK.DISABLE_REQUESTED,
      onDisableRequested
    );
    subscriptionManager.scoped.subscribe(
      TRACKING_GRID_EVENTS.ATTACK.ENABLE_REQUESTED,
      onEnableRequested
    );
    combatView.disable();
  };

  /**
   * When an attack is sent from the grid, enables listening for a result response and emits the attack coordinates
   * @param {string} displayCoordinates Coordinates from cell attribute.
   */
  const onSendAttack = (displayCoordinates) => {
    const coordinates = {
      internal: convertToInternalFormat(displayCoordinates),
      display: displayCoordinates
    };
    subscriptionManager.scoped.subscribe(
      TRACKING_GRID_EVENTS.ATTACK.RESULT_RECEIVED,
      onResultReceived
    );
    publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK.SENT, coordinates);
  };

  /**
   * When a result is received, stops listening, displays the result, and emits that it's been processed.
   * @param {*} data Result of attack object containing string.
   */
  const onResultReceived = ({ data }) => {
    const { result } = data;
    subscriptionManager.scoped.unsubscribe(
      TRACKING_GRID_EVENTS.ATTACK.RESULT_RECEIVED,
      onResultReceived
    );
    combatView.displayResult(result);
    publisher.scoped.noFulfill(TRACKING_GRID_EVENTS.ATTACK.PROCESSED);
  };

  /**
   * Cleans up internal DOM listeners and unsubscribes from any lingering combat subscriptions.
   */
  const onEndRequested = () => {
    combatView.end();
    subscriptionManager.all.unsubscribe();
  };

  return {
    initialize: () => onInitialize(),
    end: () => onEndRequested()
  };
};
