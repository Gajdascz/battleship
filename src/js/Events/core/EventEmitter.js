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
    console.log(event);
    if (!hasEventSubscription(event)) return;
    const eventData = incomingData?.data ? incomingData : { data: incomingData };
    subscribers[event].forEach((callback) => {
      callback(eventData);
    });
  };

  const reset = () => Object.keys(subscribers).forEach((event) => delete subscribers[event]);

  return { subscribe, subscribeMany, unsubscribe, unsubscribeMany, publish, reset };
};
