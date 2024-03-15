import { EventEmitter } from '../core/EventEmitter';

const EventDefinitionManager = (base = {}, global = {}, initialScopes = []) => {
  const scopes = [];
  const events = {
    global,
    base: {},
    scoped: {},
    baseTypes: {}
  };
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
  const setGlobalEvents = (newEvents) => (events.global = newEvents);
  const createKey = (scope, event) => `${scope}@${event}`;
  const addScope = (scope) => {
    scopes.push(scope);
    buildScopedEvents();
  };
  const removeScope = (scope) => {
    const index = scopes.findIndex((s) => s === scope);
    if (index === -1) return;
    scopes.splice(index, 1);
    delete events.scoped[scope];
  };

  const scopeEvents = (scope, eventObj, scopedObj = {}) => {
    Object.entries(eventObj).forEach(([key, value]) => {
      if (typeof value === 'object') {
        scopedObj[key] = {};
        scopeEvents(scope, value, scopedObj[key]);
      } else scopedObj[key] = createKey(scope, value);
    });
    return scopedObj;
  };

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

export const EventManager = (eventsConfig) => {
  const emitter = EventEmitter();
  const { subscribe, unsubscribe, publish } = emitter;
  const { global, base, scopes } = eventsConfig;
  let subscriptionTracker = [];
  const events = EventDefinitionManager(base, global, scopes);
  const addSubscription = (event, callback) => {
    subscribe(event, callback);
    subscriptionTracker.push({ event, callback });
  };
  const removeSubscription = (event, callback) => {
    unsubscribe(event, callback);
    subscriptionTracker = subscriptionTracker.filter(
      (e) => !(e.event === event && e.callback === callback)
    );
  };
  const removeAllSubscriptions = () => {
    subscriptionTracker.forEach(({ event, callback }) => unsubscribe(event, callback));
    subscriptionTracker = [];
  };
  const on = (event, callback) => {
    addSubscription(event, callback);
  };
  const off = (event, callback) => {
    removeSubscription(event, callback);
  };
  const emit = (event, data) => publish(event, data);

  return {
    on,
    off,
    offAll: removeAllSubscriptions,
    emit,
    events,
    reset: () => {
      removeAllSubscriptions();
      events.reset();
      emitter.reset();
    }
  };
};
