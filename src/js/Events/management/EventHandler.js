/**
 * Initializes an EventHandler for managing interactions with a specified event in a pub/sub system.
 * Handles subscriptions and emissions related to an event
 * @param {Object} emitter Core Pub/sub system to manage event for.
 * @param {string} eventName Name of event to handle interactions for.
 * @param {function} preEmitCallback Function to execute pre-emission for providing payload.
 * @returns {Object} Interface for managing the event.
 */
export const EventHandler = (emitter, eventName, preEmitCallback = (args) => args) => {
  const { publish, subscribe, unsubscribe } = emitter;
  const validateCallback = (fn, at = '') => {
    if (!(fn && typeof fn === 'function'))
      throw new Error(`${eventName} passed invalid function at ${at}`);
    return true;
  };
  validateCallback(preEmitCallback, EventHandler.name);
  let callbacks = [];
  let callback = preEmitCallback;
  /**
   * Executes pre-emit callback and publishes payload detail.
   *
   * @param {*} args Passed to pre-emit callback.
   */
  const emit = (args) => {
    const payload = callback(args);
    publish(eventName, payload);
  };

  /**
   * Subscribes and stores the callback to the event.
   *
   * @param {function} callback Function to execute on event.
   */
  const on = (callback) => {
    validateCallback(callback, on.name);
    if (!callbacks.includes(callback)) {
      callbacks.push(callback);
      subscribe(eventName, callback);
    }
  };
  /**
   * Unsubscribes and removes the callback from the event.
   *
   * @param {function} callback Function to remove from event.
   */
  const off = (callback) => {
    callbacks = callbacks.filter((fn) => fn !== callback);
    unsubscribe(eventName, callback);
  };
  /**
   * Sets the pre-emit callback function.
   *
   * @param {function} newCallback Function to execute pre-event emissions.
   */
  const setPreEmitCallback = (newCallback) => {
    validateCallback(newCallback, setPreEmitCallback.name);
    callback = newCallback;
  };

  const reset = () => {
    callbacks.forEach((callback) => unsubscribe(eventName, callback));
    callbacks = [];
    callback = (args) => args;
  };

  return {
    emit,
    on,
    off,
    setPreEmitCallback,
    reset
  };
};
