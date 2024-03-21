/**
 * Initializes an EventDefinitionManager for managing event types in a pub/sub system.
 * Supports event types:
 *  global: application-wide,
 *  base: template for scoping,
 *  scoped: specified within a given scope.
 *
 * @param {Object} [base={}] Initial base events template.
 * @param {Object} [global={}] Initial global events, accessible application-wide.
 * @param {Object} [initialScopes=[]] Initial scopes to create scoped events from base events.
 * @returns {Object} An interface to manage event definitions, including adding/removing scopes, and getting events.
 */
export const EventDefinitionManager = (base = {}, global = {}, initialScopes = []) => {
  const scopes = [];
  const events = {
    global,
    base: {},
    scoped: {},
    baseTypes: {}
  };

  /**
   * Updates base events and generates scoped events from them.
   * @param {Object} newEvents Events to set as base.
   */
  const setBaseEvents = (newEvents) => {
    events.base = newEvents;
    Object.entries(events.base).forEach(([key, value]) => {
      if (typeof value === 'object') {
        const typeKey = key.toUpperCase().replace(/ /g, '_');
        events.baseTypes[typeKey] = key;
      }
    });
    buildScopedEvents();
  };

  /**
   * Sets global events.
   * @param {Object} newEvents Global events to set.
   */
  const setGlobalEvents = (newEvents) => (events.global = newEvents);

  /**
   * Generates a unique identifier for a scoped event.
   * @param {string} scope The scope of the event.
   * @param {string} event The event name.
   * @returns {string} A scoped event key.
   */
  const createKey = (scope, event) => `${scope}@${event}`;

  /**
   * Adds a new scope and generates its events.
   * @param {string} scope The scope to add.
   */
  const addScope = (scope) => {
    scopes.push(scope);
    buildScopedEvents();
  };
  /**
   * Removes a scope and its associated events.
   * @param {string} scope The scope to remove.
   */
  const removeScope = (scope) => {
    const index = scopes.findIndex((s) => s === scope);
    if (index === -1) return;
    scopes.splice(index, 1);
    delete events.scoped[scope];
  };

  /**
   * Creates scoped events for specified scope.
   *
   * @param {string} scope The scope for the events.
   * @param {Object} eventObj Events to scope.
   * @param {Object} [scopedObj={}] Object to hold scoped events.
   * @returns {Object} Scoped events.
   */
  const scopeEvents = (scope, eventObj, scopedObj = {}) => {
    Object.entries(eventObj).forEach(([key, value]) => {
      if (typeof value === 'object') {
        scopedObj[key] = {};
        scopeEvents(scope, value, scopedObj[key]);
      } else scopedObj[key] = createKey(scope, value);
    });
    return scopedObj;
  };

  /**
   * Scopes all base-events using stored scopes
   */
  const buildScopedEvents = () =>
    scopes.forEach((scope) => (events.scoped[scope] = scopeEvents(scope, events.base)));

  if (Object.values(base).length > 0) setBaseEvents(base);
  if (initialScopes.length > 0) {
    initialScopes.forEach((scope) => scopes.push(scope));
    buildScopedEvents();
  }
  const reset = () => {
    events.global = {};
    events.base = {};
    events.scoped = {};
    events.baseTypes = {};
    scopes.length = 0;
  };
  return {
    createKey,
    addScope,
    removeScope,
    buildScopedEvents,
    setBaseEvents,
    setGlobalEvents,
    getGlobalEvents: () => events.global,
    getBaseEvents: () => events.base,
    getScopedEvents: () => events.scoped,
    getBaseTypes: () => events.baseTypes,
    reset
  };
};
