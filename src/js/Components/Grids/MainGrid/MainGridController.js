import { MainGridModel } from './main/model/MainGridModel';
import { MainGridView } from './main/view/MainGridView';
import { MainGridPlacementController } from './features/placement/core/MainGridPlacementController';
import { MainGridCombatManager } from './features/combat/MainGridCombatManager';
import { MAIN_GRID_EVENTS } from './common/mainGridEvents';
import { EventEmitter } from '../../../Events/core/EventEmitter';

export const MainGridController = (scope, boardConfig) => {
  const { numberOfRows, numberOfCols, letterAxis } = boardConfig;
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const componentEmitter = EventEmitter();

  MainGridPlacementController({ model, view, componentEmitter });
  const combatManager = MainGridCombatManager({ model, view, componentEmitter });

  return {
    placement: {
      initialize: () => componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.INITIALIZE_REQUESTED),
      updatePreviewOrientation: ({ data }) => {
        const { orientation } = data;
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_ORIENTATION_UPDATED, {
          orientation
        });
      },
      requestPlacement: ({ data }) => {
        const { id, length } = data;
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_REQUESTED, {
          id,
          length
        });
      },
      updatePreviewEntity: ({ data }) => {
        const { id, length, orientation } = data;
        componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_SELECTED, {
          id,
          length,
          orientation
        });
      },
      subscribe: {
        placementProcessed: (callback) =>
          componentEmitter.subscribe(
            MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED,
            callback
          )
      },
      unsubscribe: {
        placementProcessed: (callback) =>
          componentEmitter.unsubscribe(
            MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_PROCESSED,
            callback
          )
      }
    },
    getGridElement: () => view.elements.getGrid(),
    getDimensions: () => model.getDimensions(),
    getModel: () => model,
    getView: () => view
  };
};
