import { MainGridModel } from './main/model/MainGridModel';
import { MainGridView } from './main/view/MainGridView';
import { MainGridCombatManager } from './features/combat/MainGridCombatManager';
import { MAIN_GRID_EVENTS } from './common/mainGridEvents';
import { EventEmitter } from '../../../Events/core/EventEmitter';
import { MainGridPlacementManager } from './features/placement/MainGridPlacementManager';

export const MainGridController = (scope, boardConfig) => {
  const { numberOfRows, numberOfCols, letterAxis } = boardConfig;
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const componentEmitter = EventEmitter();
  MainGridPlacementManager(model, view, componentEmitter);
  const combatManager = MainGridCombatManager({ model, view, componentEmitter });

  return {
    placement: {
      requestInitialize: () =>
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.REQUEST.INITIALIZE),
      requestOrientationUpdate: (data) =>
        componentEmitter.publish(
          MAIN_GRID_EVENTS.PLACEMENT.REQUEST.ENTITY_ORIENTATION_UPDATE,
          data
        ),
      requestPlacement: ({ data }) =>
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.REQUEST.ENTITY_PLACEMENT, data),
      requestSelectedEntityUpdate: ({ data }) => {
        console.log(data);
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.REQUEST.ENTITY_SELECT, data);
      },
      requestEnableSubmission: () =>
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.REQUEST.ENABLE_PLACEMENT_SUBMISSION),
      requestDisableSubmission: () =>
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.REQUEST.DISABLE_PLACEMENT_SUBMISSION),
      requestEnd: () => componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.REQUEST.END),
      onPlacementProcessed: ({ data }) =>
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.REQUEST.SUB_PLACEMENT_PROCESSED, {
          callback: data
        }),
      offPlacementProcessed: (callback) =>
        componentEmitter.publish(
          MAIN_GRID_EVENTS.PLACEMENT.REQUEST.UNSUB_PLACEMENT_PROCESSED,
          callback
        )
    },
    getGridElement: () => view.elements.getGrid(),
    getDimensions: () => model.getDimensions(),
    getModel: () => model,
    getView: () => view
  };
};
