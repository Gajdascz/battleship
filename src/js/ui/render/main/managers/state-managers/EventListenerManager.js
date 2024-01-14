import { throwError } from '../ManagerUtilities';

export default function EventListenerManager() {
  const _listeners = new Map();

  const validateListenerInput = (key, events) => {
    if (!key || !events) throw new Error('Invalid key or events passed to addStateTransitionListeners');
    if (!(events instanceof Object)) throwError('events', 'Object', events);
    return true;
  };

  const addListeners = (key, events) => {
    validateListenerInput(key, events);
    Object.entries(events).forEach(([event, callbacks]) => {
      if (!callbacks || callbacks.length === 0) console.warn(`No callbacks passed to ${key} for ${event}`);
      callbacks.forEach((callback) => document.addEventListener(event, callback));
    });
    _listeners.set(key, events);
  };
  const removeListener = (key) => {
    if (!_listeners.has(key)) return console.warn(`No listeners found for ${key}`);
    const events = _listeners.get(key);
    Object.entries(events).forEach(([event, callbacks]) => {
      callbacks.forEach((callback) => document.removeEventListener(event, callback));
    });
    _listeners.delete(key);
  };

  const clearListeners = () => {
    _listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => document.removeEventListener(event, callback));
    });
    _listeners.clear();
  };
  return {
    addListeners,
    removeListener,
    clearListeners,
    hasListeners: () => _listeners.size > 0
  };
}
