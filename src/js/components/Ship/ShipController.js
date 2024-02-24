import { ShipModel } from './model/ShipModel';
import { ShipView } from './view/ShipView';
import { SHIP_EVENTS } from './utility/shipEvents';
import { PROGRESS_EVENTS } from '../../utility/constants/events';
import { STATUSES } from '../../utility/constants/common';
import { buildPublisher, PUBLISHER_KEYS } from './utility/buildPublisher';
import { StateCoordinator } from '../../utility/stateManagement/StateCoordinator';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { ShipSelectionController } from './Selection/ShipSelectionController';
import { ShipPlacementController } from './Placement/ShipPlacementController';

export const ShipController = (scope, { name, length }) => {
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });
  const publisher = buildPublisher(scope);
  const stateCoordinator = StateCoordinator(model.getScopedID(), model.getScope());
  const selectionController = ShipSelectionController({ model, view, publisher });
  const placementController = ShipPlacementController({
    model,
    view,
    publisher,
    selectionController
  });

  const endPlacement = () => {
    view.selection.end();
    view.placement.end();
  };

  const combatController = {
    hit: () => {
      const result = model.hit();
      if (result === STATUSES.SHIP_SUNK) {
        view.updateSunkStatus(true);
        publisher.execute(PUBLISHER_KEYS.ACTIONS.HIT, { id: model.getScope() });
      }
    },
    handleAttack: ({ data }) => {
      combatController.hit();
    }
  };

  const enableCombatSettings = () => {};

  return {
    getScope: () => model.getScope(),
    getID: () => model.getID(),
    getScopedID: () => model.getScopedID(),
    isSelected: () => model.isSelected(),
    getModel: () => model,
    getView: () => view,
    select: selectionController.select,
    deselect: selectionController.deselect,
    initializeStateManagement: () => {
      // placement
      stateCoordinator.placement.addExecute(selectionController.enable);
      stateCoordinator.placement.addSubscribe(
        SHIP_EVENTS.PLACEMENT.CONTAINER_CREATED,
        placementController.enable
      );
      stateCoordinator.placement.addDynamic({
        event: MAIN_GRID_EVENTS.PLACEMENT.PROCESSED,
        callback: placementController.place,
        subscribeTrigger: SHIP_EVENTS.SELECTION.SELECTED,
        unsubscribeTrigger: SHIP_EVENTS.SELECTION.DESELECTED,
        id: model.getScopedID()
      });
      stateCoordinator.placement.addSubscribe(MAIN_GRID_EVENTS.PLACEMENT.FINALIZED, endPlacement);
      // progress
      stateCoordinator.progress.addExecute(enableCombatSettings);
      stateCoordinator.progress.addSubscribe(
        PROGRESS_EVENTS.ATTACK_INITIATED,
        combatController.handleAttack
      );
      stateCoordinator.initializeManager();
    }
  };
};
