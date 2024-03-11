// Ship Component
import { ShipModel } from './main/model/ShipModel';
import { ShipView } from './main/view/ShipView';
import { SelectionAndPlacementManagerFactory } from './features/selectionAndPlacement/SelectionAndPlacementManager';
import { CombatManagerFactory } from './features/combat/ShipCombatManager';
// External
import { EventEmitter } from '../../Events/core/EventEmitter';
import { EventHandler } from '../../Events/management/EventHandler';

export const ShipController = (shipData) => {
  const { name, length } = shipData;
  const model = ShipModel({ shipName: name, shipLength: length });
  const view = ShipView({ name, length });
  const id = model.id;

  const emitter = EventEmitter();
  const createHandler = (eventName, callback = (args) => args) =>
    EventHandler(emitter, eventName, callback);

  const getMainShipElement = () => view.elements.getMainShip();
  const getTrackingShipElement = () => view.elements.getTrackingShip();

  const placementManager = SelectionAndPlacementManagerFactory({ model, view, createHandler });
  const getPlacementManager = () => placementManager.getManager();

  const combatManager = CombatManagerFactory({ model, view, createHandler });
  const getCombatManager = () => combatManager.getManager();

  return {
    id,
    name,
    getPlacementManager,
    getCombatManager,
    view: {
      getMainShipElement,
      getTrackingShipElement
    },
    getModel: () => model,
    getView: () => view
  };
};
