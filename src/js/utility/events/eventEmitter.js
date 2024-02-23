import { EMITTER } from '../constants/events';

/**
 * A map to hold subscribers for different events.
 * @type {Object<string, Array<Function>>}
 */
const subscribers = {};

/**
 * Checks if there is at least one subscriber for the given event.
 * @param {string} event - The event to check.
 * @returns {boolean} True if the event has at least one subscriber.
 */
const hasEventSubscription = (event) => !!subscribers[event];

/**
 * Manages the storage and fulfillment of pending events.
 */
const fulfillmentManager = {
  pending: new Map(),
  /**
   * Checks if an event has pending data.
   * @param {string} event - The event to check.
   * @returns {boolean} True if the event has pending data.
   */
  isPending: (event) => fulfillmentManager.pending.has(event),
  /**
   * Adds data to a pending event.
   * @param {string} event - The event to add pending data to.
   * @param {*} data - The data to add.
   */
  addPending: (event, data) => {
    if (fulfillmentManager.isPending(event)) fulfillmentManager.pending.get(event).push({ data });
    else fulfillmentManager.pending.set(event, [{ data }]);
  },
  /**
   * Marks an event as fulfilled and removes it from the pending list.
   * @param {string} event - The event to fulfill.
   */
  fulfill: (event) => fulfillmentManager.pending.delete(event),
  /**
   * Processes pending data for an event with the provided callback.
   * @param {string} event - The event to process.
   * @param {Function} callback - The callback to process data with.
   */
  process: (event, callback) => {
    fulfillmentManager.pending.get(event)?.forEach((data) => callback(data));
  },
  /**
   * Clears all pending events.
   */
  reset: () => fulfillmentManager.pending.clear()
};

/**
 * The event emitter object, managing subscriptions and event publications.
 */
const eventEmitter = {
  /**
   * Subscribes to an event.
   * @param {string} event - The event to subscribe to.
   * @param {Function} callback - The callback to execute when the event is published.
   */
  subscribe: (event, callback) => {
    if (!hasEventSubscription(event)) subscribers[event] = [];
    if (fulfillmentManager.isPending(event)) {
      fulfillmentManager.process(event, callback);
      if (fulfillmentManager.isPending(event)) subscribers[event].push(callback);
    } else subscribers[event].push(callback);
  },
  /**
   * Unsubscribes from an event.
   * @param {string} event - The event to unsubscribe from.
   * @param {Function} callback - The callback to remove from the subscription.
   */
  unsubscribe: (event, callback) => {
    if (!hasEventSubscription(event)) return;
    subscribers[event] = subscribers[event].filter((subscriber) => subscriber !== callback);
  },
  /**
   * Publishes an event, optionally requiring fulfillment.
   * @param {string} event - The event to publish.
   * @param {*} data - The data to publish with the event.
   * @param {boolean} [requireFulfillment=false] - Whether the event requires fulfillment.
   */
  publish: (event, data, requireFulfillment = false) => {
    if (!hasEventSubscription(event)) {
      if (requireFulfillment) {
        fulfillmentManager.addPending(event, data);
        const handleFulfillment = () => {
          fulfillmentManager.fulfill(event);
          eventEmitter.unsubscribe(EMITTER.FULFILLED_HANDLE(event), handleFulfillment);
        };
        eventEmitter.subscribe(EMITTER.FULFILLED_HANDLE(event), handleFulfillment);
      }
    } else {
      const eventData = { data };
      subscribers[event].forEach((callback) => callback(eventData));
    }
  },
  /**
   * Resets the event emitter, clearing all subscriptions and pending events.
   */ reset: () => {
    Object.keys(subscribers).forEach((event) => delete subscribers[event]);
    fulfillmentManager.reset();
  }
};

export default eventEmitter;