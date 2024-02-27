import { vi } from 'vitest';

// mockGlobalEmitter.js
// This file creates a mock for the globalEmitter module

export const EMITTER_CONSTANTS = {
  FULFILLED_HANDLE: vi.fn((event) => `${event}-fulfilled`)
};

export const subscribers = {};

export const hasEventSubscription = vi.fn((event) => !!subscribers[event]);

export const fulfillmentManager = {
  pending: new Map(),
  isPending: vi.fn((event) => fulfillmentManager.pending.has(event)),
  addPending: vi.fn((event, data) => {
    if (fulfillmentManager.isPending(event)) fulfillmentManager.pending.get(event).push({ data });
    else fulfillmentManager.pending.set(event, [{ data }]);
  }),
  fulfill: vi.fn((event) => fulfillmentManager.pending.delete(event)),
  process: vi.fn((event, callback) => {
    fulfillmentManager.pending.get(event)?.forEach((data) => callback(data));
  }),
  reset: vi.fn(() => fulfillmentManager.pending.clear())
};

export const globalEmitter = {
  subscribe: vi.fn((event, callback) => {
    if (!hasEventSubscription(event)) subscribers[event] = [];
    if (fulfillmentManager.isPending(event)) {
      fulfillmentManager.process(event, callback);
      if (fulfillmentManager.isPending(event)) subscribers[event].push(callback);
    } else subscribers[event].push(callback);
  }),
  unsubscribe: vi.fn((event, callback) => {
    if (!hasEventSubscription(event)) return;
    subscribers[event] = subscribers[event].filter((subscriber) => subscriber !== callback);
  }),
  publish: vi.fn((event, data, requireFulfillment = false) => {
    if (!hasEventSubscription(event)) {
      if (requireFulfillment) {
        fulfillmentManager.addPending(event, data);
        const handleFulfillment = () => {
          fulfillmentManager.fulfill(event);
          globalEmitter.unsubscribe(EMITTER_CONSTANTS.FULFILLED_HANDLE(event), handleFulfillment);
        };
        globalEmitter.subscribe(EMITTER_CONSTANTS.FULFILLED_HANDLE(event), handleFulfillment);
      }
    } else {
      const eventData = { data };
      subscribers[event].forEach((callback) => callback(eventData));
    }
  }),
  publishFulfill: vi.fn((event) => {
    if (!fulfillmentManager.isPending(event)) return;
    const handle = EMITTER_CONSTANTS.FULFILLED_HANDLE(event);
    globalEmitter.publish(handle);
  }),
  isPendingFulfillment: vi.fn((event) => fulfillmentManager.isPending(event)),
  reset: vi.fn(() => {
    Object.keys(subscribers).forEach((event) => delete subscribers[event]);
    fulfillmentManager.reset();
  })
};

// Jest specific setup to automatically mock this module in tests
vi.mock('./path/to/your/actual/globalEmitter', () => ({
  EMITTER_CONSTANTS,
  subscribers,
  hasEventSubscription,
  fulfillmentManager,
  globalEmitter
}));
