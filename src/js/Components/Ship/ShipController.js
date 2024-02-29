// Ship Component
import { ShipModel } from './main/model/ShipModel';
import { ShipView } from './main/view/ShipView';
import { ShipSelectionAndPlacementManager } from './features/selectionAndPlacement/SelectionAndPlacementManager';

// External
import { EventManager } from '../../Events/management/EventManager';
import { GameStateManager } from '../../State/GameStateManager';
import stateManagerRegistry from '../../State/stateManagerRegistry';

export const ShipController = (scope, shipData) => {
  const { name, length } = shipData;
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });
  const { publisher, componentEmitter, subscriptionManager, resetEventManager } =
    EventManager(scope);

  const selectionAndPlacementManager = ShipSelectionAndPlacementManager({
    model,
    view,
    componentEmitter,
    publisher,
    subscriptionManager
  });
  const stateManager = GameStateManager(model.getScopedID());

  stateManager.setFunctions.placement({
    enterFns: selectionAndPlacementManager.initialize,
    exitFns: selectionAndPlacementManager.end
  });

  return {
    properties: {
      getScoped: () => model.getScope(),
      getID: () => model.getID(),
      getScopedID: () => model.getScopedID(),
      isSelected: () => model.isSelected()
    },
    placement: {
      select: () => selectionAndPlacementManager.select(),
      deselect: () => selectionAndPlacementManager.deselect()
    },
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager)
  };
};
