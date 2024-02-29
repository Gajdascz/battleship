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
    unsubscribeManyScoped: (subscriptions) => {
      subscriptions.forEach((subscription) =>
        unsubscribe(getKey(subscription.event), subscription.callback)
      );
    },
    subscribeManyGlobal: (subscriptions) =>
      subscriptions.forEach((subscription) => subscribe(subscription.event, subscription.callback)),
    unsubscribeManyGlobal: (subscriptions) => {
      subscriptions.forEach((subscription) =>
        unsubscribe(subscription.event, subscription.callback)
      );
    },
    unsubscribeAll: () => unsubscribeAll()
  };
};
