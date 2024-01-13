export default function StateTransitionEventManager() {
  const _stateTransitionListeners = new Map();

  const addStateTransitionListeners = (state, events) => {
    if (!state || !events) throw new Error('Invalid state or events passed to addStateTransitionListeners');
    events.forEach((callbacks, event) => {
      if (!callbacks || callbacks.length === 0) return console.warn(`No callbacks passed to ${state} for ${event}`);
      callbacks.forEach((callback) => document.addEventListener(event, callback));
    });
    _stateTransitionListeners.set(state, events);
  };
  const removeStateTransitionListeners = (state) => {
    if (!_stateTransitionListeners.has(state)) return console.warn(`No listeners found for ${state}`);
    const events = _stateTransitionListeners.get(state);
    events.forEach((callbacks, event) => {
      callbacks.forEach((callback) => document.removeEventListener(event, callback));
    });
    _stateTransitionListeners.delete(state);
  };

  const clearAllStateTransitionListeners = () => {
    _stateTransitionListeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => document.removeEventListener(event, callback));
    });
    _stateTransitionListeners.clear();
  };
  return {
    addStateTransitionListeners,
    removeStateTransitionListeners,
    clearAllStateTransitionListeners
  };
}
