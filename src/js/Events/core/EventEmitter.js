export const EventEmitter = () => {
  const subscribers = {};
  const hasEventSubscription = (event) => !!subscribers[event];

  const subscribe = (event, callback) => {
    if (!hasEventSubscription(event)) subscribers[event] = [];
    subscribers[event].push(callback);
  };

  const unsubscribe = (event, callback) => {
    if (!hasEventSubscription(event)) return;
    subscribers[event] = subscribers[event].filter((subscriber) => subscriber !== callback);
  };

  const publish = (event, data) => {
    if (!hasEventSubscription(event)) return;
    const eventData = { data };
    subscribers[event].forEach((callback) => {
      callback(eventData);
    });
  };

  const reset = () => Object.keys(subscribers).forEach((event) => delete subscribers[event]);

  return { subscribe, unsubscribe, publish, reset };
};
