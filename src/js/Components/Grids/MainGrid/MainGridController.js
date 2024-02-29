import { MainGridModel } from './main/model/MainGridModel';
import { MainGridView } from './main/view/MainGridView';
import { EventManager } from '../../../Events/management/EventManager';
import { GameStateManager } from '../../../State/GameStateManager';
import stateManagerRegistry from '../../../State/stateManagerRegistry';

import { MainGridPlacementManager } from './features/placement/MainGridPlacementManager';
import { MainGridCombatManager } from './features/combat/MainGridCombatManager';

export const MainGridController = (scope, boardConfig) => {
  const { numberOfRows, numberOfCols, letterAxis } = boardConfig;
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const { publisher, subscriptionManager, componentEmitter } = EventManager(scope);
  const placementManager = MainGridPlacementManager({
    model,
    view,
    publisher,
    componentEmitter,
    subscriptionManager
  });
  const combatManager = MainGridCombatManager({ model, publisher, subscriptionManager });

  const stateManager = GameStateManager(model.getScopedID());

  stateManager.setFunctions.placement({
    enterFns: placementManager.initialize,
    exitFns: placementManager.end
  });
  stateManager.setFunctions.progress({
    enterFns: combatManager.initialize,
    exitFns: combatManager.end
  });

  return {
    getDimensions: () => model.getDimensions(),
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager)
  };
};
