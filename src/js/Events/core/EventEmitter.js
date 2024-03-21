/**
 * Initializes an EventEmitter to facilitate event-driven communication within the application.
 *
 * @returns {Object} Interface for pub/sub communication.
 */
export const EventEmitter = () => {
  const subscribers = {};
  const hasEventSubscription = (event) => !!subscribers[event];

  /**
   * Assigns a function to execute when the specified event occurs.
   *
   * @param {string} event
   * @param {function} callback
   */
  const subscribe = (event, callback) => {
    if (!hasEventSubscription(event)) subscribers[event] = [];
    subscribers[event].push(callback);
  };

  /**
   * Subscribes multiple callbacks to events in the provided detail.
   *
   * @param {Object[]} subscriptions Array of Objects containing event and callback properties.
   */
  const subscribeMany = (subscriptions) =>
    subscriptions.forEach(({ event, callback }) => subscribe(event, callback));

  /**
   * Unsubscribes multiple callbacks from events in provided detail.
   *
   * @param {Object[]} subscriptions Array of Objects containing event and callback properties.
   */
  const unsubscribeMany = (subscriptions) =>
    subscriptions.forEach(({ event, callback }) => unsubscribe(event, callback));

  /**
   * Stops the function from executing when the specified event occurs.
   *
   * @param {string} event Name of event.
   * @param {function} callback Function to remove from event.
   */
  const unsubscribe = (event, callback) => {
    if (!hasEventSubscription(event)) return;
    subscribers[event] = subscribers[event].filter((subscriber) => subscriber !== callback);
  };

  /**
   * Declares an event has occurred triggering subscribers callbacks to execute.
   *
   * @param {string} event Name of event to publish.
   * @param {*} incomingData Data to be passed to subscribers.
   */
  const publish = (event, incomingData) => {
    if (!hasEventSubscription(event)) return;
    const eventData = incomingData?.data ? incomingData : { data: incomingData };
    subscribers[event].forEach((callback) => {
      callback(eventData);
    });
  };

  const reset = () => Object.keys(subscribers).forEach((event) => delete subscribers[event]);

  return { subscribe, subscribeMany, unsubscribe, unsubscribeMany, publish, reset };
};
