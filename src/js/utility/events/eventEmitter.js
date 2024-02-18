const subscribers = {};
const _hasEventSubscription = (event) => !!subscribers[event];

const eventEmitter = {
  subscribe: (event, callback) => {
    if (!_hasEventSubscription(event)) subscribers[event] = [];
    console.log(event);
    subscribers[event].push(callback);
  },
  unsubscribe: (event, callback) => {
    if (!_hasEventSubscription(event)) return;
    subscribers[event] = subscribers[event].filter((subscriber) => subscriber !== callback);
  },
  publish: (event, data) => {
    if (!_hasEventSubscription(event)) return;
    // console.log(`${event} - published: `);
    // console.log(data);
    const eventData = { data };
    subscribers[event].forEach((callback) => callback(eventData));
  },
  reset: () => Object.keys(subscribers).forEach((event) => delete subscribers[event])
};

export default eventEmitter;
