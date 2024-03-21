import { EventEmitter } from '../core/EventEmitter';
import { EventDefinitionManager } from './EventDefinitionManager';

/**
 * Initializes an EventManager for managing and tracking pub/sub event communications centrally.
 * Handles event subscriptions, emissions, and definition management.
 *
 * @param {Object} eventsConfig Configuration object for definitions manager.
 * @returns {Object} An interface for managing communication with the internal EventEmitter system.
 */
export const EventManager = (eventsConfig) => {
  const emitter = EventEmitter();
  const { subscribe, unsubscribe, publish } = emitter;
  const { global, base, scopes } = eventsConfig;
  let subscriptionTracker = [];
  const events = EventDefinitionManager(base, global, scopes);

  /**
   * Subscribes a callback to an event and adds details to tracker.
   *
   * @param {string} event Event to listen for.
   * @param {function} callback Function to execute on event.
   */
  const addSubscription = (event, callback) => {
    subscribe(event, callback);
    subscriptionTracker.push({ event, callback });
  };

  /**
   * Unsubscribes a callback from an event and removes details from tracker.
   *
   * @param {string} event Event to remove subscription from.
   * @param {function} callback Function to remove from event.
   */
  const removeSubscription = (event, callback) => {
    unsubscribe(event, callback);
    subscriptionTracker = subscriptionTracker.filter(
      (e) => !(e.event === event && e.callback === callback)
    );
  };

  /**
   * Unsubscribes and clears all tracked subscriptions.
   */
  const removeAllSubscriptions = () => {
    subscriptionTracker.forEach(({ event, callback }) => unsubscribe(event, callback));
    subscriptionTracker = [];
  };

  return {
    on: addSubscription,
    off: removeSubscription,
    offAll: removeAllSubscriptions,
    emit: publish,
    events,
    reset: () => {
      removeAllSubscriptions();
      events.reset();
      emitter.reset();
    }
  };
};
