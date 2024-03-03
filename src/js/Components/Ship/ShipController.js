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
      requestInitialize: ({ data }) => {
        componentEmitter.publish(SHIP_EVENTS.SELECTION_PLACEMENT.INITIALIZE_REQUESTED, {
          container: data
        });
      },
      requestEnd: () => componentEmitter.publish(SHIP_EVENTS.SELECTION_PLACEMENT.END_REQUESTED),
      requestSelect: () => componentEmitter.publish(SHIP_EVENTS.SELECTION.REQUEST.SELECT),
      requestDeselect: () => componentEmitter.publish(SHIP_EVENTS.SELECTION.REQUEST.DESELECT),
      requestSetCoordinates: ({ data }) =>
        componentEmitter.publish(SHIP_EVENTS.PLACEMENT.REQUEST.SET_COORDINATES, {
          coordinates: data
        }),
      onSelected: ({ data }) =>
        componentEmitter.publish(SHIP_EVENTS.SELECTION.REQUEST.SUB_SELECTED, { callback: data }),
      onOrientationToggled: ({ data }) =>
        componentEmitter.publish(SHIP_EVENTS.SELECTION.REQUEST.SUB_ORIENTATION_TOGGLED, {
          callback: data
        }),
      offSelected: ({ data }) =>
        componentEmitter.publish(SHIP_EVENTS.SELECTION.REQUEST.UNSUB_SELECTED, { callback: data }),
      offOrientationToggled: ({ data }) =>
        componentEmitter.publish(SHIP_EVENTS.SELECTION.REQUEST.UNSUB_ORIENTATION_TOGGLED, {
          callback: data
        })
    },
    combat: {
      initialize: () => combatManager.initialize(),
      hit: () => componentEmitter.publish(SHIP_EVENTS.COMBAT.HIT_REQUEST_RECEIVED)
    },
    getModel: () => model,
    getView: () => view
  };
};
