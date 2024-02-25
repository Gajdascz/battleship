import { ShipModel } from './model/ShipModel';
import { ShipView } from './view/ShipView';
import { SHIP_EVENTS } from './events/shipEvents';
import { buildPublisher } from './events/buildPublisher';
import { StateCoordinator } from '../../utility/stateManagement/StateCoordinator';
import { MAIN_GRID_EVENTS } from '../Grids/MainGrid/utility/mainGridEvents';
import { ShipSelectionController } from './Selection/ShipSelectionController';
import { ShipPlacementController } from './Placement/ShipPlacementController';
import { ComponentEventEmitter } from '../../utility/events/ComponentEventEmitter';

export const ShipController = (scope, { name, length }) => {
  const model = ShipModel(scope, { shipName: name, shipLength: length });
  const view = ShipView({ name, length });
  const componentEventEmitter = ComponentEventEmitter();
  const publisher = buildPublisher(scope);
  const stateCoordinator = StateCoordinator(model.getScopedID(), model.getScope());
  const selectionController = ShipSelectionController({
    model,
    view,
    publisher,
    componentEventEmitter
  });
  const placementController = ShipPlacementController({
    model,
    view,
    publisher,
    componentEventEmitter
  });

  const initializeSelectionAndPlacement = ({ data }) => {
    selectionController.initialize();
    placementController.initialize({ data });

    const onSelect = () => {
      if (model.isPlaced()) placementController.pickup();
      placementController.request.enable();
    };
    componentEventEmitter.subscribe(SHIP_EVENTS.SELECTION.SELECTED, onSelect);
    componentEventEmitter.subscribe(SHIP_EVENTS.PLACEMENT.SET, selectionController.deselect);
    componentEventEmitter.subscribe(
      SHIP_EVENTS.SELECTION.DESELECTED,
      placementController.request.disable
    );
  };

  const endSelectionAndPlacement = () => {
    componentEventEmitter.reset();
    placementController.end();
    selectionController.end();
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
    initializeStateManagement: () => {
      // placement
      stateCoordinator.placement.addSubscribe(
        SHIP_EVENTS.PLACEMENT.CONTAINER_CREATED,
        initializeSelectionAndPlacement
      );
      stateCoordinator.placement.addDynamic({
        executeOn: MAIN_GRID_EVENTS.PLACEMENT.PROCESSED,
        callback: placementController.place,
        enableOn: SHIP_EVENTS.SELECTION.SELECTED,
        disableOn: SHIP_EVENTS.SELECTION.DESELECTED,
        scopedID: model.getScopedID()
      });
      stateCoordinator.placement.addSubscribe(
        MAIN_GRID_EVENTS.PLACEMENT.FINALIZED,
        endSelectionAndPlacement
      );
      // progress
      // stateCoordinator.progress.addExecute(enableCombatSettings);
      // stateCoordinator.progress.addSubscribe(
      //   PROGRESS_EVENTS.ATTACK_INITIATED,
      //   combatController.handleAttack
      // );
      stateCoordinator.initializeManager();
    }
  };
};
