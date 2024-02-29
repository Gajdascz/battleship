import { EventEmitter } from '../core/EventEmitter';
import { Publisher } from './Publisher';
import { SubscriptionManager } from './SubscriptionManager';

export const EventManager = (scope) => {
  const componentEmitter = EventEmitter();
  const publisher = Publisher(scope);
  const subscriptionManager = SubscriptionManager(scope);

  return {
    componentEmitter: {
      subscribe: (event, callback) => componentEmitter.subscribe(event, callback),
      unsubscribe: (event, callback) => componentEmitter.unsubscribe(event, callback),
      subscribeMany: (subscriptions) => {
        subscriptions.forEach((subscription) =>
          componentEmitter.subscribe(subscription.event, subscription.callback)
        );
      },
      unsubscribeMany: (subscriptions) => {
        subscriptions.forEach((subscription) =>
          componentEmitter.unsubscribe(subscription.event, subscription.callback)
        );
      },
      publish: (event, data) => componentEmitter.publish(event, data),
      reset: () => componentEmitter.reset()
    },
    publisher: {
      global: {
        noFulfill: (event, data) => publisher.noFulfillGlobal(event, data),
        requireFulfill: (event, data) => publisher.requireFulfillGlobal(event, data),
        fulfill: (event) => publisher.fulfillGlobal(event)
      },
      scoped: {
        noFulfill: (event, data) => publisher.noFulfillScoped(event, data),
        requireFulfill: (event, data) => publisher.requireFulfillScoped(event, data),
        fulfill: (event) => publisher.fulfillScoped(event)
      }
    },
    subscriptionManager: {
      global: {
        subscribe: (event, callback) => subscriptionManager.subscribeGlobal(event, callback),
        unsubscribe: (event, callback) => subscriptionManager.unsubscribeGlobal(event, callback),
        subscribeMany: (subscriptions) => subscriptionManager.subscribeManyGlobal(subscriptions),
        unsubscribeMany: (subscriptions) => subscriptionManager.unsubscribeManyGlobal(subscriptions)
      },
      scoped: {
        subscribe: (event, callback) => subscriptionManager.subscribeScoped(event, callback),
        unsubscribe: (event, callback) => subscriptionManager.unsubscribeScoped(event, callback),
        subscribeMany: (subscriptions) => subscriptionManager.subscribeManyScoped(subscriptions),
        unsubscribeMany: (subscriptions) => subscriptionManager.unsubscribeManyScoped(subscriptions)
      },
      all: {
        unsubscribe: () => subscriptionManager.unsubscribeAll()
      }
    },
    resetEventManager: () => {
      componentEmitter.reset();
      subscriptionManager.unsubscribeAll();
    }
  };
};
