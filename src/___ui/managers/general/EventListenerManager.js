export default function EventListenerManager() {
  const _listeners = new Map();

  const validateListenerDataInput = (key, triggerFunctionMap, element) => {
    if (!key || !triggerFunctionMap || !element) throw new Error('Nullish input not accepted');
    if (!(element instanceof HTMLElement || element === document))
      throw new Error(`Invalid element or document: ${element}`);
    Object.entries(triggerFunctionMap).forEach(([trigger, fns]) => {
      if (typeof trigger !== 'string') throw new Error('Invalid trigger. Expected a string.');
      const isValidFn =
        typeof fns === 'function' ||
        (Array.isArray(fns) && fns.every((fn) => typeof fn === 'function'));
      if (!isValidFn) {
        throw new Error(
          `Invalid callback function or functions array for trigger ${trigger}: ${fns}`
        );
      }
    });
  };

  const createTriggerFunctionMap = (triggerFunctionObj) => {
    const entries = Object.entries(triggerFunctionObj).map(([trigger, fns]) => {
      const functions = Array.isArray(fns) ? fns : [fns];
      return [trigger, functions];
    });
    return new Map(entries);
  };

  const addListenerData = ({ key, triggerFunctionObj, element = document, validate = false }) => {
    if (_listeners.has(key)) return console.warn(`Listeners for key ${key} already exist.`);
    const triggerFunctionMap = createTriggerFunctionMap(triggerFunctionObj);
    if (validate) validateListenerDataInput(key, triggerFunctionMap, element);
    _listeners.set(key, {
      element,
      triggerFunctionMap,
      isAttached: false
    });
  };

  const getListenerData = (key) => {
    if (!_listeners.has(key)) return console.warn(`Listener with key: ${key} not found`);
    return _listeners.get(key);
  };

  const attachListener = (key) => {
    const listenerData = getListenerData(key);
    if (listenerData && !listenerData.isAttached) {
      listenerData.triggerFunctionMap.forEach((fns, trigger) => {
        fns.forEach((fn) => listenerData.element.addEventListener(trigger, fn));
      });
      listenerData.isAttached = true;
    }
  };

  const detachListener = (key) => {
    const listenerData = getListenerData(key);
    if (listenerData && listenerData.isAttached) {
      listenerData.triggerFunctionMap.forEach((fns, trigger) => {
        fns.forEach((fn) => listenerData.element.removeEventListener(trigger, fn));
      });
      listenerData.isAttached = false;
    }
  };

  const attachAllListeners = () => [..._listeners.keys()].forEach((key) => attachListener(key));
  const detachAllListeners = () => [..._listeners.keys()].forEach((key) => detachListener(key));

  const destructListener = (key) => {
    const listener = getListenerData(key);
    if (listener) {
      detachListener(key);
      _listeners.delete(key);
    }
  };
  return {
    addListenerData,
    attachListener,
    detachListener,
    destructListener,
    attachAllListeners,
    detachAllListeners,
    destructAllListenerData: () => {
      detachAllListeners();
      _listeners.clear();
    },
    hasListeners: () => _listeners.size > 0
  };
}
