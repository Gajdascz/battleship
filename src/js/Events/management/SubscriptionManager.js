import globalEmitter from '../core/globalEventEmitter';
import { createEventKeyGenerator } from '../../Utility/utils/createEventKeyGenerator';

/**
 * Creates a subscription manager for managing both scoped and global event subscriptions.
 * This helps in preventing memory leaks by facilitating easy clean-up of event listeners.
 * @param {string} scope A unique identifier for the event scope.
 * @returns {Object} An interface for managing subscriptions, providing methods to subscribe and unsubscribe to events.
 */
export const SubscriptionManager = (scope) => {
  const { getKey } = createEventKeyGenerator(scope);

  /**
   * Manages standard event subscriptions
   */
  const normal = {
    active: [],
    isSubscriptionEqual: (a, b) => a.event === b.event && a.callback === b.callback,
    findActiveIndex: (event, callback) =>
      normal.active.findIndex((subscription) =>
        normal.isSubscriptionEqual(subscription, { event, callback })
      ),
    removeActive: (event, callback) => {
      const index = normal.findActiveIndex(event, callback, normal.active);
      if (index >= 0) normal.active.splice(index, 1);
    },
    subscribe: (event, callback) => {
      globalEmitter.subscribe(event, callback);
      normal.active.push({ event, callback });
    },
    unsubscribe: (event, callback) => {
      globalEmitter.unsubscribe(event, callback);
      normal.removeActive(event, callback);
    },
    unsubscribeAll: () => {
      for (let i = normal.active.length - 1; i >= 0; i--) {
        const { event, callback } = normal.active[i];
        normal.unsubscribe(event, callback);
      }
    }
  };

  /**
   * Manages dynamic subscriptions, allowing automatic enabling/disabling of event listeners
   * based on specified trigger events. This supports complex event-driven behaviors.
   */
  const dynamic = {
    active: [],
    areTriggersEqual: (a, b) => a.enableOn === b.enableOn && a.disableOn === b.disableOn,
    findActiveIndex: (triggers) =>
      dynamic.active.findIndex((subscription) => dynamic.areTriggersEqual(subscription, triggers)),
    /**
     * Dynamically subscribes and unsubscribes the 'callback' to the 'event' when
     * the enableOn or disableOn trigger events are emitted.
     * @param {string} event Primary event to toggle callback function on
     * @param {function} callback Function to execute on primary event when enabled
     * @param {Object} triggers Enable and disable events to trigger subscribe and unsubscribe
     */
    subscribe: (event, callback, triggers) => {
      const { enableOn, disableOn } = triggers;
      const enable = () => normal.subscribe(event, callback);
      const disable = () => normal.unsubscribe(event, callback);
      normal.subscribe(enableOn, enable);
      normal.subscribe(disableOn, disable);
      dynamic.active.push({
        event,
        callback,
        disableOn,
        enableOn,
        enable,
        disable
      });
    },
    unsubscribe: (event, callback, triggers) => {
      const index = dynamic.findActiveIndex(triggers);
      if (index >= 0) {
        const { enableOn, disableOn, enable, disable } = dynamic.active[index];
        normal.unsubscribe(enableOn, enable);
        normal.unsubscribe(disableOn, disable);
        dynamic.active.splice(index, 1);
      }
      normal.unsubscribe(event, callback);
    },
    unsubscribeAll: () => {
      for (let i = dynamic.active.length - 1; i >= 0; i--) {
        const { event, callback, enableOn, disableOn } = dynamic.active[i];
        dynamic.unsubscribe(event, callback, { enableOn, disableOn });
      }
    }
  };

  const getScopedTriggers = (triggers) => ({
    enableOn: getKey(triggers.enableOn),
    disableOn: getKey(triggers.disableOn)
  });

  return {
    subscribeNormalGlobal: (event, callback) => normal.subscribe(event, callback),
    unsubscribeNormalGlobal: (event, callback) => normal.unsubscribe(event, callback),
    unsubscribeAllNormal: () => normal.unsubscribeAll(),

    subscribeDynamicGlobal: (event, callback, triggers) =>
      dynamic.subscribe(event, callback, triggers),
    unsubscribeDynamicGlobal: (event, callback, triggers) =>
      dynamic.unsubscribe(event, callback, triggers),
    subscribeNormalScoped: (event, callback) => normal.subscribe(getKey(event), callback),
    unsubscribeNormalScoped: (event, callback) => normal.unsubscribe(getKey(event), callback),

    subscribeDynamicScoped: (event, callback, triggers) => {
      const { enableOn, disableOn } = getScopedTriggers(triggers);
      dynamic.subscribe(getKey(event), callback, { enableOn, disableOn });
    },
    unsubscribeDynamicScoped: (event, callback, triggers) => {
      const { enableOn, disableOn } = getScopedTriggers(triggers);
      dynamic.unsubscribe(getKey(event), callback, { enableOn, disableOn });
    },
    unsubscribeAllDynamic: () => dynamic.unsubscribeAll(),

    unsubscribeAll: () => {
      normal.unsubscribeAll();
      dynamic.unsubscribeAll();
    }
  };
};
