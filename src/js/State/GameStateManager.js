import { STATES } from '../Utility/constants/common';

const FN_TYPES = {
  ENTER: 'onEnter',
  EXIT: 'onExit'
};

export const GameStateManager = (
  managerID,
  gameStates = [STATES.START, STATES.PLACEMENT, STATES.PROGRESS, STATES.OVER]
) => {
  let isInitialized = false;
  const id = managerID;

  const allStates = [...gameStates];
  const current = { state: null };
  const isStateManager = true;

  const states = Object.fromEntries(
    allStates.map((state) => [state, { [FN_TYPES.ENTER]: [], [FN_TYPES.EXIT]: [] }])
  );
  const isValidState = (state) => {
    if (!Object.values(STATES).some((validState) => validState === state))
      throw new Error(`Invalid State: ${state}`);
  };

  const setAllStates = (states) => {
    reset();
    allStates.length = 0;
    allStates.push(...states);
  };

  const execute = (callbacks) => {
    callbacks.forEach((fn) => fn());
  };
  const executeCurrentExit = () => execute(states[current.state][FN_TYPES.EXIT]);
  const executeCurrentEnter = () => execute(states[current.state][FN_TYPES.ENTER]);

  const initialize = (firstState) => {
    if (isInitialized) return;
    isValidState(firstState);
    current.state = firstState;
    executeCurrentEnter();
    isInitialized = true;
  };

  const reset = () => {
    if (!isInitialized) return;
    executeCurrentExit();
    current.state = null;
    isInitialized = false;
  };

  const transition = (targetState) => {
    isValidState(targetState);
    executeCurrentExit();
    current.state = targetState;
    executeCurrentEnter();
  };
  const setStateFns = (state, enter, exit) => {
    if (enter) {
      const onEnter = Array.isArray(enter) ? enter : [enter];
      states[state][FN_TYPES.ENTER] = onEnter;
    }
    if (exit) {
      const onExit = Array.isArray(exit) ? exit : [exit];
      states[state][FN_TYPES.EXIT] = onExit;
    }
  };

  const loadConfig = (configurations) => {
    configurations.forEach((config) => setStateFns(config.state, config.enter, config.exit));
  };

  return {
    getID: () => id,
    initialize,
    getCurrentState: () => current.state,
    reset,
    transition,
    setAllStates,
    loadConfig,
    setFunctions: {
      start: ({ enterFns = null, exitFns = null }) => setStateFns(STATES.START, enterFns, exitFns),
      placement: ({ enterFns = null, exitFns = null }) =>
        setStateFns(STATES.PLACEMENT, enterFns, exitFns),
      progress: ({ enterFns = null, exitFns = null }) =>
        setStateFns(STATES.PROGRESS, enterFns, exitFns),
      over: ({ enterFns = null, exitFns = null }) => setStateFns(STATES.OVER, enterFns, exitFns)
    },
    isStateManager
  };
};
