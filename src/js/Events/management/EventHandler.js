export const EventHandler = (emitter, eventName, preEmitCallback = (args) => args) => {
  const { publish, subscribe, unsubscribe } = emitter;
  console.log(eventName, preEmitCallback);
  const validateCallback = (fn, at = '') => {
    if (!(fn && typeof fn === 'function'))
      throw new Error(`${eventName} passed invalid function at ${at}`);
    return true;
  };
  validateCallback(preEmitCallback, EventHandler.name);
  let callbacks = [];
  let callback = preEmitCallback;
  const emit = (args) => {
    const payload = callback(args);
    console.log(`${eventName} | ${payload}`);
    publish(eventName, payload);
  };
  const on = (callback) => {
    validateCallback(callback, on.name);
    if (!callbacks.includes(callback)) {
      callbacks.push(callback);
      subscribe(eventName, callback);
    }
  };
  const off = (callback) => {
    callbacks = callbacks.filter((fn) => fn !== callback);
    unsubscribe(eventName, callback);
  };
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
