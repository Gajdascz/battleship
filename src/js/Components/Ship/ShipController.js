// Ship Component
import { ShipModel } from './main/model/ShipModel';
import { ShipView } from './main/view/ShipView';
import {
  SHIP_SELECTION_EVENTS,
  SHIP_PLACEMENT_EVENTS,
  SHIP_COMBAT_EVENTS
} from './common/shipEvents';
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

  return {
    placement: {
      initialize: () => {
        ShipSelectionAndPlacementManager({
          model,
          view,
          componentEmitter
        });
        publish(SHIP_PLACEMENT_EVENTS.INITIALIZE);
      },
      isSelected: () => model.isSelected(),
      isPlaced: () => model.isPlaced(),
      getRotateButton: () => view.elements.getRotateButton(),
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
      initialize: () => {
        ShipCombatManager(model, view, componentEmitter);
        publish(SHIP_COMBAT_EVENTS.INITIALIZE);
      },
      hit: () => publish(SHIP_COMBAT_EVENTS.HIT),
      onHit: (callback) => publish(SHIP_COMBAT_EVENTS.SUB_HIT_PROCESSED, callback),
      offHit: (callback) => publish(SHIP_COMBAT_EVENTS.UNSUB_HIT_PROCESSED, callback),
      onSunk: (callback) => publish(SHIP_COMBAT_EVENTS.SUB_SUNK, callback),
      offSunk: (callback) => publish(SHIP_COMBAT_EVENTS.UNSUB_SUNK, callback),
      end: () => publish(SHIP_COMBAT_EVENTS.END)
    },
    properties: {
      getScoped: () => model.getScope(),
      getID: () => model.getID(),
      getScopedID: () => model.getScopedID(),
      isSelected: () => model.isSelected()
    },
    view: {
      getMainShip: () => view.elements.getMainShip(),
      getTrackingShip: () => view.elements.getTrackingShip()
    },
    getModel: () => model,
    getView: () => view
  };
};
