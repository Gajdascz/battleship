import { EventEmitter } from '../core/EventEmitter';

const EventDefinitionManager = (base = {}, global = {}, initialScopes) => {
  const scopes = [];
  const events = {
    global,
    base,
    scoped: {}
  };
  const setBaseEvents = (newEvents) => {
    events.base = newEvents;
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

  const buildScopedEvents = () => {
    scopes.forEach((scope) => {
      events.scoped[scope] = {};
      Object.entries(events.base).forEach(
        ([key, value]) => (events.scoped[scope][key] = createKey(scope, value))
      );
    });
  };
  if (initialScopes) {
    initialScopes.forEach((scope) => scopes.push(scope));
    buildScopedEvents();
  }
  return {
    createKey,
    addScope,
    removeScope,
    buildScopedEvents,
    setBaseEvents,
    setGlobalEvents,
    getGlobalEvents: () => events.global,
    getBaseEvents: () => events.base,
    getScopedEvents: () => events.scoped
  };
};

export const EventManager = (eventsConfig) => {
  const { subscribe, unsubscribe, publish } = EventEmitter();
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
  const offAll = () => removeAllSubscriptions();
  const emit = (event, data) => publish(event, data);

  return {
    on,
    off,
    offAll,
    emit,
    events
  };
};
