export default function EventListenerManager() {
  const _listeners = new Map();

  const validateListenerInput = (key, events) => {
    if (!key || !events || !(events instanceof Object)) {
      throw new Error('Invalid key or events passed to addStateTransitionListeners');
    }
    return true;
  };

  const addListeners = (key, events) => {
    if (_listeners.has(key)) return console.warn(`Listeners for key ${key} already exist.`);
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
    _listeners.forEach((events) => {
      Object.entries(events).forEach(([event, callbacks]) => {
        callbacks.forEach((callback) => document.removeEventListener(event, callback));
      });
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
