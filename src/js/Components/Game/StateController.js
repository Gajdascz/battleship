import stateManagerRegistry from '../../State/stateManagerRegistry';
import globalEmitter from '../../Events/core/globalEventEmitter';
import { GAME_EVENTS } from '../../Events/eventConstants';
import { STATES } from '../../Utility/constants/common';

export const StateController = () => {
  let isEnabled = false;
  const publishStateTransition = (state) => {
    console.log(state);
    globalEmitter.publish(GAME_EVENTS.STATE_CHANGED, state);
  };
  const getCurrentState = () => stateManagerRegistry.getCurrentState();
  const stateSubscriptions = {
    [STATES.START]: [],
    [STATES.PLACEMENT]: [],
    [STATES.PROGRESS]: [],
    [STATES.OVER]: [],
    unsubscribeAll: (state) =>
      stateSubscriptions[state].forEach(({ event, callback }) =>
        globalEmitter.unsubscribe(event, callback)
      ),
    subscribeAll: (state) =>
      stateSubscriptions[state].forEach(({ event, callback }) =>
        globalEmitter.subscribe(event, callback)
      ),
    reset: () =>
      [STATES.START, STATES.PLACEMENT, STATES.PROGRESS, STATES.OVER].forEach((state) => {
        stateSubscriptions.unsubscribeAll(state);
        stateSubscriptions[state].length = 0;
      })
  };

  const transition = () => {
    const state = getCurrentState();
    switch (state) {
      case null:
        stateSubscriptions.subscribeAll(STATES.START);
        publishStateTransition(STATES.START);
        break;
      case STATES.START:
        stateSubscriptions.subscribeAll(STATES.PLACEMENT);
        publishStateTransition(STATES.PLACEMENT);
        break;
      case STATES.PLACEMENT:
        stateSubscriptions.unsubscribeAll(state);
        stateSubscriptions.subscribeAll(STATES.PROGRESS);
        publishStateTransition(STATES.PROGRESS);
        break;
      case STATES.PROGRESS:
        stateSubscriptions.unsubscribeAll(state);
        publishStateTransition(STATES.OVER);
        break;
      case STATES.OVER:
        break;
    }
  };
  const enable = () => {
    if (isEnabled) return;
    globalEmitter.subscribe(GAME_EVENTS.STATE_CHANGED, stateManagerRegistry.transition);
    isEnabled = true;
  };
  const disable = () => {
    if (!isEnabled) return;
    globalEmitter.unsubscribe(GAME_EVENTS.STATE_CHANGED, stateManagerRegistry.transition);
    isEnabled = false;
  };

  const addStateSubscription = (state, { event, callback }) =>
    stateSubscriptions[state].push({ event, callback });

  return {
    getCurrentState,
    transition,
    enable,
    disable,
    addSubscriptionToStart: (event, callback) =>
      addStateSubscription(STATES.START, { event, callback }),
    addSubscriptionToPlacement: (event, callback) =>
      addStateSubscription(STATES.PLACEMENT, { event, callback }),
    addSubscriptionToProgress: (event, callback) =>
      addStateSubscription(STATES.PROGRESS, { event, callback }),
    addSubscriptionToOver: (event, callback) =>
      addStateSubscription(STATES.OVER, { event, callback }),
    reset: () => {
      stateSubscriptions.reset();
      disable();
    }
  };
};
