import eventEmitter from '../Events/core/globalEventEmitter';
import Queue from '../Components/AI/ai/dataStructures/Queue';

/**
 * Creates and manages the state of the application, handling transitions between states
 * and managing event subscriptions based on those states.
 *
 * @returns {Object} An object containing methods to interact with the state manager.
 */
export const StateManager = (managerID) => {
  const id = managerID;
  const state = { current: null };
  const unsubscribeQueue = Queue();
  const storedStates = new Map();
  const activeDynamic = new Map();

  const storeState = ({ state, fns }) => storedStates.set(state, fns);

  const transition = (targetState) => {
    while (!unsubscribeQueue.isEmpty()) {
      const event = unsubscribeQueue.dequeue();
      eventEmitter.unsubscribe(event.name, event.callback);
    }
    if (activeDynamic.size > 0) {
      activeDynamic.forEach((callback, event) => eventEmitter.unsubscribe(event, callback));
      activeDynamic.clear();
    }
    setCurrentState(targetState);
  };

  const handleDynamicSubscription = ({ enableOn, disableOn, executeOn, callback, scopedID }) => {
    const dynamicSubscribe = ({ data }) => {
      if (scopedID !== undefined && id !== data.scopedID) return;
      activeDynamic.set(executeOn, callback);
      eventEmitter.subscribe(executeOn, callback);
    };
    const dynamicUnsubscribe = ({ data }) => {
      if (scopedID !== undefined && scopedID !== data.scopedID) return;
      activeDynamic.delete(executeOn, callback);
      eventEmitter.unsubscribe(executeOn, callback);
    };
    eventEmitter.subscribe(enableOn, dynamicSubscribe);
    eventEmitter.subscribe(disableOn, dynamicUnsubscribe);
    unsubscribeQueue.enqueue({ name: enableOn, callback: dynamicSubscribe });
    unsubscribeQueue.enqueue({ name: disableOn, callback: dynamicUnsubscribe });
  };

  const setCurrentState = (targetState) => {
    const state = storedStates.get(targetState);
    if (!state) return;
    state.current = targetState;
    const { execute, subscribe, dynamic } = state;
    execute.forEach((fn) => fn());
    subscribe.forEach(({ event, callback }) => {
      eventEmitter.subscribe(event, callback);
      unsubscribeQueue.enqueue({ name: event, callback });
    });
    dynamic.forEach((dynamicSubscription) => handleDynamicSubscription(dynamicSubscription));
  };

  return {
    storeState,
    transition,
    getCurrentState: () => state.current,
    getID: () => id,
    isStateManager: () => true
  };
};
