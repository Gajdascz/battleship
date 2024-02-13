import { STATES } from '../constants/common';

const isValidState = (state) => Object.values(STATES).some((validState) => validState === state);
const _registeredManagers = new Map();
const _state = { current: null };

const stateManagerRegistry = {
  getCurrentState: () => _state.current,
  registerManager: (manager) =>
    manager.isStateManager() ? _registeredManagers.set(manager.getID(), manager) : false,
  transition: (state) => {
    if (!isValidState(state)) throw new Error(`Invalid State: ${state}`);
    _state.current = state;
    _registeredManagers.forEach((manager) => manager.transition(state));
  }
};

export default stateManagerRegistry;
