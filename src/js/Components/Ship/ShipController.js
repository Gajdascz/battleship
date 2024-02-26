import { ShipModel } from './model/ShipModel';
import { ShipView } from './view/ShipView';
import { SHIP_EVENTS } from './events/shipEvents';

import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { ShipSelectionController } from './Selection/ShipSelectionController';
import { ShipPlacementController } from './Placement/ShipPlacementController';
import { EventManager } from '../../Events/management/EventManager';

export const ShipController = (scope, { name, length }) => {
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });
  const { publisher, componentEmitter, subscriptionManager, resetEventManager } =
    EventManager(scope);

  const selectionController = ShipSelectionController({
    model,
    view,
    publisher,
    componentEmitter,
    subscriptionManager
  });
  const placementController = ShipPlacementController({
    model,
    view,
    publisher,
    componentEmitter,
    subscriptionManager
  });

  const endPlacement = () => {
    componentEmitter.publish(SHIP_EVENTS.PLACEMENT.OVER);
    resetEventManager();
  };

  const initializeSelectionAndPlacement = () => {
    selectionController.initialize();
    const emitShipPlacementCoordinates = (data) => {
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.PLACEMENT_COORDINATES_RECEIVED, data);
    };
    subscriptionManager.normal.scoped(
      SHIP_EVENTS.PLACEMENT.CONTAINER_CREATED,
      componentEmitter.publish(SHIP_EVENTS.PLACEMENT.CONTAINER_CREATED)
    );
    subscriptionManager.dynamic.scoped(
      MAIN_GRID_EVENTS.PLACEMENT.PROCESSED,
      emitShipPlacementCoordinates,
      {
        enableOn: SHIP_EVENTS.SELECTION.SELECTED,
        disableOn: SHIP_EVENTS.SELECTION.DESELECTED
      }
    );
    subscriptionManager.normal.scoped.subscribe(MAIN_GRID_EVENTS.PLACEMENT.FINALIZED, endPlacement);
  };

  return {
    getScope: () => model.getScope(),
    getID: () => model.getID(),
    getScopedID: () => model.getScopedID(),
    isSelected: () => model.isSelected(),
    getModel: () => model,
    getView: () => view,
    select: selectionController.select,
    deselect: selectionController.deselect,
    initializeStateManagement: () => initializeSelectionAndPlacement()
  };
};
