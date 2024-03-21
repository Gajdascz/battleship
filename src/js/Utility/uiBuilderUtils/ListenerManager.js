/**
 * Validates createEventController parameters.
 *
 * @param {Object} parameters Contains parameters for createEventController.
 */
const validateControllerParameters = (parameters) => {
  const { element, event, callback, key } = parameters;
  if (!(element === document || (element && element instanceof HTMLElement)))
    throw new Error(`Invalid Element: ${element}`);
  if (!(event && typeof event === 'string')) throw new Error(`Invalid Event String: ${event}`);
  if (!(callback && typeof callback === 'function'))
    throw new Error(`Invalid Callback Function: ${callback}`);
  if (!(key && typeof key === 'string')) throw new Error(`Invalid key string: ${key}`);
};

/**
 * Creates an event controller for managing a DOM event listener.
 *
 * @param {Object} params The parameters for creating an event controller.
 * @param {HTMLElement} params.element The DOM element to attach the event listener to.
 * @param {string} params.event The event type (e.g., 'click', 'change').
 * @param {Function} params.callback The callback function to execute when the event is triggered.
 * @param {string} params.key A unique key for the event controller.
 * @returns {Object} An object with methods to enable, disable the event listener, and check its active state.
 */
const createEventController = ({ element, event, callback, key }) => {
  validateControllerParameters({ element, event, callback, key });
  let isActive = false;
  const controller = {
    /**
     * Enables listener if not active.
     *
     * @returns {Object} This controller object to enable chaining.
     */
    enable: () => {
      if (isActive) return;
      element.addEventListener(event, callback);
      if (element.tagName === 'BUTTON') element.disabled = false;
      isActive = true;
      return controller;
    },
    /**
     * Disables listener if active.
     *
     * @returns {Object} This controller object to enable chaining.
     */
    disable: () => {
      if (!isActive) return;
      element.removeEventListener(event, callback);
      if (element.tagName === 'BUTTON') element.disabled = true;
      isActive = false;
      return controller;
    },
    isActive: () => isActive,
    getKey: () => key
  };
  return controller;
};

/**
 * Creates a manager for handling multiple event controllers.
 *
 * @returns {Object} The listener manager with methods to add, enable, disable, and remove event listeners.
 */
export const ListenerManager = () => {
  const activeControllers = new Map();
  const inactiveControllers = new Map();

  /**
   * Ensures efficient and consistent updates when enabling and disabling listeners.
   *
   * @param {Object} controller Event controller object.
   */
  const updateControllers = (controller) => {
    if (controller.isActive()) {
      activeControllers.set(controller.getKey(), controller);
      inactiveControllers.delete(controller.getKey());
    } else {
      inactiveControllers.set(controller.getKey(), controller);
      activeControllers.delete(controller.getKey());
    }
  };

  /**
   * Adds a new event controller to the manager.
   *
   * @param {Object} config Configuration object for the event controller.
   * @param {HTMLElement} config.element The DOM element to attach the event listener to.
   * @param {string} config.event The event type.
   * @param {Function} config.callback The callback function for the event.
   * @param {string} config.key A unique keyfor the controller.
   * @param {boolean} [config.enable=false] Whether to enable the event listener immediately upon adding.
   */
  const addController = ({ element, event, callback, key, enable = false }) => {
    const controller = createEventController({
      element,
      event,
      callback,
      key
    });
    if (enable) {
      controller.enable();
      activeControllers.set(key, controller);
    } else inactiveControllers.set(key, controller);
  };

  /**
   * Returned manager Object containing utilities for interacting with event controller.
   * All methods consistently update the active/inactive Maps and ensure listeners are disabled before deletion.
   */
  const manager = {
    addController,
    enableListener: (key) => {
      const enabledListener = inactiveControllers.get(key)?.enable();
      if (enabledListener) updateControllers(enabledListener);
    },
    disableListener: (key) => {
      const disabledListener = activeControllers.get(key)?.disable();
      if (disabledListener) updateControllers(disabledListener);
    },
    enableAllListeners: () =>
      inactiveControllers.forEach((controller, key) => manager.enableListener(key)),
    disableAllListeners: () =>
      activeControllers.forEach((controller, key) => manager.disableListener(key)),
    removeListener: (key) => {
      manager.disableListener(key);
      inactiveControllers.delete(key);
    },
    reset: () => {
      manager.disableAllListeners();
      inactiveControllers.clear();
    }
  };
  return manager;
};
