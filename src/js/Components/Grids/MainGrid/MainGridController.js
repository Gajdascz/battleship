import { MainGridModel } from './model/MainGridModel';
import { MainGridView } from './view/MainGridView';
import { SHIP_EVENTS } from '../../Ship/events/shipEvents';
import { MainGridPlacementController } from './Placement/MainGridPlacementController';
import { MAIN_GRID_EVENTS } from './utility/mainGridEvents';
import { EventManager } from '../../../Events/management/EventManager';
import { GameStateManager } from '../../../State/GameStateManager';
import stateManagerRegistry from '../../../State/stateManagerRegistry';
export const MainGridController = (scope, boardConfig) => {
  const { numberOfRows, numberOfCols, letterAxis } = boardConfig;
  const model = MainGridModel(scope, { numberOfRows, numberOfCols, letterAxis });
  const view = MainGridView({ numberOfRows, numberOfCols, letterAxis });
  const { publisher, subscriptionManager, componentEmitter } = EventManager(scope);
  MainGridPlacementController({
    model,
    view,
    publisher,
    componentEmitter
  });

  const stateManager = GameStateManager(model.getScopedID());

  const handlers = {
    select: ({ data }) =>
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_SELECTED, data),
    orientationToggle: ({ data }) =>
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_ORIENTATION_UPDATED, data),
    placementRequest: ({ data }) =>
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.ENTITY_PLACEMENT_REQUESTED, data),
    toggleSubmitRequest: ({ data }) =>
      componentEmitter.publish(
        MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
        data
      ),
    finalizePlacements: ({ data }) =>
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED, data)
  };

  const placementManager = {
    subscriptions: [
      {
        event: SHIP_EVENTS.PLACEMENT.REQUESTED,
        callback: handlers.placementRequest
      },
      {
        event: MAIN_GRID_EVENTS.PLACEMENT.TOGGLE_PLACEMENT_SUBMISSION_REQUEST,
        callback: handlers.toggleSubmitRequest
      },
      {
        event: MAIN_GRID_EVENTS.PLACEMENT.FINALIZATION_REQUESTED,
        callback: handlers.finalizePlacements
      },
      { event: SHIP_EVENTS.SELECTION.SELECTED, callback: handlers.select },
      {
        event: SHIP_EVENTS.SELECTION.ORIENTATION_TOGGLED,
        callback: handlers.orientationToggle
      }
    ],
    subscribe: () => subscriptionManager.scoped.subscribeMany(placementManager.subscriptions),
    unsubscribe: () => subscriptionManager.all.unsubscribe(),
    initialize: () => {
      placementManager.subscribe();
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.INITIALIZE_REQUESTED);
    },

    end: () => {
      placementManager.unsubscribe();
      componentEmitter.publish(MAIN_GRID_EVENTS.PLACEMENT.END_REQUESTED);
      componentEmitter.reset();
    }
  };
  stateManager.setFunctions.placement(placementManager.initialize, placementManager.end);

  return {
    getDimensions: () => model.getDimensions(),
    getModel: () => model,
    getView: () => view,
    initializeStateManagement: () => stateManagerRegistry.registerManager(stateManager)
  };
};
