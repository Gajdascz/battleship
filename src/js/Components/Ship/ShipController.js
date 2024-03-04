// Ship Component
import { ShipModel } from './main/model/ShipModel';
import { ShipView } from './main/view/ShipView';
import { SHIP_SELECTION_EVENTS, SHIP_PLACEMENT_EVENTS } from './common/shipEvents';
import { ShipSelectionAndPlacementManager } from './features/selectionAndPlacement/SelectionAndPlacementManager';
import { ShipCombatManager } from './features/combat/ShipCombatManager';
// External
import { EventEmitter } from '../../Events/core/EventEmitter';

export const ShipController = (scope, shipData) => {
  const { name, length } = shipData;
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });

  const componentEmitter = EventEmitter();
  const { publish } = componentEmitter;

  ShipSelectionAndPlacementManager({
    model,
    view,
    componentEmitter
  });
  const combatManager = ShipCombatManager({ model, view, componentEmitter });

  return {
    placement: {
      initialize: () => {
        publish(SHIP_PLACEMENT_EVENTS.INITIALIZE);
      },
      select: () => publish(SHIP_SELECTION_EVENTS.SELECT),
      deselect: () => publish(SHIP_SELECTION_EVENTS.DESELECT),
      setCoordinates: (coordinates) => publish(SHIP_PLACEMENT_EVENTS.SET_COORDINATES, coordinates),
      onSelected: (callback) => publish(SHIP_SELECTION_EVENTS.SUB_SELECTED, callback),
      onOrientationToggled: (callback) =>
        publish(SHIP_SELECTION_EVENTS.SUB_ORIENTATION_TOGGLED, callback),
      offSelected: (callback) => publish(SHIP_SELECTION_EVENTS.UNSUB_SELECTED, callback),
      offOrientationToggled: (callback) =>
        publish(SHIP_SELECTION_EVENTS.UNSUB_ORIENTATION_TOGGLED, callback),
      end: () => publish(SHIP_PLACEMENT_EVENTS.END)
    },
    combat: {
      initialize: () => combatManager.initialize()
      // hit: () => publish()
    },
    properties: {
      getScoped: () => model.getScope(),
      getID: () => model.getID(),
      getScopedID: () => model.getScopedID(),
      isSelected: () => model.isSelected()
    },
    getModel: () => model,
    getView: () => view
  };
};
