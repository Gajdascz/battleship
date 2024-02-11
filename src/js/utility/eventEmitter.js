const _subscribers = {};
const _hasEventSubscription = (event) => !!_subscribers[event];

const eventEmitter = {
  subscribe: (event, callback) => {
    if (!_hasEventSubscription(event)) _subscribers[event] = [];
    _subscribers[event].push(callback);
  },
  unsubscribe: (event, callback) => {
    if (!_hasEventSubscription(event)) return;
    _subscribers[event] = _subscribers[event].filter((subscriber) => subscriber !== callback);
  },
  publish: (event, data) => {
    if (!_hasEventSubscription(event)) return;
    _subscribers[event].forEach((callback) => callback(data));
  },
  reset: () => Object.keys(_subscribers).forEach((event) => delete _subscribers[event])
};

export default eventEmitter;
