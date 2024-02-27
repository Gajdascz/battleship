import { STATES } from '../Utility/constants/common';
import stateManagerRegistry from './stateManagerRegistry';

export const StateCoordinator = () => {
  const stateOrder = [STATES.START, STATES.PLACEMENT, STATES.PROGRESS, STATES.OVER];

  const current = { state: null };

  const states = {
    [STATES.START]: { onEnter: [], onExit: [] },
    [STATES.PLACEMENT]: { onEnter: [], onExit: [] },
    [STATES.PROGRESS]: { onEnter: [], onExit: [] },
    [STATES.OVER]: { onEnter: [], onExit: [] }
  };

  const transition = () => {
    if (current.state === null) {
      current.state = stateOrder[0];
      states[current.state].onEnter.forEach((fn) => fn());
    } else {
      const currentIndex = stateOrder.findIndex((state) => state === current.state);
      states[current.state].onExit.forEach((fn) => fn());
      if (currentIndex >= 0 && currentIndex < stateOrder.length - 1) {
        const nextState = stateOrder[currentIndex + 1];
        current.state = nextState;
        states[current.state].onEnter.forEach((fn) => fn());
      }
    }
  };

  const addOnEnterToState = (state, enterFn) => states[state]?.onEnter.push(enterFn);
  const addOnExitToState = (state, exitFn) => states[state]?.onExit.push(exitFn);

  return {
    transition,
    start: {
      addEnter: (fn) => addOnEnterToState(states[STATES.START], fn),
      addExit: (fn) => addOnExitToState(states[STATES.START], fn)
    },
    placement: {
      addEnter: (fn) => addOnEnterToState(states[STATES.PLACEMENT], fn),
      addExit: (fn) => addOnExitToState(states[STATES.PLACEMENT], fn)
    },
    progress: {
      addEnter: (fn) => addOnEnterToState(states[STATES.PROGRESS], fn),
      addExit: (fn) => addOnExitToState(states[STATES.PROGRESS], fn)
    },
    over: {
      addEnter: (fn) => addOnEnterToState(states[STATES.OVER], fn),
      addExit: (fn) => addOnExitToState(states[STATES.OVER], fn)
    }
  };
};
