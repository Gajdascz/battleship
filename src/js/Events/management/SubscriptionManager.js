import { globalEmitter } from '../core/globalEventEmitter';
import { createEventKeyGenerator } from '../../Utility/utils/createEventKeyGenerator';

/**
 * Creates a subscription manager for managing both scoped and global event subscriptions.
 * This helps in preventing memory leaks by facilitating easy clean-up of event listeners.
 * @param {string} scope A unique identifier for the event scope.
 * @returns {Object} An interface for managing subscriptions, providing methods to subscribe and unsubscribe to events.
 */
export const SubscriptionManager = (scope) => {
  const { getKey } = createEventKeyGenerator(scope);
  const active = [];
  const isSubscriptionEqual = (a, b) => a.event === b.event && a.callback === b.callback;
  const findActiveIndex = (event, callback) =>
    active.findIndex((subscription) => isSubscriptionEqual(subscription, { event, callback }));
  const removeActive = (event, callback) => {
    const index = findActiveIndex(event, callback, active);
    if (index >= 0) active.splice(index, 1);
  };
  const subscribe = (event, callback) => {
    globalEmitter.subscribe(event, callback);
    active.push({ event, callback });
  };
  const unsubscribe = (event, callback) => {
    globalEmitter.unsubscribe(event, callback);
    removeActive(event, callback);
  };
  const unsubscribeAll = () => {
    for (let i = active.length - 1; i >= 0; i--) {
      const { event, callback } = active[i];
      unsubscribe(event, callback);
    }
  };

  return {
    subscribeGlobal: (event, callback) => subscribe(event, callback),
    unsubscribeGlobal: (event, callback) => unsubscribe(event, callback),
    subscribeScoped: (event, callback) => subscribe(getKey(event), callback),
    unsubscribeScoped: (event, callback) => unsubscribe(getKey(event), callback),
    subscribeManyScoped: (subscriptions) => {
      subscriptions.forEach((subscription) =>
        subscribe(getKey(subscription.event), subscription.callback)
      );
    },
    subscribeManyGlobal: (subscriptions) =>
      subscriptions.forEach((subscription) => subscribe(subscription.event, subscription.callback)),
    unsubscribeAll: () => unsubscribeAll()
  };
};

/**
 * Manages dynamic subscriptions, allowing automatic enabling/disabling of event listeners
 * based on specified trigger events. This supports complex event-driven behaviors.
 */
// const dynamic = {
//   active: [],
//   areTriggersEqual: (a, b) => a.enableOn === b.enableOn && a.disableOn === b.disableOn,
//   findActiveIndex: (triggers) =>
//     dynamic.active.findIndex((subscription) => dynamic.areTriggersEqual(subscription, triggers)),
//   /**
//    * Dynamically subscribes and unsubscribes the 'callback' to the 'event' when
//    * the enableOn or disableOn trigger events are emitted.
//    * @param {string} event Primary event to toggle callback function on
//    * @param {function} callback Function to execute on primary event when enabled
//    * @param {Object} triggers Enable and disable events to trigger subscribe and unsubscribe
//    */
//   subscribe: (event, callback, triggers) => {
//     const { enableOn, disableOn } = triggers;
//     const enable = () =>subscribe(event, callback);
//     const disable = () =>unsubscribe(event, callback);
//    subscribe(enableOn, enable);
//    subscribe(disableOn, disable);
//     dynamic.active.push({
//       event,
//       callback,
//       disableOn,
//       enableOn,
//       enable,
//       disable
//     });
//   },
//   unsubscribe: (event, callback, triggers) => {
//     const index = dynamic.findActiveIndex(triggers);
//     if (index >= 0) {
//       const { enableOn, disableOn, enable, disable } = dynamic.active[index];
//      unsubscribe(enableOn, enable);
//      unsubscribe(disableOn, disable);
//       dynamic.active.splice(index, 1);
//     }
//    unsubscribe(event, callback);
//   },
//   unsubscribeAll: () => {
//     for (let i = dynamic.active.length - 1; i >= 0; i--) {
//       const { event, callback, enableOn, disableOn } = dynamic.active[i];
//       dynamic.unsubscribe(event, callback, { enableOn, disableOn });
//     }
//   }
// };

// subscribeDynamicGlobal: (event, callback, triggers) =>
//   dynamic.subscribe(event, callback, triggers),
// unsubscribeDynamicGlobal: (event, callback, triggers) =>
//   dynamic.unsubscribe(event, callback, triggers),
// subscribeDynamicScoped: (event, callback, triggers) => {
//   const { enableOn, disableOn } = getScopedTriggers(triggers);
//   dynamic.subscribe(getKey(event), callback, { enableOn, disableOn });
// },
// unsubscribeDynamicScoped: (event, callback, triggers) => {
//   const { enableOn, disableOn } = getScopedTriggers(triggers);
//   dynamic.unsubscribe(getKey(event), callback, { enableOn, disableOn });
// },
// unsubscribeAllDynamic: () => dynamic.unsubscribeAll(),

// const getScopedTriggers = (triggers) => ({
//   enableOn: getKey(triggers.enableOn),
//   disableOn: getKey(triggers.disableOn)
// });
