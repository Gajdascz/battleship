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
      publish: (event, data) => componentEmitter.publish(event, data),
      reset: () => componentEmitter.reset()
    },
    publisher: {
      global: {
        noFulfill: (event, data) => publisher.noFulfillGlobal(event, data),
        requireFulfill: (event, data) => publisher.requireFulfillGlobal(event, data)
      },
      scoped: {
        noFulfill: (event, data) => publisher.noFulfillScoped(event, data),
        requireFulfill: (event, data) => publisher.requireFulfillScoped(event, data)
      }
    },
    subscriptionManager: {
      normal: {
        global: {
          subscribe: (event, callback) =>
            subscriptionManager.subscribeNormalGlobal(event, callback),
          unsubscribe: (event, callback) =>
            subscriptionManager.unsubscribeNormalGlobal(event, callback)
        },
        scoped: {
          subscribe: (event, callback) =>
            subscriptionManager.subscribeNormalScoped(event, callback),
          unsubscribe: (event, callback) =>
            subscriptionManager.unsubscribeNormalScoped(event, callback)
        },
        all: {
          unsubscribe: () => subscriptionManager.unsubscribeAllNormal()
        }
      },
      dynamic: {
        global: {
          subscribe: (event, callback, triggers) =>
            subscriptionManager.subscribeDynamicGlobal(event, callback, triggers),
          unsubscribe: (event, callback, triggers) =>
            subscriptionManager.unsubscribeDynamicGlobal(event, callback, triggers)
        },
        scoped: {
          subscribe: (event, callback, triggers) =>
            subscriptionManager.subscribeDynamicScoped(event, callback, triggers),
          unsubscribe: (event, callback, triggers) =>
            subscriptionManager.unsubscribeDynamicScoped(event, callback, triggers)
        },
        all: {
          unsubscribe: () => subscriptionManager.unsubscribeAllDynamic()
        }
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
