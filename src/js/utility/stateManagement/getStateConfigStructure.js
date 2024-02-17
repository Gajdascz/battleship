import { STATES } from '../constants/common';

const getStateConfigStructure = () => ({
  [STATES.START]: {
    state: STATES.START,
    fns: { execute: [], subscribe: [], dynamic: [] }
  },
  [STATES.PLACEMENT]: {
    state: STATES.PLACEMENT,
    fns: { execute: [], subscribe: [], dynamic: [] }
  },
  [STATES.PROGRESS]: {
    state: STATES.PROGRESS,
    fns: { execute: [], subscribe: [], dynamic: [] }
  },
  [STATES.OVER]: {
    state: STATES.OVER,
    fns: { execute: [], subscribe: [], dynamic: [] }
  }
});
export const getStateConfig = () => {
  const config = getStateConfigStructure();
  return {
    start: {
      addExecute: (fn) => config[STATES.START].execute.push(fn),
      addSubscribe: (event, fn) => config[STATES.START].subscribe.push(event, fn),
      addDynamic: ({ event, callback, subscribeTrigger, unsubscribeTrigger, id }) => {
        config[STATES.START].dynamic.push({
          event,
          callback,
          subscribeTrigger,
          unsubscribeTrigger,
          id
        });
      }
    }
  }({
    [STATES.START]: {
      state: STATES.START,
      fns: { execute: [], subscribe: [], dynamic: [] }
    },
    [STATES.PLACEMENT]: {
      state: STATES.PLACEMENT,
      fns: { execute: [], subscribe: [], dynamic: [] }
    },
    [STATES.PROGRESS]: {
      state: STATES.PROGRESS,
      fns: { execute: [], subscribe: [], dynamic: [] }
    },
    [STATES.OVER]: {
      state: STATES.OVER,
      fns: { execute: [], subscribe: [], dynamic: [] }
    }
  });
};
