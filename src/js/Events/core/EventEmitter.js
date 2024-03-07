export const EventEmitter = () => {
  const subscribers = {};
  const hasEventSubscription = (event) => !!subscribers[event];

  const subscribe = (event, callback) => {
    if (!hasEventSubscription(event)) subscribers[event] = [];
    subscribers[event].push(callback);
  };

  const subscribeMany = (subscriptions) =>
    subscriptions.forEach(({ event, callback }) => subscribe(event, callback));

  const unsubscribeMany = (subscriptions) =>
    subscriptions.forEach(({ event, callback }) => unsubscribe(event, callback));

  const unsubscribe = (event, callback) => {
    if (!hasEventSubscription(event)) return;
    subscribers[event] = subscribers[event].filter((subscriber) => subscriber !== callback);
  };

  const publish = (event, incomingData) => {
    if (!hasEventSubscription(event)) return;
    const eventData = incomingData?.data ? incomingData : { data: incomingData };
    subscribers[event].forEach((callback) => {
      callback(eventData);
    });
  };

  const reset = () => Object.keys(subscribers).forEach((event) => delete subscribers[event]);

  const createHandler = (eventName, preEmitCallback = () => null) => {
    if (typeof preEmitCallback !== 'function')
      throw new Error(`Function Required: ${preEmitCallback} is invalid`);
    let callbacks = [];
    let callback = preEmitCallback;
    return {
      emit: (args) => {
        const payload = callback(args);
        publish(eventName, payload);
      },
      on: (callback) => {
        if (!callbacks.includes(callback)) {
          callbacks.push(callback);
          subscribe(eventName, callback);
        }
      },
      off: (callback) => {
        callbacks = callbacks.filter((fn) => fn !== callback);
        unsubscribe(eventName, callback);
      },
      setPreEmitCallback: (newCallback) => {
        if (typeof newCallback === 'function') callback = newCallback;
      },
      reset: () => {
        callbacks.forEach((callback) => unsubscribe(eventName, callback));
        callbacks = [];
        callback = () => null;
      }
    };
  };

  return { subscribe, subscribeMany, unsubscribe, unsubscribeMany, publish, createHandler, reset };
};
