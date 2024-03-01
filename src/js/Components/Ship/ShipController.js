// Ship Component
import { ShipModel } from './main/model/ShipModel';
import { ShipView } from './main/view/ShipView';
import { SHIP_EVENTS } from './common/shipEvents';
import { ShipSelectionAndPlacementManager } from './features/selectionAndPlacement/SelectionAndPlacementManager';
import { ShipCombatManager } from './features/combat/ShipCombatManager';
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
  const combatManager = ShipCombatManager({ model, view, componentEmitter, publisher });
  const stateManager = GameStateManager(model.getScopedID());

  stateManager.setFunctions.placement({
    enterFns: selectionAndPlacementManager.initialize,
    exitFns: selectionAndPlacementManager.end
  });
  stateManager.setFunctions.progress({
    enterFns: combatManager.initialize,
    exitFns: combatManager.end
  });

  return {
    properties: {
      getScoped: () => model.getScope(),
      getID: () => model.getID(),
      getScopedID: () => model.getScopedID(),
      isSelected: () => model.isSelected()
    },
    placement: {
      select: () => componentEmitter.publish(SHIP_EVENTS.SELECTION.SELECT_REQUEST_RECEIVED),
      deselect: () => componentEmitter.publish(SHIP_EVENTS.SELECTION.DESELECT_REQUEST_RECEIVED)
    },
    combat: {
      hit: () => componentEmitter.publish(SHIP_EVENTS.COMBAT.HIT_REQUEST_RECEIVED)
    },
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager)
  };
};
