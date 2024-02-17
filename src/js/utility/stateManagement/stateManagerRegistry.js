import { STATES } from '../constants/common';

const isValidState = (state) => Object.values(STATES).some((validState) => validState === state);
const registeredManagers = new Map();
const state = { current: null };

const stateManagerRegistry = {
  getCurrentState: () => state.current,
  registerManager: (manager) =>
    manager.isStateManager() ? registeredManagers.set(manager.getID(), manager) : false,
  transition: ({ data }) => {
    if (!isValidState(data)) throw new Error(`Invalid State: ${data}`);
    state.current = data;
    registeredManagers.forEach((manager) => manager.transition(state.current));
  }
};

export default stateManagerRegistry;
