import { STATES } from '../constants/common';
import { StateManager } from './StateManager';
import stateManagerRegistry from './stateManagerRegistry';
import { createEventKeyGenerator } from '../utils/createEventKeyGenerator';
export const StateCoordinator = (scopedID, scope) => {
  const manager = StateManager(scopedID);
  const { getKey } = createEventKeyGenerator(scope);
  const stateBundles = {
    [STATES.START]: {
      state: STATES.START,
      fns: {
        execute: [],
        subscribe: [],
        dynamic: []
      }
    },
    [STATES.PLACEMENT]: {
      state: STATES.PLACEMENT,
      fns: {
        execute: [],
        subscribe: [],
        dynamic: []
      }
    },
    [STATES.PROGRESS]: {
      state: STATES.PROGRESS,
      fns: {
        execute: [],
        subscribe: [],
        dynamic: []
      }
    },
    [STATES.OVER]: {
      state: STATES.OVER,
      fns: {
        execute: [],
        subscribe: [],
        dynamic: []
      }
    }
  };

  const validate = (state, fn) => {
    if (!stateBundles[state]) throw new Error(`Invalid State: ${state} does not exist`);
    if (!fn || typeof fn !== 'function') throw new Error(`Invalid Function.`);
  };

  const addExecuteFnToState = (state, fn) => {
    validate(state, fn);
    stateBundles[state].fns.execute.push(fn);
  };
  const addSubscriptionToState = (state, { event, callback }) => {
    validate(state, callback);
    stateBundles[state].fns.subscribe.push({ event: getKey(event), callback });
  };

  const addDynamicSubscriptionToState = (
    state,
    { event, callback, subscribeTrigger, unsubscribeTrigger, id }
  ) => {
    validate(state, callback);
    stateBundles[state].fns.dynamic.push({
      event: getKey(event),
      callback,
      subscribeTrigger: getKey(subscribeTrigger),
      unsubscribeTrigger: getKey(unsubscribeTrigger),
      id
    });
  };

  return {
    start: {
      addExecute: (fn) => addExecuteFnToState(STATES.START, fn),
      addSubscribe: (event, callback) => addSubscriptionToState(STATES.START, { event, callback }),
      addDynamic: ({ event, callback, subscribeTrigger, unsubscribeTrigger, id }) =>
        addDynamicSubscriptionToState(STATES.START, {
          event,
          callback,
          subscribeTrigger,
          unsubscribeTrigger,
          id
        })
    },
    placement: {
      addExecute: (fn) => addExecuteFnToState(STATES.PLACEMENT, fn),
      addSubscribe: (event, callback) =>
        addSubscriptionToState(STATES.PLACEMENT, { event, callback }),
      addDynamic: ({ event, callback, subscribeTrigger, unsubscribeTrigger, id }) =>
        addDynamicSubscriptionToState(STATES.PLACEMENT, {
          event,
          callback,
          subscribeTrigger,
          unsubscribeTrigger,
          id
        })
    },
    progress: {
      addExecute: (fn) => addExecuteFnToState(STATES.PROGRESS, fn),
      addSubscribe: (event, callback) =>
        addSubscriptionToState(STATES.PROGRESS, { event, callback }),
      addDynamic: ({ event, callback, subscribeTrigger, unsubscribeTrigger, id }) =>
        addDynamicSubscriptionToState(STATES.PROGRESS, {
          event,
          callback,
          subscribeTrigger,
          unsubscribeTrigger,
          id
        })
    },
    over: {
      addExecute: (fn) => addExecuteFnToState(STATES.OVER, fn),
      addSubscribe: (event, callback) => addSubscriptionToState(STATES.OVER, { event, callback }),
      addDynamic: ({ event, callback, subscribeTrigger, unsubscribeTrigger, id }) =>
        addDynamicSubscriptionToState(STATES.OVER, {
          event,
          callback,
          subscribeTrigger,
          unsubscribeTrigger,
          id
        })
    },
    initializeManager: () => {
      Object.values(stateBundles).forEach((bundle) => manager.storeState(bundle));
      stateManagerRegistry.registerManager(manager);
    },
    reset: () =>
      Object.values(stateBundles).forEach((bundle) => {
        Object.keys(bundle.fns).forEach((key) => (bundle.fns[key].length = 0));
      })
  };
};