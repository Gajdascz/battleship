import { STATES } from '../constants/common';
import { StateManager } from './StateManager';
import stateManagerRegistry from './stateManagerRegistry';
import { createEventKeyGenerator } from '../utils/stringUtils';
export const StateCoordinator = (id, scope) => {
  const manager = StateManager(id);
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
    { event, callback, subscribeTrigger, unsubscribeTrigger }
  ) => {
    validate(state, callback);
    stateBundles[state].fns.dynamic.push({
      event: getKey(event),
      callback,
      subscribeTrigger: getKey(subscribeTrigger),
      unsubscribeTrigger: getKey(unsubscribeTrigger)
    });
  };

  return {
    addExecuteFnToState,
    addSubscriptionToState,
    addDynamicSubscriptionToState,
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
