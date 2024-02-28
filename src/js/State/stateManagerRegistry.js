import { STATES } from '../Utility/constants/common';

const isValidState = (state) => Object.values(STATES).some((validState) => validState === state);
const registeredManagers = new Map();
const state = { current: null };

const stateManagerRegistry = {
  getCurrentState: () => state.current,
  registerManager: (manager) =>
    manager.isStateManager ? registeredManagers.set(manager.getID(), manager) : false,
  initialize: ({ data }) => {
    state.current = data;
    registeredManagers.forEach((manager) => manager.initialize(state.current));
  },
  transition: ({ data }) => {
    if (!isValidState(data)) throw new Error(`Invalid State: ${data}`);
    state.current = data;
    registeredManagers.forEach((manager) => manager.transition(state.current));
  }
};

export default stateManagerRegistry;
