import { MainGridModel } from './main/model/MainGridModel';
import { MainGridView } from './main/view/MainGridView';
import { MainGridCombatManager } from './features/combat/MainGridCombatManager';
import { MAIN_GRID_PLACEMENT_EVENTS } from './common/mainGridEvents';
import { EventEmitter } from '../../../Events/core/EventEmitter';
import { MainGridPlacementManager } from './features/placement/MainGridPlacementManager';

export const MainGridController = (scope, boardConfig) => {
  const { numberOfRows, numberOfCols, letterAxis } = boardConfig;
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const componentEmitter = EventEmitter();
  const { publish } = componentEmitter;
  MainGridPlacementManager(model, view, componentEmitter);
  // const combatManager = MainGridCombatManager({ model, view, componentEmitter });

  return {
    placement: {
      initialize: () => publish(MAIN_GRID_PLACEMENT_EVENTS.INITIALIZE),
      updateOrientation: (orientation) =>
        publish(MAIN_GRID_PLACEMENT_EVENTS.UPDATE_ORIENTATION, orientation),
      updateSelectedEntity: (entityData) => publish(MAIN_GRID_PLACEMENT_EVENTS.SELECT, entityData),
      enableSubmit: () => publish(MAIN_GRID_PLACEMENT_EVENTS.ENABLE_SUBMIT),
      disableSubmit: () => publish(MAIN_GRID_PLACEMENT_EVENTS.DISABLE_SUBMIT),
      onPlacementProcessed: (callback) => publish(MAIN_GRID_PLACEMENT_EVENTS.SUB_PLACED, callback),
      offPlacementProcessed: (callback) =>
        publish(MAIN_GRID_PLACEMENT_EVENTS.UNSUB_PLACED, callback),
      end: () => publish(MAIN_GRID_PLACEMENT_EVENTS.END)
    },
    //    getModel: () => model,
    properties: {
      getDimensions: () => model.getDimensions()
    },
    view: {
      attachTo: (container) => view.attachTo(container),
      attachWithinWrapper: (element) => view.attachWithinWrapper(element),
      getGrid: () => view.elements.getGrid(),
      getWrapper: () => view.elements.getWrapper(),
      getSubmitButton: () => view.elements.getSubmitPlacementsButton(),
      hide: () => view.hide(),
      show: () => view.show(),
      enable: () => view.enable(),
      disable: () => view.disable()
    }
  };
};
