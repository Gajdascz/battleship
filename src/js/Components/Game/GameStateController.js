const FN_TYPES = {
  ENTER: 'onEnter',
  EXIT: 'onExit'
};

/**
 * Controls game state transitions and event triggers.
 *
 * @param {string[]} initialStates Optional array of initial state names to add on creation.
 * @returns {Object} An interface for adding states, managing transitions, and handling entry/exit events.
 */
export const GameStateController = (initialStates = []) => {
  const states = { current: null };

  const addState = (stateName) => (states[stateName] = { onEnter: [], onExit: [] });

  const setCurrentState = (state) => {
    states.current = state;
    executeCurrentEnter();
  };

  const startGame = (firstState) => {
    if (states.current) executeCurrentExit();
    setCurrentState(firstState);
  };

  const execute = (callbacks) => callbacks.forEach((fn) => fn());
  const executeCurrentExit = () => execute(states[states.current][FN_TYPES.EXIT]);
  const executeCurrentEnter = () => execute(states[states.current][FN_TYPES.ENTER]);

  const transitionTo = (newState) => {
    executeCurrentExit();
    setCurrentState(newState);
  };

  const exitCurrent = () => {
    executeCurrentExit();
    states.current = null;
  };

  if (initialStates.length > 0) initialStates.forEach((state) => addState(state));

  return {
    addState,
    onEnter: (state, callback) => states[state][FN_TYPES.ENTER].push(callback),
    onExit: (state, callback) => states[state][FN_TYPES.EXIT].push(callback),
    startGame,
    transitionTo,
    exitCurrent
  };
};
