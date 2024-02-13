import { STATES } from '../constants/common';

export const StateBundler = () => {
  const _stateBundles = {
    [STATES.START]: {
      state: STATES.START,
      fns: {
        execute: [],
        subscribe: []
      }
    },
    [STATES.PLACEMENT]: {
      state: STATES.PLACEMENT,
      fns: {
        execute: [],
        subscribe: []
      }
    },
    [STATES.PROGRESS]: {
      state: STATES.PROGRESS,
      fns: {
        execute: [],
        subscribe: []
      }
    },
    [STATES.OVER]: {
      state: STATES.OVER,
      fns: {
        execute: [],
        subscribe: []
      }
    }
  };

  const addExecuteFnToState = (state, fn) => {
    if (!_stateBundles[state]) throw new Error(`Invalid State: ${state} does not exist`);
    _stateBundles[state].fns.execute.push(fn);
  };
  const addSubscriptionToState = (state, { event, callback }) => {
    if (!_stateBundles[state]) throw new Error(`Invalid State: ${state} does not exist`);
    _stateBundles[state].fns.subscribe.push({ event, callback });
  };

  return {
    getBundles: () => Object.values(_stateBundles),
    addExecuteFnToState,
    addSubscriptionToState
  };
};
