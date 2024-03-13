const FN_TYPES = {
  ENTER: 'onEnter',
  EXIT: 'onExit'
};
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
    executeCurrentEnter();
  };

  const execute = (callbacks) => callbacks.forEach((fn) => fn());
  const executeCurrentExit = () => execute(states[states.current][FN_TYPES.EXIT]);
  const executeCurrentEnter = () => execute(states[states.current][FN_TYPES.ENTER]);

  const transitionTo = (newState) => {
    executeCurrentExit();
    setCurrentState(newState);
    executeCurrentEnter();
  };

  const resetGame = () => {
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
    resetGame
  };
};
