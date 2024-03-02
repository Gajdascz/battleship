import { EventEmitter } from '../core/EventEmitter';
import { Publisher } from './Publisher';
import { SubscriptionManager } from './SubscriptionManager';
import { EventScopeManager } from './EventScopeManager';

export const EventManager = (scope) => {
  const componentEmitter = EventEmitter();
  const publisher = Publisher(scope);
  const subscriptionManager = SubscriptionManager(scope);
  const scopeManager = EventScopeManager();

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
      },
      alternateScope: {
        add: (scope) => publisher.addAlternateScope(scope),
        noFulfill: (scope, event, data) => publisher.noFulfillAlternateScope(scope, event, data),
        requireFulfill: (scope, event, data) =>
          publisher.requireFulfillAlternateScope(scope, event, data),
        fulfill: (scope, event) => publisher.fulfillAlternateScope(scope, event)
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
    scopeManager: {
      addScopeToRegistry: (scope) => scopeManager.addScopeToRegistry(scope),
      setAllScopeDetails: (event, callback) => scopeManager.setAllScopeDetails(event, callback),
      setScopeDetails: (scope, event, callback) =>
        scopeManager.setScopeDetails(scope, event, callback),
      setActiveScope: (scope) => scopeManager.setActiveScope(scope),
      publishActiveScopeEvent: (event, data) => scopeManager.publishActiveScopeEvent(event, data),
      clearAllSubscriptions: () => scopeManager.clearAllSubscriptions(),
      enableActiveScope: () => scopeManager.enableActiveScope(),
      disableActiveScope: () => scopeManager.disableActiveScope()
    },
    resetEventManager: () => {
      componentEmitter.reset();
      subscriptionManager.unsubscribeAll();
      scopeManager.clearAllSubscriptions();
    }
  };
};
