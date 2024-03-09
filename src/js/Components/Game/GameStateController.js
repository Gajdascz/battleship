import { STATES } from '../../Utility/constants/common';

const FN_TYPES = {
  ENTER: 'onEnter',
  EXIT: 'onExit'
};
export const GameStateController = (emitter, transitionTriggers) => {
  const { subscribe, unsubscribe } = emitter;
  const { startTrigger, placementTrigger, progressTrigger } = transitionTriggers;

  const states = {
    current: null,
    [STATES.START]: {
      subTransitionTrigger: () => subscribe(startTrigger, transition),
      unsubTransitionTrigger: () => unsubscribe(startTrigger, transition),
      onEnter: [],
      onExit: []
    },
    [STATES.PLACEMENT]: {
      subTransitionTrigger: () => subscribe(placementTrigger, transition),
      unsubTransitionTrigger: () => unsubscribe(placementTrigger, transition),
      onEnter: [],
      onExit: []
    },
    [STATES.PROGRESS]: {
      subTransitionTrigger: () => subscribe(progressTrigger, transition),
      unsubTransitionTrigger: () => unsubscribe(progressTrigger, transition),
      onEnter: [],
      onExit: []
    }
  };
  const setCurrentState = (state) => (states.current = state);
  const subCurrentTransitionTrigger = () => states[states.current].subTransitionTrigger();
  const unsubCurrentTransitionTrigger = () => states[states.current].unsubTransitionTrigger();

  const startGame = () => {
    setCurrentState(STATES.START);
    subCurrentTransitionTrigger();
  };

  const execute = (callbacks) => callbacks.forEach((fn) => fn());
  const executeCurrentExit = () => execute(states[states.current][FN_TYPES.EXIT]);
  const executeCurrentEnter = () => execute(states[states.current][FN_TYPES.ENTER]);

  const getNextState = () => {
    switch (states.current) {
      case null:
        return STATES.START;
      case STATES.START:
        return STATES.PLACEMENT;
      case STATES.PLACEMENT:
        return STATES.PROGRESS;
      case STATES.PROGRESS:
        return STATES.OVER;
      case STATES.OVER:
        return null;
    }
  };

  const transition = () => {
    unsubCurrentTransitionTrigger();
    executeCurrentExit();
    setCurrentState(getNextState());
    subCurrentTransitionTrigger();
    executeCurrentEnter();
  };

  const resetGame = () => {
    unsubCurrentTransitionTrigger();
    executeCurrentEnter();
    setCurrentState(null);
  };

  return {
    addOnStateEnter: (state, fn) => states[state].onEnter.push(fn),
    addOnStateExit: (state, fn) => states[state].onExit.push(fn),
    startGame,
    resetGame
  };
};
