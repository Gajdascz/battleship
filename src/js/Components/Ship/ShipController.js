// Ship Component
import { ShipModel } from './main/model/ShipModel';
import { ShipView } from './main/view/ShipView';
import { ShipSelectionAndPlacementManager } from './features/selectionAndPlacement/SelectionAndPlacementManager';
import { ShipCombatManager } from './features/combat/ShipCombatManager';
// External
import { EventEmitter } from '../../Events/core/EventEmitter';

export const ShipController = (scope, shipData) => {
  const { name, length } = shipData;
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });

  const emitter = EventEmitter();

  const placementManager = ShipSelectionAndPlacementManager({ model, view, emitter });
  const combatManager = ShipCombatManager({ model, view, emitter });

  const getId = () => model.getId();
  const getName = () => model.getName();
  const getScope = () => model.getScope();

  const getMainShipElement = () => view.elements.getMainShip();
  const getTrackingShipElement = () => view.elements.getTrackingShip();

  return {
    placementManager,
    combatManager,
    properties: {
      getId,
      getName,
      getScope
    },
    view: {
      getMainShipElement,
      getTrackingShipElement
    },
    getModel: () => model,
    getView: () => view
  };
};
