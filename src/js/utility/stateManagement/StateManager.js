import eventEmitter from '../eventEmitter';
import Queue from '../../components/AI/ai/dataStructures/Queue';

/**
 * Creates and manages the state of the application, handling transitions between states
 * and managing event subscriptions based on those states.
 *
 * @returns {Object} An object containing methods to interact with the state manager.
 */
export const StateManager = (id) => {
  const _id = id;
  const _state = { current: null };
  const unsubscribeQueue = Queue();
  const _storedStates = new Map();

  /**
   * Stores a state along with associated functions for execution, publishing events, and subscribing to events.
   *
   * @param {string} state The name of the state to store.
   * @param {{execute: Function[], subscribe: Function[]}} fns An object containing arrays of functions for execution, and event subscription.
   */
  const storeState = ({ state, fns }) => _storedStates.set(state, fns);

  /**
   * Transitions to a given target state, unsubscribing from events of the current state and executing
   * any associated functions of the target state.
   *
   * @param {string} targetState The name of the state to transition to.
   */
  const transition = (targetState) => {
    while (!unsubscribeQueue.isEmpty()) {
      const event = unsubscribeQueue.dequeue();
      eventEmitter.unsubscribe(event.name, event.callback);
    }
    setCurrentState(targetState);
  };

  /**
   * Sets the current state to the target state, executing associated functions and managing event subscriptions.
   *
   * @param {string} targetState The name of the state to set as the current state.
   * @throws {Error} Throws an error if the target state is not stored.
   */
  const setCurrentState = (targetState) => {
    const state = _storedStates.get(targetState);
    if (!state) return;
    _state.current = targetState;
    const { execute, subscribe } = state;
    execute.forEach((fn) => fn());
    subscribe.forEach(({ event, callback }) => {
      eventEmitter.subscribe(event, callback);
      unsubscribeQueue.enqueue({ name: event, callback });
    });
  };

  return {
    storeState,
    transition,
    getCurrentState: () => _state.current,
    getID: () => _id,
    isStateManager: () => true
  };
};
