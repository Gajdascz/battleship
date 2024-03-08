// Ship Component
import { ShipModel } from './main/model/ShipModel';
import { ShipView } from './main/view/ShipView';
import { SelectionAndPlacementManagerFactory } from './features/selectionAndPlacement/SelectionAndPlacementManager';
import { CombatManagerFactory } from './features/combat/ShipCombatManager';
// External
import { EventEmitter } from '../../Events/core/EventEmitter';
import { EventHandler } from '../../Events/management/EventHandler';

export const ShipController = (scope, shipData) => {
  const { name, length } = shipData;
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });

  const emitter = EventEmitter();
  const createHandler = (eventName, callback = (args) => args) =>
    EventHandler(emitter, eventName, callback);

  const getId = () => model.getId();
  const getName = () => model.getName();
  const getScope = () => model.getScope();

  const getMainShipElement = () => view.elements.getMainShip();
  const getTrackingShipElement = () => view.elements.getTrackingShip();

  const placementManager = SelectionAndPlacementManagerFactory({ model, view, createHandler });
  const getPlacementManager = () => placementManager.getManager();

  const combatManager = CombatManagerFactory({ model, view, createHandler });
  const getCombatManager = () => combatManager.getManager();

  return {
    getPlacementManager,
    getCombatManager,
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
