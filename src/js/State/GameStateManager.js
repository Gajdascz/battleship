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
    const onEnter = Array.isArray(enter) ? enter : [enter];
    const onExit = Array.isArray(exit) ? exit : [exit];
    states[state][FN_TYPES.ENTER] = onEnter;
    states[state][FN_TYPES.EXIT] = onExit;
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
      start: (enterFn, exitFn) => setStateFns(STATES.START, enterFn, exitFn),
      placement: (enterFn, exitFn) => setStateFns(STATES.PLACEMENT, enterFn, exitFn),
      progress: (enterFn, exitFn) => setStateFns(STATES.PROGRESS, enterFn, exitFn),
      over: (enterFn, exitFn) => setStateFns(STATES.OVER, enterFn, exitFn)
    },
    isStateManager
  };
};
