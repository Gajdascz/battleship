import eventEmitter from '../events/eventEmitter';
import { createEventKeyGenerator } from '../utils/createEventKeyGenerator';

export const ScopedEventSwitcher = (scopes = []) => {
  let activeScope = null;
  const scopeManager = {};

  const createScopeManager = (scope) => {
    scopeManager[scope] = { ...createEventKeyGenerator(scope), events: [], callback: null };
  };

  const unsubscribeManagerEvents = (manager) => {
    manager.events.forEach((event) =>
      eventEmitter.unsubscribe(manager.getKey(event), manager.callback)
    );
  };
  const subscribeManagerEvents = (manager) => {
    manager.events.forEach((event) =>
      eventEmitter.subscribe(manager.getKey(event), manager.callback)
    );
  };

  const setAllScopeSubscriptions = (events, callback) => {
    if (activeScope) unsubscribeManagerEvents(scopeManager[activeScope]);
    Object.values(scopeManager).forEach((manager) => {
      manager.events = events;
      manager.callback = callback;
    });
  };

  const setScopeSubscriptions = (scope, events, callback) => {
    if (scope === activeScope) unsubscribeManagerEvents(scopeManager[scope]);
    const manager = scopeManager[scope];
    manager.events = events;
    manager.callback = callback;
  };

  scopes.forEach(createScopeManager);
  return {
    setAllScopeSubscriptions,
    setScopeSubscriptions,
    registerScope: (scope) => createScopeManager(scope),
    setActiveScope: (scope) => {
      const manager = scopeManager[scope];
      if (manager) {
        if (activeScope) unsubscribeManagerEvents(scopeManager[activeScope]);
        subscribeManagerEvents(manager);
        activeScope = scope;
      }
    },
    clearAllSubscriptions: () => {
      Object.values(scopeManager).forEach((manager) => {
        unsubscribeManagerEvents(manager);
        manager.events = [];
        manager.callback = null;
      });
    }
  };
};
