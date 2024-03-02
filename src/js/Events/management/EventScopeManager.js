import { globalEmitter } from '../core/globalEventEmitter';
import { createEventKeyGenerator } from '../../Utility/utils/createEventKeyGenerator';

/**
 * Manages event subscriptions within defined scopes. Enables subscribing to events for specific or all scopes,
 * switching active scopes to control event listening, and clearing subscriptions.
 *
 * @param {string[]} scopes Initial list of scopes to manage.
 * @returns {Object} An interface for managing scope-specific event subscriptions.
 */
export const EventScopeManager = (scopes = []) => {
  let active = null;
  const eventScopeRegistry = {};

  /**
   * Registers a new scope with the ability to attach events and callbacks.
   *
   * @param {string} scope Scope identifier.
   */
  const addScopeToRegistry = (scope) => {
    eventScopeRegistry[scope] = { ...createEventKeyGenerator(scope), event: null, callback: null };
  };

  /**
   * Removes the event subscription for a given scope.
   *
   * @param {Object} manager The scope's event and callback management object.
   */
  const unsubscribeScopeEvent = (manager) =>
    globalEmitter.unsubscribe(manager.getKey(manager.event), manager.callback);

  /**
   * Adds an event subscription for a given scope.
   *
   * @param {Object} manager The scope's event and callback management object.
   */
  const subscribeScopeEvent = (manager) =>
    globalEmitter.subscribe(manager.getKey(manager.event), manager.callback);

  /**
   * Publishes an event using the currently active scope.
   *
   * @param {string} event Event to scope and publish.
   * @param {*} data Data to provide
   */
  const publishActiveScopeEvent = (event, data = null) => {
    if (active) globalEmitter.publish(active.manager.getKey(event), data);
  };

  /**
   * Applies the same event and callback to all registered scopes.
   *
   * @param {string} event Event name to subscribe to.
   * @param {Function} callback Callback to execute when the event is emitted.
   */
  const setAllScopeDetails = (event, callback) => {
    if (active) unsubscribeScopeEvent(eventScopeRegistry[active.scope]);
    Object.values(eventScopeRegistry).forEach((manager) => {
      manager.event = event;
      manager.callback = callback;
    });
    if (active) setActiveScope(active.scope);
  };

  /**
   * Sets the event and callback for a specific scope.
   *
   * @param {string} scope The scope to set the event and callback for.
   * @param {string} event Event name to subscribe to.
   * @param {Function} callback Callback to execute when the event is emitted.
   */
  const setScopeDetails = (scope, event, callback) => {
    if (scope === active?.scope) unsubscribeScopeEvent(eventScopeRegistry[scope]);
    const manager = eventScopeRegistry[scope];
    manager.event = event;
    manager.callback = callback;
    setActiveScope(scope);
  };

  /**
   * Activates a scope, making its subscriptions active and deactivating the previous scope.
   *
   * @param {string} scope The scope to activate.
   */
  const setActiveScope = (scope) => {
    const manager = eventScopeRegistry[scope];
    if (manager) {
      if (active) unsubscribeScopeEvent(eventScopeRegistry[active.scope]);
      subscribeScopeEvent(manager);
      active = { scope, manager, isEnabled: true };
    }
  };

  const enableActiveScope = () => {
    console.log(active);
    if (!active || active.isEnabled) return;
    console.log(active.manager);
    subscribeScopeEvent(active.manager);
  };

  const disableActiveScope = () => {
    if (!active || !active.isEnabled) return;
    unsubscribeScopeEvent(active.manager);
  };

  // Registers all scopes given as parameter
  scopes.forEach(addScopeToRegistry);
  return {
    setAllScopeDetails,
    setScopeDetails,
    addScopeToRegistry,
    setActiveScope,
    publishActiveScopeEvent,
    enableActiveScope,
    disableActiveScope,
    clearAllSubscriptions: () => {
      Object.values(eventScopeRegistry).forEach((manager) => {
        unsubscribeScopeEvent(manager);
        manager.event = [];
        manager.callback = null;
      });
    }
  };
};
