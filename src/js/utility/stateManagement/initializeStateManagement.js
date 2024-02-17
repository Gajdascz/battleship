import { StateManager } from './StateManager';
import stateManagerRegistry from './stateManagerRegistry';
import { generateRandomID } from '../utils/stringUtils';

export const initializeStateManagement = ({ id = null, stateBundles }) => {
  const _id = id ?? generateRandomID();
  const stateManager = StateManager(_id);
  stateBundles.forEach((bundle) => stateManager.storeState(bundle));
  stateManagerRegistry.registerManager(stateManager);
};
