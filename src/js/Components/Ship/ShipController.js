// Ship Component
import { ShipModel } from './main/model/ShipModel';
import { ShipView } from './main/view/ShipView';
import { SHIP_EVENTS } from './common/shipEvents';
import { ShipSelectionAndPlacementManager } from './features/selectionAndPlacement/SelectionAndPlacementManager';
import { ShipCombatManager } from './features/combat/ShipCombatManager';
// External
import { EventEmitter } from '../../Events/core/EventEmitter';

export const ShipController = (scope, shipData) => {
  const { name, length } = shipData;
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });

  const componentEmitter = EventEmitter();

  ShipSelectionAndPlacementManager({
    model,
    view,
    componentEmitter
  });
  const combatManager = ShipCombatManager({ model, view, componentEmitter });

  return {
    properties: {
      getScoped: () => model.getScope(),
      getID: () => model.getID(),
      getScopedID: () => model.getScopedID(),
      isSelected: () => model.isSelected()
    },
    placement: {
      initialize: (container) =>
        componentEmitter.publish(SHIP_EVENTS.SELECTION_PLACEMENT.INITIALIZE_REQUESTED, {
          container
        }),
      end: () => componentEmitter.publish(SHIP_EVENTS.SELECTION_PLACEMENT.END_REQUESTED),
      select: () => {
        console.log(model.getID());
        componentEmitter.publish(SHIP_EVENTS.SELECTION.SELECT_REQUEST_RECEIVED);
      },
      deselect: () => componentEmitter.publish(SHIP_EVENTS.SELECTION.DESELECT_REQUEST_RECEIVED),
      setCoordinates: (coordinates) =>
        componentEmitter.publish(SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED, {
          coordinates
        }),
      subscribe: {
        select: (callback) => componentEmitter.subscribe(SHIP_EVENTS.SELECTION.SELECTED, callback),
        orientationToggled: (callback) =>
          componentEmitter.subscribe(SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED, callback)
      },
      unsubscribe: {
        select: (callback) =>
          componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.SELECTED, callback),
        orientationToggled: (callback) =>
          componentEmitter.unsubscribe(SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED, callback)
      }
    },
    combat: {
      initialize: () => combatManager.initialize(),
      hit: () => componentEmitter.publish(SHIP_EVENTS.COMBAT.HIT_REQUEST_RECEIVED)
    },
    getModel: () => model,
    getView: () => view
  };
};
